import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { getTrackingService } from "../services/tracking";
import { log } from "firebase-functions/logger";

// Whitelist of allowed origins for CORS
const allowedOrigins = [
  'https://3dime.com',
  'https://www.3dime.com',
  'http://localhost:4200',
  'http://localhost:5000'
];

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients like curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

/**
 * Firebase function to retrieve aggregated statistics
 * Returns total file count and event count from successful conversions
 */
export const statisticsFunction = onRequest(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  (req, res) => {
    return corsHandler(req, res, async () => {
      try {
        // Only allow GET requests
        if (req.method !== "GET") {
          return res.status(405).json({ error: "Only GET requests are allowed" });
        }

        const trackingService = getTrackingService();
        const statistics = await trackingService.getStatistics();

        // If tracking is disabled or query fails, return default values
        if (!statistics) {
          log("Returning default statistics (tracking disabled or query failed)");
          return res.status(200).json({
            fileCount: 0,
            eventCount: 0,
            message: "Statistics tracking is not available"
          });
        }

        // Return successful statistics
        return res.status(200).json({
          fileCount: statistics.fileCount,
          eventCount: statistics.eventCount,
        });
      } catch (error: any) {
        log("Error retrieving statistics", { error: error.message });
        return res.status(500).json({
          error: "Failed to retrieve statistics",
          fileCount: 0,
          eventCount: 0,
        });
      }
    });
  }
);
