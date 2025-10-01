import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";

const corsHandler = cors({ origin: true });

export const notionFunction = onRequest(
  { secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID"] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const token = process.env.NOTION_TOKEN;
        const dataSourceId = process.env.NOTION_DATASOURCE_ID;
        if (!token || !dataSourceId) {
          res.status(400).json({ error: "Missing NOTION_TOKEN or NOTION_DATASOURCE_ID" });
          return;
        }

        const { Client } = require('@notionhq/client');
        const notion = new Client({ auth: token });

        const response = await notion.dataSources.query({
          data_source_id: dataSourceId,
        });


    const items = response.results.map((page: any) => ({
      name: page.properties?.Name?.rich_text?.[0]?.plain_text || "",
      url: page.properties?.URL?.url || "",
      description: page.properties?.Description?.rich_text?.[0]?.plain_text || "",
      rank: page.properties?.Rank?.number || 0,
      category: page.properties?.Category?.select?.name || "Uncategorized",
    }));

    // --- Group by category ---
    const grouped: Record<string, any[]> = {};
    for (const item of items) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push({
        name: item.name,
        url: item.url,
        description: item.description,
        rank: item.rank,
      });
    }

    // --- Sort within each category by rank ---
    for (const category in grouped) {
      grouped[category].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    }

      console.log("Grouped results:", JSON.stringify(grouped, null, 2));
        res.status(200).json(grouped);

      } catch (err: any) {
        console.error("Notion proxy error:", err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);
