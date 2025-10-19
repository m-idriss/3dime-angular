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
    if (!origin) return callback(null, true); // allow non-browser clients like curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

export const converterFunction = onRequest(
  {
    secrets: ["OPENAI_API_KEY"],
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

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return res.status(500).json({ error: "OpenAI API key not set" });
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

        // ⚡ Use gpt-4o-mini for faster response and lower cost
        // ⚡ Reduce max_tokens since ICS content is small
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
            error: "Failed to process images",
            details: errorData,
          });
        }

        let icsContent = (await response.json())?.choices?.[0]?.message?.content?.trim();

        if (!icsContent) {
          return res.status(500).json({ error: "No ICS generated" });
        }

        // Remove potential markdown fences
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
