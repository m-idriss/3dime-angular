import { Client } from "@notionhq/client";
import { log } from "firebase-functions/logger";

/**
 * Maximum length for error messages stored in Notion.
 * Notion has limits on rich text field lengths, so we truncate long error messages.
 */
const MAX_ERROR_MESSAGE_LENGTH = 2000;

/**
 * Usage tracking entry interface
 */
export interface UsageTrackingEntry {
  action: string;
  userId: string;
  timestamp: Date;
  status: "Success" | "Error";
  domain?: string;
  fileCount?: number;
  eventCount?: number;
  duration?: number;
  errorMessage?: string;
}

/**
 * Service for logging usage events to Notion
 */
export class TrackingService {
  private notion?: Client;
  private trackingDbId?: string;
  private isEnabled: boolean;
  private notionToken?: string;

  constructor() {
    this.trackingDbId = process.env.NOTION_TRACKING_DB_ID;
    this.notionToken = process.env.NOTION_TRACKING_TOKEN;
    this.isEnabled = !!(this.trackingDbId && this.notionToken);

    if (this.isEnabled && this.notionToken) {
      this.notion = new Client({ auth: this.notionToken });
      log("Usage tracking ENABLED", { databaseId: this.trackingDbId });
    } else {
      log("Usage tracking DISABLED (missing token or database ID)");
    }
  }

  /** Helper to create Notion rich text properties */
  private createRichTextProperty(content: string) {
    return { rich_text: [{ text: { content } }] };
  }

  /** Log a usage event to Notion */
  async logEvent(entry: UsageTrackingEntry): Promise<void> {
    if (!this.isEnabled || !this.notion || !this.trackingDbId) return;

    try {
      const properties: Record<string, any> = {
        Action: { title: [{ text: { content: entry.action } }] },
        "User ID": this.createRichTextProperty(entry.userId),
        Timestamp: { date: { start: entry.timestamp.toISOString() } },
        Status: { select: { name: entry.status } },
      };

      if (entry.domain) properties.Domain = this.createRichTextProperty(entry.domain);
      if (entry.fileCount !== undefined) properties["File Count"] = { number: entry.fileCount };
      if (entry.eventCount !== undefined) properties["Event Count"] = { number: entry.eventCount };
      if (entry.duration !== undefined) properties["Duration (ms)"] = { number: entry.duration };
      if (entry.errorMessage) {
        properties["Error Message"] = this.createRichTextProperty(
          entry.errorMessage.substring(0, MAX_ERROR_MESSAGE_LENGTH)
        );
      }

      await this.notion.pages.create({
        parent: { type: "database_id", database_id: this.trackingDbId },
        properties,
      });

      log("Usage event logged", { action: entry.action, userId: entry.userId, status: entry.status });
    } catch (error: any) {
      log("Failed to log usage event", { error: error.message, entry });
    }
  }

  /** Log a successful conversion */
  async logConversion(userId: string, fileCount: number, domain?: string, eventCount?: number, duration?: number) {
    return this.logEvent({ action: "conversion", userId, timestamp: new Date(), status: "Success", fileCount, eventCount, duration, domain });
  }

  /** Log a failed conversion */
  async logConversionError(userId: string, fileCount: number, errorMessage: string, eventCount?: number, duration?: number, domain?: string) {
    return this.logEvent({ action: "conversion", userId, timestamp: new Date(), status: "Error", fileCount, eventCount, duration, domain, errorMessage });
  }

  /** Fetch aggregated statistics from Notion */
  async getStatistics(): Promise<{ fileCount: number; eventCount: number } | null> {
    if (!this.isEnabled || !this.trackingDbId || !this.notionToken) return null;

    const url = `https://api.notion.com/v1/databases/${this.trackingDbId}/query`;
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.notionToken}`,
        "Notion-Version": "2022-02-22",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Action", title: { equals: "conversion" } },
            { property: "Status", select: { equals: "Success" } },
          ],
        },
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      let totalFileCount = 0;
      let totalEventCount = 0;

      for (const page of data.results) {
        const props = page.properties;
        totalFileCount += props["File Count"]?.number ?? 0;
        totalEventCount += props["Event Count"]?.number ?? 0;
      }

      return { fileCount: totalFileCount, eventCount: totalEventCount };
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      return null;
    }
  }
}

let trackingServiceInstance: TrackingService | null = null;

export function getTrackingService(): TrackingService {
  if (!trackingServiceInstance) trackingServiceInstance = new TrackingService();
  return trackingServiceInstance;
}
