// server/routes/geminiRoutes.js

import express from "express";
import { generateFitnessPlan } from "../controllers/geminiController.js";

const router = express.Router();

// POST route to generate fitness plan
router.post("/", generateFitnessPlan);

export default router;
