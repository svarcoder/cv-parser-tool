import express from "express";
import { generateCV } from "../controllers/cvController";

const router = express.Router();

router.post("/generate-cv", generateCV);

export default router;
