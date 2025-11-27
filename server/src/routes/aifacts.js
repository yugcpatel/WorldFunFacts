import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

router.post("/facts", async (req, res) => {
    try {
        const { country } = req.body;

        const prompt = `
      Give me 5 short fun facts about ${country}.
      Return ONLY JSON with NO markdown code block.
      Example:
      [
        {"fact": "text"},
        {"fact": "text"}
      ]
    `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).json({ error: "AI returned no content" });
        }

        let facts;
        try {
            const cleaned = text
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            facts = JSON.parse(cleaned);
        } catch (err) {
            facts = [{ fact: text }];
        }

        res.json({ country, facts });

    } catch (err) {
        console.error("🔥 Gemini error:", err);
        res.status(500).json({ error: "AI failed to generate facts" });
    }
});

export default router;
