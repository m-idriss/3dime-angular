import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import cors from "cors";

const corsHandler = cors({ origin: true });

export interface CommitData {
  date: number;
  value: number;
}

export const githubCommits = onRequest(
  { secrets: ["GITHUB_TOKEN"] },
  (req, res) => {
    return corsHandler(req, res, () => {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      const months = parseInt((req.query.months as string) ?? "12", 10);
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - months);

      const query = `
        query {
          user(login: "m-idriss") {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      return fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      })
        .then((response) => response.json())
        .then((data: any) => {
          if (data.errors) {
            return res.status(500).json({ error: data.errors });
          }

          const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
          const commits = weeks.flatMap((week: any) =>
            week.contributionDays
              .map((day: any) => ({
                date: new Date(day.date).getTime(),
                value: day.contributionCount,
              }))
              .filter((d: any) => d.date >= cutoff.getTime()) // <= filtre ici
          );

          return res.status(200).json(commits);
        })
        .catch((err) => {
          console.error("GitHub proxy error:", err);
          return res.status(500).json({ error: err.message });
        });
    });
  }
);
