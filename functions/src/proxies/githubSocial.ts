import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import cors from "cors";

const corsHandler = cors({ origin: true });

type GitHubError = { message?: string };

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

        // Build API URL safely
        const apiUrl = new URL(`https://api.github.com/users/m-idriss`);
        if (req.query.target === "social") {
          apiUrl.pathname += "/social_accounts";
        }

        // Fetch with proper headers
        const response = await fetch(apiUrl.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "firebase-function-proxy",
          },
        });

        // Handle errors with proper typing
        if (!response.ok) {
          const errBody = (await response.json().catch(() => ({}))) as GitHubError;
          res.status(response.status).json({
            error: errBody.message || "GitHub API error",
          });
          return;
        }

        const data = await response.json();

        // Cache response for 5 minutes
        res.set("Cache-Control", "public, max-age=300, s-maxage=600");

        res.status(200).json(data);

      } catch (err: any) {
        console.error("GitHub proxy error:", err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);
