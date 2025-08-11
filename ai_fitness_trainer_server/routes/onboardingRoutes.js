import express from "express";
import { 
  submitForm, 
  fetchUserOnboardingData, 
  updateOnboardingController // 👈 New controller import
} from "../controllers/onboardingController.js";

const router = express.Router();

// POST route for onboarding form submission
router.post("/submit", submitForm);

// GET route to fetch onboarding data by Clerk user ID
router.get("/:userId", fetchUserOnboardingData);

// PUT route to update onboarding data for a given Clerk user ID
router.put("/:id", updateOnboardingController);

export default router;
