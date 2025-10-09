import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import cors from "cors";
import fetch from "node-fetch";

export { githubCommits } from "./proxies/githubCommits";
export { githubSocial } from "./proxies/githubSocial";
export { notionFunction } from "./proxies/notion";
export { converterFunction } from "./proxies/converter";

setGlobalOptions({ maxInstances: 10 });

// Whitelist of allowed origins for CORS
const allowedOrigins = [
  'https://3dime.com',
  'https://www.3dime.com',
  'http://localhost:4200',
  'http://localhost:5000'
];

const corsHandler = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});

export const proxyApi = onRequest((req, res) => {
  // return target
  return corsHandler(req, res, async () => {
    try {
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      const target = req.query.target as string;
      if (!target) {
        return res.status(400).json({ error: "Missing target" });
      }

     // return json with target url
      return res.status(200).json({ "target": target });

    } catch (err: any) {
      console.error("Proxy error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
});
