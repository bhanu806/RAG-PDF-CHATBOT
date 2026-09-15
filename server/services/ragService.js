import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config/config.js";
import { runPython } from "./pythonService.js";

const sessions = new Map();
const indexRoot = path.join(config.serverRoot, "uploads", "indexes");

export async function indexPdfs(files) {
  const id = crypto.randomUUID();
  const indexPath = path.join(indexRoot, id);
  await fs.mkdir(indexPath, { recursive: true });
  const result = await runPython({ action: "index", pdfPaths: files.map((file) => file.path), indexPath });
  sessions.set(id, { indexPath, fileNames: files.map((file) => file.originalname) });
  return { sessionId: id, fileNames: sessions.get(id).fileNames, ...result };
}

export async function askQuestion(sessionId, question, apiKey) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("This document session has expired. Please upload the PDFs again.");
  return runPython({ action: "ask", question, apiKey, indexPath: session.indexPath });
}
