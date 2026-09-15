import { config } from "../config/config.js";
import { askQuestion } from "../services/ragService.js";

export async function chat(req, res, next) {
  try {
    const { sessionId, question, apiKey } = req.body;
    if (!sessionId || !question?.trim()) return res.status(400).json({ error: "sessionId and question are required." });
    const key = apiKey || config.apiKey;
    if (!key) return res.status(400).json({ error: "A Google AI API key is required." });
    res.json(await askQuestion(sessionId, question.trim(), key));
  } catch (error) { next(error); }
}
