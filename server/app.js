import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdfRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/pdfs", pdfRoutes);
app.use("/api/chat", chatRoutes);
app.use((error, _req, res, _next) => res.status(500).json({ error: error.message || "Unexpected server error." }));
export default app;
