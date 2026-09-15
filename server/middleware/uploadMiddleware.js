import multer from "multer";
import path from "node:path";
import { config } from "../config/config.js";

const storage = multer.diskStorage({
  destination: (_req, _file, done) => done(null, path.join(config.serverRoot, "uploads")),
  filename: (_req, file, done) => done(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`)
});
export const uploadPdfs = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, done) => done(null, file.mimetype === "application/pdf")
}).array("pdfs", 10);
