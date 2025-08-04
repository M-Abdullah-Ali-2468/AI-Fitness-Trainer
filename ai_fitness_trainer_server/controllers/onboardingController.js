// server/controllers/formController.js

import { insertFormData } from "../supabase/functions/onboarding_functions.js";

export const submitForm = async (req, res) => {
  try {
    const formData = req.body; // user_id and other fields included

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
