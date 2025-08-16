import {
  setPlanActive,
  setPlanInactive,
  removePlan,
} from "../supabase/functions/plans_db_functions.js";

// ✅ Activate plan
export const activatePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await setPlanActive(id);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error activating plan:", error.message);
    res.status(500).json({ error: "Failed to activate plan" });
  }
};

// ✅ Deactivate plan
export const deactivatePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await setPlanInactive(id);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error deactivating plan:", error.message);
    res.status(500).json({ error: "Failed to deactivate plan" });
  }
};

// ✅ Delete plan
export const deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await removePlan(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting plan:", error.message);
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
