import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { Client } from "@notionhq/client";
import admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// CORS configuration
const allowedOrigins = [
  "https://3dime.com",
  "https://www.3dime.com",
  "http://localhost:4200",
  "http://localhost:5000",
];

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});

// Cache config
const CACHE_COLLECTION = "notionCache";
const CACHE_DOC = "educationData";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MIN_REQUEST_INTERVAL_MS = 30 * 1000; // 30 seconds (anti-spam)

export const notionFunction = onRequest(
  { secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID"] },
  async (req, res) => {
    return corsHandler(req, res, async () => {
      const token = process.env.NOTION_TOKEN;
      const dataSourceId = process.env.NOTION_DATASOURCE_ID;
      if (!token || !dataSourceId) {
        return res.status(400).json({ error: "Missing NOTION_TOKEN or NOTION_DATASOURCE_ID" });
      }

      const notion = new Client({ auth: token });
      const cacheRef = db.collection(CACHE_COLLECTION).doc(CACHE_DOC);

      try {
        const cacheSnap = await cacheRef.get();
        const now = Date.now();

        if (cacheSnap.exists) {
          const cache = cacheSnap.data()!;
          const age = now - cache.updatedAt;
          const sinceLastRequest = now - (cache.lastRequestAt ?? 0);

          // ✅ Anti-spam: too frequent requests (within 30s)
          if (sinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
            console.log("Too many requests, serving cached data");
            await cacheRef.update({ lastRequestAt: now });
            return res.status(200).json(cache.data);
          }

          // ✅ Serve cache if still fresh
          if (age < CACHE_TTL_MS) {
            console.log("Serving cached data");
            await cacheRef.update({ lastRequestAt: now });
            return res.status(200).json(cache.data);
          }
        }

        // 🧠 Fetch new data from Notion
        console.log("Fetching new data from Notion...");
        const response = await notion.dataSources.query({
          data_source_id: dataSourceId,
          filter: {
            property: "Name",
            rich_text: { is_not_empty: true },
          },
          sorts: [{ property: "Rank", direction: "ascending" }],
        });

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

        // 💾 Store in cache
        await cacheRef.set({
          data: grouped,
          updatedAt: now,
          lastRequestAt: now,
        });

        console.log("Cache updated successfully");
        return res.status(200).json(grouped);
      } catch (err: any) {
        console.error("Notion proxy error:", err);
        return res.status(500).json({ error: err.message });
      }
    });
  }
);
