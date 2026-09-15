import { indexPdfs } from "../services/ragService.js";

export async function uploadPdf(req, res, next) {
  try {
    if (!req.files?.length) return res.status(400).json({ error: "Upload at least one PDF file." });
    res.status(201).json(await indexPdfs(req.files));
  } catch (error) { next(error); }
}
