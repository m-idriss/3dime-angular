import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import cors from "cors";
import fetch from "node-fetch";

export { githubCommits } from "./proxies/githubCommits";
export { githubSocial } from "./proxies/githubSocial";
export { notionFunction } from "./proxies/notion";

setGlobalOptions({ maxInstances: 10 });

const corsHandler = cors({ origin: true });

export const proxyApi = onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      const target = req.query.target as string;
      if (!target) {
        return res.status(400).json({ error: "Missing target" });
      }

      const targets: Record<string, string> = {
        profile: "https://githubsocial-fuajdt22nq-uc.a.run.app",
        social: "https://githubsocial-fuajdt22nq-uc.a.run.app?target=social",
        commit: "https://githubcommits-fuajdt22nq-uc.a.run.app",
        notion: "https://notionfunction-fuajdt22nq-uc.a.run.app",
      };

      if (!targets[target]) {
        return res.status(400).json({ error: "Invalid target" });
      }

      let url = targets[target];

      if (target === "commit" && req.query.months) {
        url += `?months=${req.query.months}`;
      }

      const response = await fetch(url, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body: ["POST", "PUT", "PATCH"].includes(req.method)
          ? JSON.stringify(req.body)
          : undefined,
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Proxy error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
});
