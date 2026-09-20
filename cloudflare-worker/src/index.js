/**
 * Cloudflare Worker — cron trigger for the NewsAI scraper.
 *
 * Every run (see [triggers] in wrangler.toml) it calls the Next.js
 * /api/scrape endpoint with the shared secret header.
 *
 * Required secret:
 *   wrangler secret put CRON_SECRET
 *
 * Two variables (set in wrangler.toml [vars] or as secrets):
 *   SCRAPE_URL  - full URL to the endpoint, e.g.
 *                 https://your-app.vercel.app/api/scrape
 *   CRON_SECRET - same value as CRON_SECRET in the Next.js app
 */

const FETCH_TIMEOUT_MS = 300_000; // 5 min — matches maxDuration on the route

async function runScrape(env) {
  const scrapeUrl = env.SCRAPE_URL;
  const cronSecret = env.CRON_SECRET;

  if (!scrapeUrl || !cronSecret) {
    console.error("Missing SCRAPE_URL or CRON_SECRET");
    return { ok: false, error: "missing configuration" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(scrapeUrl, {
      method: "GET",
      headers: { "x-cron-secret": cronSecret },
      signal: controller.signal,
    });

    const text = await res.text();
    if (!res.ok) {
      console.error(`Scrape failed (${res.status}): ${text}`);
      return { ok: false, status: res.status, body: text };
    }

    console.log(`Scrape ok: ${text}`);
    return { ok: true, status: res.status, body: text };
  } catch (err) {
    console.error("Scrape request error:", err);
    return { ok: false, error: String(err) };
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  /**
   * Cron-triggered handler.
   * @param {ScheduledController} controller
   * @param {Record<string, unknown>} env
   * @param {ExecutionContext} ctx
   */
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runScrape(env));
  },

  /**
   * Optional manual HTTP trigger (useful for testing):
   *   curl https://<worker>.workers.dev/?secret=<CRON_SECRET>
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    // This worker is not meant to be a public API. Require the secret to
    // manually trigger a run over HTTP.
    if (env.CRON_SECRET && url.searchParams.get("secret") !== env.CRON_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }

    const result = await runScrape(env);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 502,
      headers: { "content-type": "application/json" },
    });
  },
};