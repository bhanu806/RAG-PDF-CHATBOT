import { Router } from "express";
import { uploadPdfs } from "../middleware/uploadMiddleware.js";
import { uploadPdf } from "../controllers/pdfController.js";
const router = Router();
router.post("/", uploadPdfs, uploadPdf);
export default router;
