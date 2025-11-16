import { Client } from "@notionhq/client";
import { log } from "firebase-functions/logger";

/**
 * Plans with different quota limits
 */
export type PlanType = "free" | "pro" | "premium";

/**
 * Quota entry interface
 */
export interface QuotaEntry {
  userId: string;
  usageCount: number;
  lastReset: Date;
  plan: PlanType;
}

/**
 * Quota limits by plan
 */
const QUOTA_LIMITS: Record<PlanType, number> = {
  free: 3,
  pro: 100,
  premium: 1000,
};

/**
 * Service for managing user quotas in Notion
 */
export class QuotaService {
  private notion?: Client;
  private quotaDbId?: string;
  private isEnabled: boolean;
  private notionToken?: string;

  constructor() {
    this.quotaDbId = process.env.NOTION_QUOTA_DB_ID;
    this.notionToken = process.env.NOTION_TRACKING_TOKEN;
    this.isEnabled = !!(this.quotaDbId && this.notionToken);

    if (this.isEnabled && this.notionToken) {
      this.notion = new Client({ auth: this.notionToken });
      log("Quota service ENABLED", { databaseId: this.quotaDbId });
    } else {
      log("Quota service DISABLED (missing token or database ID)");
    }
  }

  /**
   * Get the current quota limit for a user based on their plan
   */
  getQuotaLimit(plan: PlanType): number {
    return QUOTA_LIMITS[plan];
  }

