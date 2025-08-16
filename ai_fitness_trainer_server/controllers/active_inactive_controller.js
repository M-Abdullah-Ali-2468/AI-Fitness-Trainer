import { getUserPlans } from "../../ai_fitness_trainer_server/supabase/functions/active_inactive_functions.js";

/**
 * Controller to fetch all plans of a user
 */
export async function fetchUserPlansController(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const plans = await getUserPlans(userId);

    return res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching user plans:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
