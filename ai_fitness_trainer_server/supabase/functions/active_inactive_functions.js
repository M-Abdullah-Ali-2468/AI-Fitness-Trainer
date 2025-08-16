import supabase from "../supabaseClient.js";

/**
 * Get all generated plans of a user, latest first
 * @param {string} userId - UUID from users table
 * @returns {Array} List of plans or empty array
 */
export async function getUserPlans(userId) {
  const { data, error } = await supabase
    .from("generated_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