  /**
   * Check if a date is today
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Fetch quota entry for a user from Notion
   */
  private async fetchQuotaEntry(userId: string): Promise<QuotaEntry | null> {
    if (!this.isEnabled || !this.quotaDbId || !this.notionToken) return null;

    try {
      const url = `https://api.notion.com/v1/databases/${this.quotaDbId}/query`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.notionToken}`,
          "Notion-Version": "2022-02-22",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "User ID",
            title: {
              equals: userId,
            },
          },
        }),
      });

      const data: any = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      const page: any = data.results[0];
      const props = page.properties;

      return {
        userId,
        usageCount: props["Usage Count"]?.number ?? 0,
        lastReset: new Date(props["Last Reset"]?.date?.start ?? new Date()),
        plan: (props["Plan"]?.select?.name ?? "free") as PlanType,
      };
    } catch (error: any) {
      log("Failed to fetch quota entry", { error: error.message, userId });
      return null;
    }
  }

  /**
   * Create or update quota entry in Notion
   */
  private async upsertQuotaEntry(
    userId: string,
    usageCount: number,
    lastReset: Date,
    plan: PlanType,
    pageId?: string
  ): Promise<void> {
    if (!this.isEnabled || !this.notion || !this.quotaDbId) return;

    try {
      const properties: Record<string, any> = {
        "User ID": { title: [{ text: { content: userId } }] },
        "Usage Count": { number: usageCount },
        "Last Reset": { date: { start: lastReset.toISOString() } },
        "Plan": { select: { name: plan } },
      };

      if (pageId) {
        // Update existing page
        await this.notion.pages.update({
          page_id: pageId,
          properties,
        });
        log("Quota entry updated", { userId, usageCount, plan });
      } else {
        // Create new page
        await this.notion.pages.create({
          parent: { type: "database_id", database_id: this.quotaDbId },
          properties,
        });
        log("Quota entry created", { userId, usageCount, plan });
      }
    } catch (error: any) {
      log("Failed to upsert quota entry", { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Get page ID for a user's quota entry
   */
  private async getPageId(userId: string): Promise<string | null> {
    if (!this.isEnabled || !this.quotaDbId || !this.notionToken) return null;

    try {
      const url = `https://api.notion.com/v1/databases/${this.quotaDbId}/query`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.notionToken}`,
          "Notion-Version": "2022-02-22",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "User ID",
            title: {
              equals: userId,
            },
          },
        }),
      });

      const data: any = await response.json();

      return data.results && data.results.length > 0 ? data.results[0].id : null;
    } catch (error: any) {
      log("Failed to get page ID", { error: error.message, userId });
      return null;
    }
  }

  /**
   * Check if user has quota available
   * Returns { allowed: boolean, remaining: number, limit: number, plan: string }
   */
  async checkQuota(
    userId: string
  ): Promise<{ allowed: boolean; remaining: number; limit: number; plan: PlanType }> {
    // If quota service is disabled, allow all requests
    if (!this.isEnabled) {
      return { allowed: true, remaining: -1, limit: -1, plan: "free" };
    }

    try {
      let quotaEntry = await this.fetchQuotaEntry(userId);

      // If no entry exists, create one with default values
      if (!quotaEntry) {
        quotaEntry = {
          userId,
          usageCount: 0,
          lastReset: new Date(),
          plan: "free",
        };
        await this.upsertQuotaEntry(userId, 0, new Date(), "free");
      }

      // Reset count if it's a new day
      if (!this.isToday(quotaEntry.lastReset)) {
        quotaEntry.usageCount = 0;
        quotaEntry.lastReset = new Date();
        const pageId = await this.getPageId(userId);
        if (pageId) {
          await this.upsertQuotaEntry(
            userId,
            0,
            new Date(),
            quotaEntry.plan,
            pageId
          );
        }
      }

      const limit = this.getQuotaLimit(quotaEntry.plan);
      const remaining = Math.max(0, limit - quotaEntry.usageCount);
      const allowed = quotaEntry.usageCount < limit;

      return { allowed, remaining, limit, plan: quotaEntry.plan };
    } catch (error: any) {
      log("Quota check error - allowing by default", { error: error.message, userId });
      // On error, allow the request to avoid blocking legitimate users
      return { allowed: true, remaining: -1, limit: -1, plan: "free" };
    }
  }

  /**
   * Increment usage count for a user
   */
  async incrementUsage(userId: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      let quotaEntry = await this.fetchQuotaEntry(userId);

      if (!quotaEntry) {
        // Create new entry with count 1
        await this.upsertQuotaEntry(userId, 1, new Date(), "free");
        return;
      }

      // Reset if it's a new day
      if (!this.isToday(quotaEntry.lastReset)) {
        quotaEntry.usageCount = 1;
        quotaEntry.lastReset = new Date();
      } else {
        quotaEntry.usageCount += 1;
      }

      const pageId = await this.getPageId(userId);
      if (pageId) {
        await this.upsertQuotaEntry(
          userId,
          quotaEntry.usageCount,
          quotaEntry.lastReset,
          quotaEntry.plan,
          pageId
        );
      }
    } catch (error: any) {
      log("Failed to increment usage", { error: error.message, userId });
    }
  }

  /**
   * Get current quota status for a user
   */
  async getQuotaStatus(
    userId: string
  ): Promise<{ usageCount: number; limit: number; remaining: number; plan: PlanType } | null> {
    if (!this.isEnabled) return null;

    try {
      const quotaEntry = await this.fetchQuotaEntry(userId);
      if (!quotaEntry) return null;

      // Reset if it's a new day
      if (!this.isToday(quotaEntry.lastReset)) {
        quotaEntry.usageCount = 0;
      }

      const limit = this.getQuotaLimit(quotaEntry.plan);
      const remaining = Math.max(0, limit - quotaEntry.usageCount);

      return {
        usageCount: quotaEntry.usageCount,
        limit,
        remaining,
        plan: quotaEntry.plan,
      };
    } catch (error: any) {
      log("Failed to get quota status", { error: error.message, userId });
      return null;
    }
  }
}

let quotaServiceInstance: QuotaService | null = null;

export function getQuotaService(): QuotaService {
  if (!quotaServiceInstance) quotaServiceInstance = new QuotaService();
  return quotaServiceInstance;
}
