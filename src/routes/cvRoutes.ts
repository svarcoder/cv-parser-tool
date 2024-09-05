import express from "express";
import { extractTextFromCV, generateCV } from "../controllers/cvController";
import multer from "multer";
const router = express.Router();

const upload = multer();

router.post("/generate-cv", generateCV);
router.post("/extract-text", upload.single("file"), extractTextFromCV);

export default router;
