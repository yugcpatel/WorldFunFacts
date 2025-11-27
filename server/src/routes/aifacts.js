/**
 * AI Routes – Gemini Fact Generator
 * ---------------------------------------------------------------
 * This Express route connects to Google's Gemini API and generates
 * AI-powered fun facts about a given country.
 *
 * Endpoint:
 *   POST /api/ai/facts
 *
 * Request Body:
 *   {
 *     "country": "India"
 *   }
 *
 * Response:
 *   {
 *     "country": "India",
 *     "facts": [
 *       { "fact": "…" },
 *       { "fact": "…" }
 *     ]
 *   }
 *
 * Notes:
 * - The route requests 5 fun facts from Gemini 2.5 Flash.
 * - AI output is forced to return pure JSON (no markdown formatting).
 * - Extra cleanup is applied because LLMs sometimes wrap output in ```json blocks.
 */

import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Initialize Gemini client using API key from environment variables
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

/**
 * POST /facts
 * ---------------------------------------------------------------
 * Generates AI-powered fun facts about a specified country.
 * Returns 5 short facts in JSON format.
 */
router.post("/facts", async (req, res) => {
    try {
        const { country } = req.body;

        if (!country) {
            return res.status(400).json({ error: "Country name is required." });
        }

        /** Prompt that forces Gemini to return ONLY JSON */
        const prompt = `
            Give me 5 short fun facts about ${country}.
            Return ONLY JSON with NO markdown code block, no explanation.
            Format example:
            [
              {"fact": "text"},
              {"fact": "text"}
            ]
        `;

        /** Send request to the Gemini model */
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        /** Extract raw text from the model output */
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).json({ error: "AI returned no content" });
        }

        /**
         * Attempt to parse JSON.
         * If the model returned wrapped formatting, clean it.
         */
        let facts;
        try {
            const cleaned = text
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            facts = JSON.parse(cleaned);
        } catch (err) {
            // Fallback: If model didn’t return valid JSON, wrap raw text
            facts = [{ fact: text }];
        }

        return res.json({ country, facts });

    } catch (err) {
        console.error("🔥 Gemini error:", err);
        return res.status(500).json({ error: "AI failed to generate facts" });
    }
});

export default router;
