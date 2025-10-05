import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { Client } from "@notionhq/client";

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

export const notionFunction = onRequest(
  { secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID"] },
  (req, res) => {
    return corsHandler(req, res, () => {
      const token = process.env.NOTION_TOKEN;
      const dataSourceId = process.env.NOTION_DATASOURCE_ID;

      if (!token || !dataSourceId) {
        return res.status(400).json({ error: "Missing NOTION_TOKEN or NOTION_DATASOURCE_ID" });
      }

      const notion = new Client({ auth: token });

      return notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Name",
          rich_text: { is_not_empty: true },
        },
        sorts: [{ property: "Rank", direction: "ascending" }],
      })
      .then((response: any) => {

        const grouped = response.results.reduce((acc: Record<string, any[]>, page: any) => {
          const item = {
            name: page.properties?.Name?.rich_text?.[0]?.plain_text ?? "",
            url: page.properties?.URL?.url ?? "",
            description: page.properties?.Description?.rich_text?.[0]?.plain_text ?? "",
            rank: page.properties?.Rank?.number ?? 0,
            category: page.properties?.Category?.select?.name ?? "Uncategorized",
          };
          (acc[item.category] ||= []).push(item);
          return acc;
        }, {});

        return res.status(200).json(grouped);
      })
      .catch((err: any) => {
        console.error("Notion proxy error:", err);
        return res.status(500).json({ error: err.message });
      });
    });
  }
);
