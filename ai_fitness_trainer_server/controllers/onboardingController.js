import { insertFormData, fetchOnboardingData, updateOnboardingInDB } from "../supabase/functions/onboarding_functions.js";

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

export const updateOnboardingController = async (req, res) => {
  try {
    // URL param se onboarding record ID lena (NOT user ID)
    const { id } = req.params; // This is onboarding record ID

    // Request body se updated fields
    const updatedData = req.body;

    // Agar id missing hai
    if (!id) {
      return res.status(400).json({ error: "Onboarding record ID is required" });
    }

    console.log(`🔄 Updating onboarding record with ID: ${id}`);
    console.log('📝 Updated data:', updatedData);

    // DB function call - directly use the onboarding record ID
    const result = await updateOnboardingInDB(id, updatedData);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Onboarding record not found or update failed" });
    }

    console.log('✅ Update successful:', result);

    // Success response
    res.status(200).json({ 
      success: true,
      message: "Onboarding data updated successfully", 
      data: result[0] // Supabase returns array, so take first element
    });

  } catch (error) {
    console.error("❌ Error updating onboarding data:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};