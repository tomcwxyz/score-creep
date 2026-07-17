# Score Creep

Arcade-styled research demo: **can an LLM grant-screening tool be gamed into a higher
score without the underlying application actually improving?**

Two Claude calls loop against each other:

- **Scorer** — plays an automated grant screen. Sees the fund's stated criteria plus
  two *hidden, randomly-chosen biases* it must never reveal. Returns a 0–100 score and a
  deliberately vague comment.
- **Applicant** — sees only the score and the vague comment. Each round it picks one
  "lever" (quantify claims, strip hedging, mirror the criteria wording, front-load
  outcomes…) and rewrites the application — **forbidden from inventing new facts**.

At the end a third call splits first-vs-final into **substantive** vs **stylistic**
changes, and a GAME-OVER scoreboard scores how much of the movement was pure framing and
which hidden biases the applicant cracked.

Everything is fictional — no real funder, no real organisation, no real funding.

## How you play

1. **① Choose your player** — one of 8 applicants (varied sectors and drafting styles).
2. **② Choose your level** — one of 8 funders, each with its own criteria.
3. **③ Contenders ready** — the matchup appears: review and tweak the exact text both
   models will see, then press **RUN**.
4. Watch the score creep level by level; read the **GAME OVER** reveal.

Scores are *not* monotonic — because each scoring call is an independent (slightly noisy)
judgment and the applicant guesses levers blind, individual rounds can dip. The end
verdict reflects the net result (SCREEN GAMED / EARNED IT / NO CREEP / BACKFIRED).

## Run locally

Vercel's CLI runs the static page and the serverless function together:

```
cp .env.example .env.local        # then paste your key into .env.local
npm i -g vercel                   # skip if already installed
vercel dev                        # open the printed localhost URL
```

`.env.local` must contain `ANTHROPIC_API_KEY=sk-ant-...`. It is git-ignored — never commit it.

## Deploy (Vercel)

```
vercel                 # link/create project, accept defaults
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

Static `index.html` plus one serverless function at `api/complete.js`. No framework, no
database, no build step.

## Files

- `index.html` — the whole front end: content (8 players × 8 funders), game logic, arcade
  styling, all inline.
- `api/complete.js` — serverless proxy that holds `ANTHROPIC_API_KEY` server-side and
  forwards to Anthropic (model: `claude-sonnet-4-6`), with a basic per-IP rate limit.
- `vercel.json` — function config.
- `.env.example` — template; copy to `.env.local` for local dev.
- `PLAN.md` / `STATE.md` — working notes.

## Before sharing the link publicly

- **Set a spend cap** on the API key. A single run makes ~2 × (iterations) Claude calls
  (default 8 iterations → ~16 calls).
- The rate limiter in `api/complete.js` is in-memory per function instance — fine for a
  demo, not bulletproof. Consider Vercel edge rate limiting or a KV-backed limiter for
  real traffic.
- A shared password on the page is a one-line add (proxy checks a secret + a prompt on
  the page) if this is for a specific funder conversation rather than open publication.
