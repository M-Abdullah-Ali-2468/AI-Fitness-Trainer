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
