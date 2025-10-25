import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { Client } from "@notionhq/client";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Firestore collection & document keys
const COLLECTION = "notion-cache";
const CACHE_KEY = "data";

// Cooldowns (in ms)
const COOLDOWN_MS = 60 * 60 * 1000;        // 1 hour normal refresh
const FORCE_COOLDOWN_MS = 5 * 60 * 1000;   // 5 minutes for forced refresh

// Allowed origins for CORS
const allowedOrigins = [
  "https://3dime.com",
  "https://www.3dime.com",
  "http://localhost:4200",
  "http://localhost:5000",
];

// Configure CORS
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

export const notionFunction = onRequest(
  { secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID"] },
  async (req, res) => {
    return new Promise<void>((resolve) => {
      corsHandler(req, res, async () => {
        try {
          const forceRefresh = req.query.force === "true";
          const token = process.env.NOTION_TOKEN;
          const dataSourceId = process.env.NOTION_DATASOURCE_ID;

          if (!token || !dataSourceId) {
            res.status(400).json({ error: "Missing NOTION_TOKEN or NOTION_DATASOURCE_ID" });
            return resolve();
          }

          const cacheRef = db.collection(COLLECTION).doc(CACHE_KEY);
          const cacheSnap = await cacheRef.get();
          const now = Date.now();
          const cacheData = cacheSnap.exists ? cacheSnap.data() : null;

          // 🔹 Step 1: Always respond immediately with cached data if available
          if (cacheData?.data) {
            res.status(200).json({ ...cacheData.data, fromCache: true });
          }

          const lastCheck = cacheData?.lastCheckAt || 0;
          const version = cacheData?.version || null;
          const canRefresh = now - lastCheck > COOLDOWN_MS;
          const canForce = now - lastCheck > FORCE_COOLDOWN_MS;

          // 🔹 Step 2: Prevent too frequent refreshes
          if (!forceRefresh && !canRefresh) {
            console.log("⏳ Cooldown active — skipping Notion refresh.");
            return resolve();
          }

          if (forceRefresh && !canForce) {
            console.warn("🚫 Force refresh too frequent — skipping request.");
            return resolve();
          }

          // 🔹 Step 3: Fetch latest data from Notion
          const notion = new Client({ auth: token });
          const response = await notion.dataSources.query({
            data_source_id: dataSourceId,
            filter: { property: "Name", rich_text: { is_not_empty: true } },
            sorts: [{ property: "Rank", direction: "ascending" }],
          });

          // 🔹 Step 4: Group data by category
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

          // 🔹 Step 5: Compute version hash (simple string length hash for simplicity)
          const newVersion = JSON.stringify(grouped).length.toString(16);

          // 🔹 Step 6: Update cache only if data changed
          if (newVersion !== version) {
            await cacheRef.set({
              version: newVersion,
              data: grouped,
              lastCheckAt: now,
              updatedAt: new Date().toISOString(),
            });
            console.log("✅ Cache updated (new version).");
          } else {
            await cacheRef.update({ lastCheckAt: now });
            console.log("ℹ️ Cache checked — no changes detected.");
          }

          // 🔹 Step 7: If there was no cached data, respond with live data
          if (!cacheData?.data) {
            res.status(200).json({ ...grouped, fromCache: false });
          }

          resolve();
        } catch (err: any) {
          console.error("🔥 Notion proxy error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: err.message });
          }
          resolve();
        }
      });
    });
  }
);
