
import axios from "axios";

/**
 * Fetch active and inactive plans of a user by UUID (user_id)
 * @param {string} userId - UUID from users table
 * @returns {Object} { activePlans: Array, inactivePlans: Array }
 */
export async function fetchUserPlans(userId) {
  if (!userId) throw new Error("User ID is required");

  try {
    const response = await axios.get(`/api/plans/user/${userId}`);

    // Response assumed to be array of plans
    const plans = response.data;

    // Separate active and inactive plans
    const activePlans = plans.filter((plan) => plan.is_active);
    const inactivePlans = plans.filter((plan) => !plan.is_active);

    return { activePlans, inactivePlans };
  } catch (error) {
    console.error("Error fetching user plans:", error);
    throw error;
  }
}
