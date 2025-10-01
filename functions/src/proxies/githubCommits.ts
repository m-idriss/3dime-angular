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
    corsHandler(req, res, async () => {
      try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
          res.status(500).json({ error: "GitHub token not configured" });
          return;
        }

        const body = {
          query: `
            query {
              user(login: "m-idriss") {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
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
          `,
        };

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const data: any = await response.json();

        if (data.errors) {
          res.status(500).json({ error: data.errors });
          return;
        }

        const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
        const commits: CommitData[] = weeks.flatMap((week: any) =>
          week.contributionDays.map((day: any) => ({
            date: new Date(day.date).getTime(),
            value: day.contributionCount
          }))
        );

        res.status(200).json(commits);
      } catch (err: any) {
        console.error("GitHub proxy error:", err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);
