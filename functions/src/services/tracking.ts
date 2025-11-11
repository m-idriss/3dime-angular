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

  constructor() {
    const trackingToken = process.env.NOTION_TRACKING_TOKEN;
    this.trackingDbId = process.env.NOTION_TRACKING_DB_ID;

    // Tracking is optional - only enable if both token and database ID are configured
    this.isEnabled = !!(trackingToken && this.trackingDbId);

    if (this.isEnabled && trackingToken) {
      this.notion = new Client({ auth: trackingToken });
      log("Usage tracking is ENABLED", { databaseId: this.trackingDbId });
    } else {
      log("Usage tracking is DISABLED (missing NOTION_TRACKING_TOKEN or NOTION_TRACKING_DB_ID)");
    }
  }

  /**
   * Log a usage event to Notion
   * @param entry The tracking entry to log
   * @returns Promise that resolves when logged (or immediately if tracking disabled)
   */
  async logEvent(entry: UsageTrackingEntry): Promise<void> {
    // Skip if tracking is disabled
    if (!this.isEnabled || !this.notion || !this.trackingDbId) {
      return;
    }

    try {
      await this.notion.pages.create({
        parent: {
          type: "database_id",
          database_id: this.trackingDbId,
        },
        properties: {
          // Title property (required)
          Action: {
            title: [
              {
                text: {
                  content: entry.action,
                },
              },
            ],
          },
          // User ID
          "User ID": {
            rich_text: [
              {
                text: {
                  content: entry.userId,
                },
              },
            ],
          },
          // Timestamp
          Timestamp: {
            date: {
              start: entry.timestamp.toISOString(),
            },
          },
          // Status
          Status: {
            select: {
              name: entry.status,
            },
          },
          // Domain (optional)
          ...(entry.domain && {
            Domain: {
              rich_text: [
                {
                  text: {
                    content: entry.domain,
                  },
                },
              ],
            },
          }),
          // File Count (optional)
          ...(entry.fileCount !== undefined && {
            "File Count": {
              number: entry.fileCount,
            },
          }),
          // Event Count (optional)
          ...(entry.eventCount !== undefined && {
            "Event Count": {
              number: entry.eventCount,
            },
          }),
          // Duration (optional)
          ...(entry.duration !== undefined && {
            "Duration (ms)": {
              number: entry.duration,
            },
          }),
          // Error Message (optional)
          ...(entry.errorMessage && {
            "Error Message": {
              rich_text: [
                {
                  text: {
                    content: entry.errorMessage.substring(0, MAX_ERROR_MESSAGE_LENGTH),
                  },
                },
              ],
            },
          }),
        },
      });

      log("Usage event logged successfully", {
        action: entry.action,
        userId: entry.userId,
        status: entry.status,
      });
    } catch (error: any) {
      // Log error but don't throw - tracking failures shouldn't break the app
      log("Failed to log usage event to Notion", {
        error: error.message,
        entry,
      });
    }
  }

  /**
   * Log a successful conversion event
   */
  async logConversion(userId: string, fileCount: number, eventCount?: number, duration?: number, domain?: string): Promise<void> {
    return this.logEvent({
      action: "conversion",
      userId,
      timestamp: new Date(),
      status: "Success",
      fileCount,
      eventCount,
      duration,
      domain,
    });
  }

  /**
   * Log a failed conversion event
   */
  async logConversionError(
    userId: string,
    fileCount: number,
    errorMessage: string,
    eventCount?: number,
    duration?: number,
    domain?: string
  ): Promise<void> {
    return this.logEvent({
      action: "conversion",
      userId,
      timestamp: new Date(),
      status: "Error",
      fileCount,
      eventCount,
      errorMessage,
      duration,
      domain,
    });
  }
}

/**
 * Singleton instance of tracking service
 */
let trackingServiceInstance: TrackingService | null = null;

/**
 * Get or create the tracking service instance
 */
export function getTrackingService(): TrackingService {
  if (!trackingServiceInstance) {
    trackingServiceInstance = new TrackingService();
  }
  return trackingServiceInstance;
}
