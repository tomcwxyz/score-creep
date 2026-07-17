// Vercel serverless function — proxies chat completions to Anthropic
// so the API key never reaches the browser.
//
// Env var required: ANTHROPIC_API_KEY

// Very small in-memory rate limit (per instance — good enough for a demo,
// not a substitute for a real limiter if this gets wide traffic).
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const record = hits.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > record.reset) { record.count = 0; record.reset = now + WINDOW_MS; }
  record.count += 1;
  hits.set(ip, record);
  if (record.count > MAX_PER_WINDOW) {
    res.status(429).json({ error: "Too many requests — slow down and try again shortly." });
    return;
  }

  const { system, messages } = req.body || {};
  if (!system || !messages) {
    res.status(400).json({ error: "Missing system or messages in request body" });
    return;
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages
      })
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Upstream request failed", detail: String(err) });
  }
}
