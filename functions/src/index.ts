import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
export { githubCommits } from "./proxies/githubCommits";
export { githubSocial } from "./proxies/githubSocial";
export { notionFunction } from "./proxies/notion";

setGlobalOptions({ maxInstances: 10 });

export const proxyApi = onRequest(async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const target = req.query.target as string;

    const targets: Record<string, string> = {
      profile: "https://githubsocial-fuajdt22nq-uc.a.run.app",
      social: "https://githubsocial-fuajdt22nq-uc.a.run.app?target=social",
      commit: "https://githubcommits-fuajdt22nq-uc.a.run.app",
      notion: "https://notionfunction-fuajdt22nq-uc.a.run.app"
    };

    if (!target || !targets[target]) {
      res.status(400).send({ error: "Invalid target" });
      return;
    }

    const response = await fetch(targets[target], {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await response.json();
    res.status(response.status).send(data);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});
