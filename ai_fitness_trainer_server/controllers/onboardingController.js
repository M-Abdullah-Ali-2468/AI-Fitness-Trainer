// server/controllers/onboardingController.js

import { insertFormData, fetchOnboardingData } from "../supabase/functions/onboarding_functions.js";

// ✅ POST route handler: Form submission
export const submitForm = async (req, res) => {
  try {
    const formData = req.body;

    if (!formData.user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const result = await insertFormData(formData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Form submission error:", error.message);
    res.status(500).json({ error: "Server error while submitting form" });
  }
};

// ✅ GET route handler: Fetch form data for a given user ID
export const fetchUserOnboardingData = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request params" });
    }

    const data = await fetchOnboardingData(userId);

    if (!data) {
      return res.status(404).json({ success: false, message: "No onboarding data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Fetch onboarding data error:", error.message);
    res.status(500).json({ error: "Server error while fetching onboarding data" });
  }
};
