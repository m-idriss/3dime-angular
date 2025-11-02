import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { GoogleAuth } from "google-auth-library";

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
 * Helper function to get OAuth 2.0 access token using service account
 */
async function getGeminiAccessToken(): Promise<string> {
  const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
  
  if (!serviceAccountJson) {
    throw new Error("SERVICE_ACCOUNT_JSON not configured");
  }

  const credentials = JSON.parse(serviceAccountJson);
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/generative-language'],
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  
  if (!accessTokenResponse.token) {
    throw new Error("Failed to obtain access token");
  }

  return accessTokenResponse.token;
}

/**
 * Helper function to convert image data URL to inline data format for Gemini
 */
function prepareImageForGemini(file: any) {
  const dataUrl = file.dataUrl || file.url;
  
  // Extract mime type and base64 data from data URL
  // Format: data:image/jpeg;base64,/9j/4AAQ...
  const matches = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  
  if (!matches) {
    throw new Error("Invalid image data URL format");
  }

  const [, mimeType, data] = matches;
  
  return {
    inlineData: {
      mimeType,
      data
    }
  };
}

export const converterFunction = onRequest(
  {
    secrets: ["SERVICE_ACCOUNT_JSON"],
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  (req, res) => {
    return corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Use POST." });
        }

        const { files, timeZone, currentDate } = req.body;
        if (!files?.length) {
          return res.status(400).json({ error: "No files provided" });
        }

        const tz = timeZone || "UTC";
        const today = currentDate || new Date().toISOString().split("T")[0];

        // Build base system and user messages
        const baseMessage =
          process.env.BASE_TEXT_MESSAGE ||
          `Extract all calendar events from the following images and generate a valid ICS file.
           Time zone: ${tz}. Today is ${today}.
           Only output valid ICS (no markdown, comments, or extra text).`;

        const systemPrompt =
          process.env.PROMPT ||
          "You are a calendar extraction expert. Generate RFC-compliant ICS only. \
           Always include VERSION:2.0, UID, DTSTAMP, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION, TZID. \
           Output ICS only, no extra text.";

        // Get OAuth 2.0 access token
        let accessToken: string;
        try {
          accessToken = await getGeminiAccessToken();
        } catch (authError: any) {
          console.error("Authentication error:", authError);
          return res.status(500).json({ 
            error: "Failed to authenticate with Gemini API",
            message: authError.message 
          });
        }

        // Prepare content parts: system prompt + text + images
        const contentParts = [
          {
            text: `${systemPrompt}\n\n${baseMessage}`
          },
          ...files.map((file: any) => {
            try {
              return prepareImageForGemini(file);
            } catch (error: any) {
              console.error("Error preparing image:", error);
              throw new Error(`Failed to prepare image: ${error.message}`);
            }
          })
        ];

        // Call Gemini API
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: contentParts
                }
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 4096,
              }
            })
          }
        );

        if (!response.ok) {
          let errorData: any;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: await response.text() };
          }
          console.error("Gemini API error:", errorData);
          
          // Handle specific error codes
          if (response.status === 401) {
            return res.status(401).json({
              error: "Authentication failed with Gemini API",
              details: errorData,
            });
          } else if (response.status === 403) {
            return res.status(403).json({
              error: "Permission denied for Gemini API",
              details: errorData,
            });
          }
          
          return res.status(response.status).json({
            error: "Failed to process images with Gemini API",
            details: errorData,
          });
        }

        const responseData = await response.json();
        let icsContent = responseData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!icsContent) {
          return res.status(500).json({ 
            error: "No ICS generated",
            details: responseData 
          });
        }

        // Remove potential markdown fences (```ics ... ``` or just ```)
        icsContent = icsContent.replace(/```(?:ics)?\s*[\r\n]|```/gi, "").trim();

        if (!isValidIcs(icsContent)) {
          return res.status(200).json({
            success: false,
            error: "Generated ICS is invalid",
            icsContent,
          });
        }

        return res.status(200).json({ success: true, icsContent });
      } catch (err: any) {
        console.error("Converter error:", err);
        return res.status(500).json({ error: "Internal error", message: err.message });
      }
    });
  }
);

// ⚡ Improved ICS validation: check VERSION and at least one VEVENT
function isValidIcs(ics: string): boolean {
  return (
    ics.startsWith("BEGIN:VCALENDAR") &&
    ics.includes("VERSION:2.0") &&
    ics.includes("BEGIN:VEVENT") &&
    ics.endsWith("END:VCALENDAR")
  );
}
