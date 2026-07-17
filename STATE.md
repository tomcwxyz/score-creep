# STATE — Score Creep

## What it is
Static `index.html` (all content + game logic + styling inline) + one Vercel serverless
function `api/complete.js` that proxies to the Anthropic API, keeping the key server-side.
No framework, no build, no database.

## Architecture
- Browser orchestrates the loop client-side: for each level it POSTs to `/api/complete`
  once as the **scorer**, once as the **applicant/reviser**; one final **verdict** call.
  So each serverless invocation handles exactly one short Claude call (well within the
  30s `maxDuration` in `vercel.json`).
- Model: `claude-sonnet-4-6`. Two hidden biases per run are chosen at random from a pool
  of six; the applicant never sees them until the reveal.
- Content lives in `PLAYERS` and `LEVELS` arrays near the top of the `<script>` block.
  `BIAS_LEVERS` maps each hidden bias to the lever(s) that target it (keyed by the exact
  bias strings) so the "BIASES CRACKED" scoring is an exact match.

## Status
- UI complete and verified end-to-end in a headless browser (API mocked).
- NOT yet run against the live API or deployed — needs `ANTHROPIC_API_KEY` in `.env.local`
  and a `vercel dev` / `vercel --prod` pass (owner-driven; spend cap to be set first).

## Known / by-design
- Live scores are non-monotonic (independent, slightly noisy scorer + blind lever guessing).
  UI handles this; the reveal reports the net result.
- Model output is inserted into the DOM via `innerHTML` (verdict text, revised drafts),
  matching the original demo. Fine for a personal/research demo; would need escaping if
  ever driven by untrusted third-party input.
- Rate limiter is in-memory per instance (demo-grade; see README).
