import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import cors from "cors";

const corsHandler = cors({ origin: true });

export const githubSocial = onRequest(
  { secrets: ["GITHUB_TOKEN"] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
          res.status(500).json({ error: "GitHub token not configured" });
          return;
        }

        let api_url = `https://api.github.com/users/m-idriss`;

        const target = req.query.target as string;

        if (target === "social") {
          api_url += `/social_accounts`;
        }

        const response = await fetch(api_url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          res
            .status(response.status)
            .json({ error: "Failed to fetch social accounts" });
          return;
        }

        const data: any = await response.json();
        res.status(200).json(data);

      } catch (err: any) {
        console.error("GitHub proxy error:", err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);
