# PLAN — Score Creep

## Goal
Turn the single-scenario demo into a pick-and-play game, sharpen the payoff screen, and
ship it — while staying single-file, no framework, no new deps.

## Done
- [x] 8 players (applicants) × 8 levels (funders) as inline data; any pairing allowed.
- [x] Arcade "① Choose your player / ② Choose your level" select screen (+ SURPRISE ME).
- [x] "③ Contenders ready" matchup screen — reveals on selection, shows the exact
      applicant-vs-funder text both models will see, fully editable before RUN.
- [x] GAME OVER reveal: S–D rank stamp, framing-vs-real-change meter, BIASES CRACKED n/2
      (cross-references active hidden biases vs levers pulled), levers list, punchline.
- [x] Handles non-monotonic runs: per-round up/down deltas + BACKFIRED end-verdict when a
      run nets the wrong way.
- [x] Cost hint (~N Claude calls per run). RUN gated until both sides chosen.
- [x] Verified all UI end-to-end in a headless browser with the API mocked (no spend).

## Deploy (owner: Tom)
- [ ] `cp .env.example .env.local`, paste `ANTHROPIC_API_KEY`.
- [ ] `vercel dev`, play one real round (confirms live scoring is non-monotonic as expected).
- [ ] Set spend cap on the key.
- [ ] `vercel --prod`.

## Deliberately not done (available on request)
- Shared-password gate on the page (one-line add to `api/complete.js` + a page prompt).
- KV-backed rate limiting (would add a dependency).
- Model stays `claude-sonnet-4-6` (valid, cost-sensible for a ~16-call loop).
