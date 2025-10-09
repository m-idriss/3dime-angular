import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";

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

/**
 * Firebase Function to convert images/PDF to ICS calendar files
 * Uses AI to extract calendar events from uploaded files
 */
export const converterFunction = onRequest(
  {
    secrets: ["OPENAI_API_KEY"],
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  (req, res) => {
    return corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed. Use POST." });
        }

        const { files, timeZone, currentDate } = req.body;

        if (!files || !Array.isArray(files) || files.length === 0) {
          return res.status(400).json({ error: "No files provided" });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return res.status(500).json({ error: "OpenAI API key not configured" });
        }

        // Get timezone and date
        const tz = timeZone || "UTC";
        const today = currentDate || new Date().toISOString().split('T')[0];

        // Build prompt from environment or use default
        const baseMessage = process.env.BASE_TEXT_MESSAGE ||
          `Extract all calendar events from the following images and generate a valid ICS file. Use the time zone: ${tz}. Today is ${today}, calendar events may be around this. Include all required ICS fields like UID, DTSTAMP, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION, and TZID. Each image may contain multiple events for multiple dates (like column with row calendar), so capture all of them. Only output the ICS content. Do not add any extra text or formatting.`;

        const systemPrompt = process.env.PROMPT ||
          "You are a calendar extraction expert. Your task is to generate a complete ICS file from the provided images. Only output the raw ICS content. NEVER include explanations, comments, markdown, or any extra text. Ensure all ICS fields are correct and valid: UID, DTSTAMP, DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION, and TZID when applicable. Always produce RFC-compliant ICS output.";

        // Call OpenAI Vision API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: baseMessage
                  },
                  ...files.map((file: any) => ({
                    type: "image_url",
                    image_url: {
                      url: file.dataUrl || file.url,
                      detail: "high"
                    }
                  }))
                ]
              }
            ],
            max_tokens: 4096,
            temperature: 0.1
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          return res.status(response.status).json({
            error: "Failed to process images with AI",
            details: errorData
          });
        }

       return res.status(500).json({
                         error: "test",
                       });

        const data = await response.json();
        const icsContent = data.choices?.[0]?.message?.content;


        if (!icsContent) {
          return res.status(500).json({ error: "No ICS content generated" });
        }


        // Clean up the ICS content (remove markdown code blocks if present)
        let cleanedIcs = icsContent.trim();
        cleanedIcs = cleanedIcs.replace(/```(?:ics)?\s*[\r\n]|```/gi, '');
        cleanedIcs = cleanedIcs.trim();

        return res.status(200).json({
          icsContent: cleanedIcs,
          success: true
        });

      } catch (err: any) {
        console.error("Converter error:", err);
        return res.status(500).json({
          error: "Internal server error",
          message: err.message
        });
      }
    });
  }

  // Validate basic structure of ICS content
  isValidIcs(ics: string): boolean {
    return ics.includes("BEGIN:VCALENDAR") && ics.includes("END:VCALENDAR") &&
           ics.includes("BEGIN:VEVENT") && ics.includes("END:VEVENT");
);
