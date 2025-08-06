// server/routes/onboardingRoutes.js

import express from "express";
import { submitForm, fetchUserOnboardingData } from "../controllers/onboardingController.js";

const router = express.Router();

// ✅ POST route for onboarding form submission
router.post("/submit", submitForm);

// ✅ GET route to fetch onboarding data by Clerk user ID
router.get("/:userId", fetchUserOnboardingData);

export default router;
