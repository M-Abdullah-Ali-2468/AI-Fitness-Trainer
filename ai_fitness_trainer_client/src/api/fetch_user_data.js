// client/src/api/fetch_user_data.js

/**
 * Fetch onboarding data from server for a given user ID
 * @param {string} userId - Clerk user ID
 * @returns {object} - Onboarding data or error
 */
export const fetchUserOnboardingData = async (userId) => {
  try {
    const response = await fetch(`/api/onboarding/${userId}`);

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Failed to fetch onboarding data:", err);
      return { success: false, error: err.message || "Failed to fetch" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Network or server error:", error.message);
    return { success: false, error: error.message };
  }
};

// client/src/api/fetch_user_data.js

/**
 * Update onboarding data for a given onboarding record ID
 * @param {object} formData - Full onboarding data object (must include id)
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
// Update onboarding data
export async function updateUserOnboardingData(formData) {
  try {
    const res = await fetch(`/api/onboarding/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update onboarding data" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ Error in updateUserOnboardingData:", err);
    return { success: false, error: err.message };
  }
}
