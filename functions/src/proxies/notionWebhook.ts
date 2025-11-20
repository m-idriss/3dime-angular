import { onRequest } from "firebase-functions/v2/https";
import { CacheManager, simpleHash } from "../utils/cache";
import { initializeFirebaseAdmin } from "../utils/firebase-admin";
import { fetchNotionData, NotionData } from "../utils/notion";
import { log } from "firebase-functions/logger";
import crypto from "crypto";

// Initialize Firebase Admin SDK
initializeFirebaseAdmin();

// Cache configuration: 24 hour TTL since webhook will update cache proactively
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const FORCE_COOLDOWN = 5 * 60 * 1000; // 5 minutes

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
    secrets: ["NOTION_TOKEN", "NOTION_DATASOURCE_ID"],
    timeoutSeconds: 60,
  },
  async (req, res) => {
    try {
      // Log webhook receipt without exposing sensitive data
      const safeHeaders = Object.keys(req.headers)
        .filter((key) => !key.toLowerCase().includes("signature") && !key.toLowerCase().includes("auth"))
        .reduce((acc: Record<string, any>, key) => {
          acc[key] = req.headers[key];
          return acc;
        }, {});

      log("Notion webhook received", {
        method: req.method,
        headers: safeHeaders,
        bodySize: req.rawBody?.length || JSON.stringify(req.body).length,
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
        // Use case-insensitive header retrieval
        const signature = (req.headers["notion-signature"] ||
                          req.headers["Notion-Signature"]) as string;
        if (!signature) {
          log("Missing Notion-Signature header");
          res.status(401).json({ error: "Missing signature" });
          return;
        }

        // Use raw body for signature verification to match what Notion signed
        // Firebase Functions v2 provides rawBody which is the original request body
        if (!req.rawBody) {
          log("Raw body not available for signature verification");
          res.status(400).json({ error: "Cannot verify signature without raw body" });
          return;
        }

        const bodyString = req.rawBody.toString("utf8");
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
