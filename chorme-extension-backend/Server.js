
const express = require("express");
const cors = require("cors");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROK_API_KEY});

// Middleware
app.use(express.json({ limit: "10MB" }));
app.use(cors({ origin: "*" }));

// Clean resume text
const clearResumeText = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x20-\x7E\n]/g, "")
    .trim()
    .slice(0, 3000);

    const getResumeTail = (text, n) => text.slice(-n);
// Build AI prompt
const buildPrompt = (resumeText, jd) => {
    const resumeTail = getResumeTail(resumeText, 1300);
    const jdSlice = jd.slice(0, 600);

    return `
You are an ATS analyzer. Compare resume vs job description.

Resume (last 1200 chars): ${resumeTail}
Job Description (first 600 chars): ${jdSlice}

Return ONLY this JSON:
{
  "overall_score": 0-100,
  "overall_rating": "Weak|Fair|Strong|Excellent",
  "match_percentage": 0-100,
  "matched_keywords": ["up to 8 skills in both"],
  "missing_keywords": ["up to 8 skills in JD not in resume"],
  "summary": "max 2 sentences",
  "suggestions": [{"priority":"High|Medium|Low","suggestion":"one line"}],
  "errors": [{"severity":"High|Medium|Low","error":"what is wrong","fix":"one line"}],
  "improvements": [{"priority":"High|Medium|Low","improvement":"one line"}]
}`;
};

// Extract PDF text
app.post("/extractText", async (req, res) => {
  try {
    let { base64 } = req.body;
    if (!base64) return res.status(400).json({ err: "Missing base64" });
    base64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const buffer = Buffer.from(base64, "base64");
    const pdfData = await pdf(buffer, { verbosity: -1 });

    const text = clearResumeText(pdfData.text);
    if (!text) return res.status(400).json({ err: "Could not extract text from PDF" });

    res.status(200).json({ text });
  } catch (err) {
    console.error("extractText error:", err.message);
    res.status(500).json({ err: "Failed to extract text" });
  }
});

// Check resume score
app.post("/checkScore", async (req, res) => {
  try {
    const { jd, resumeText } = req.body;
    if (!jd || !resumeText) return res.status(400).json({ err: "Missing jd or resumeText" });

    const prompt = buildPrompt(resumeText, jd);

    const groqRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const rawText = groqRes?.choices?.[0]?.message?.content;
    if (!rawText) return res.status(500).json({ err: "AI returned empty response" });

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ err: "AI did not return JSON" });

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0].trim());
    } catch {
      return res.status(500).json({ err: "AI returned invalid JSON" });
    }

    // Ensure numbers for frontend
    analysis.match_percentage = Number(analysis.match_percentage || 0);
    analysis.overall_score = Number(analysis.overall_score || 0);

    res.status(200).json({
      success: true,
      match_percentage: analysis.match_percentage,
      overall_score: analysis.overall_score,
      overall_rating: analysis.overall_rating,
      matched_keywords: analysis.matched_keywords,
      missing_keywords: analysis.missing_keywords,
      errors: analysis.errors,
      suggestions: analysis.suggestions,
      summary: analysis.summary,
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ err: "Failed to analyze resume" });
  }
});

app.listen(9000, () => console.log("Server running on port 9000"));