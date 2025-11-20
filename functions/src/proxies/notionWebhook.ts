import { onRequest } from "firebase-functions/v2/https";
import { Client } from "@notionhq/client";
import { CacheManager, simpleHash } from "../utils/cache";
import { initializeFirebaseAdmin } from "../utils/firebase-admin";
import { log } from "firebase-functions/logger";
import crypto from "crypto";

// Initialize Firebase Admin SDK
initializeFirebaseAdmin();

// Cache configuration: 24 hour TTL since webhook will update cache proactively
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const FORCE_COOLDOWN = 5 * 60 * 1000; // 5 minutes

type NotionData = Record<string, any[]>;

/**
 * Verify Notion webhook signature
 * Notion sends a signature in the header to verify the webhook is authentic
 * 
 * @param body Request body as string
 * @param signature Signature from Notion-Signature header
 * @param secret Webhook secret configured in Notion
 * @returns true if signature is valid
 */
function verifyNotionSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Notion uses HMAC-SHA256 for webhook signatures
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const expectedSignature = hmac.digest("hex");
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    log("Signature verification error", { error: err });
    return false;
  }
}

/**
 * Fetch fresh data from Notion API
 * This is the same logic as in notion.ts but extracted for reuse
 */
async function fetchNotionData(
  token: string,
  dataSourceId: string
): Promise<NotionData> {
  const notion = new Client({ auth: token });
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "Name", rich_text: { is_not_empty: true } },
    sorts: [{ property: "Rank", direction: "ascending" }],
  });

  // Group data by category
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

  return grouped;
}

/**
 * Notion Webhook Handler
 * 
 * This function receives webhook notifications from Notion when the database changes.
 * It fetches fresh data and updates the cache immediately, enabling instant cache refresh.
 * 
 * Security:
 * - Verifies webhook signature to ensure request is from Notion
 * - Requires NOTION_WEBHOOK_SECRET environment variable
 * 
 * Configuration in Notion:
 * 1. Go to Notion Settings > Integrations > Your Integration
 * 2. Add webhook with URL pointing to this function
 * 3. Set webhook secret and add to Firebase secrets
 * 
 * @example
 * // Webhook URL: https://notionwebhook-fuajdt22nq-uc.a.run.app
 * // Request from Notion will trigger cache refresh
 */
export const notionWebhook = onRequest(
  { 
    secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID", "NOTION_WEBHOOK_SECRET"],
    timeoutSeconds: 60,
  },
  async (req, res) => {
    try {
      log("Notion webhook received", {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });

      // Only accept POST requests
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const token = process.env.NOTION_TOKEN;
      const dataSourceId = process.env.NOTION_DATASOURCE_ID;
      const webhookSecret = process.env.NOTION_WEBHOOK_SECRET;

      if (!token || !dataSourceId) {
        log("Missing NOTION_TOKEN or NOTION_DATASOURCE_ID");
        res.status(500).json({ error: "Missing configuration" });
        return;
      }

      // Verify webhook signature if secret is configured
      if (webhookSecret) {
        const signature = req.headers["notion-signature"] as string;
        if (!signature) {
          log("Missing Notion-Signature header");
          res.status(401).json({ error: "Missing signature" });
          return;
        }

        const bodyString = JSON.stringify(req.body);
        if (!verifyNotionSignature(bodyString, signature, webhookSecret)) {
          log("Invalid webhook signature");
          res.status(401).json({ error: "Invalid signature" });
          return;
        }
      } else {
        log("NOTION_WEBHOOK_SECRET not configured - skipping signature verification");
      }

      // Create cache manager with extended TTL
      const cache = new CacheManager<NotionData>({
        collection: "notion-cache",
        key: "data",
        ttl: CACHE_TTL,
        forceCooldown: FORCE_COOLDOWN,
      });

      // Fetch fresh data from Notion
      log("Fetching fresh data from Notion API");
      const freshData = await fetchNotionData(token, dataSourceId);

      // Update cache directly
      await cache.set(freshData, simpleHash);

      log("Cache updated successfully via webhook", {
        categories: Object.keys(freshData),
        itemCount: Object.values(freshData).reduce((sum, items) => sum + items.length, 0),
      });

      res.status(200).json({
        success: true,
        message: "Cache updated successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      log("Notion webhook error", { error: err.message, stack: err.stack });
      res.status(500).json({ 
        error: "Internal server error",
        message: err.message,
      });
    }
  }
);
