import { saveGeneratedPlan } from "../supabase/functions/generated_plans_functions.js";

export const savePlanController = async (req, res) => {
  try {
    const planData = req.body;

    // Basic validation (optional)
    if (!planData.user_id || !planData.title || !planData.days || !planData.content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const savedPlan = await saveGeneratedPlan(planData);
    return res.status(201).json({ success: true, plan: savedPlan });
  } catch (error) {
    console.error('❌ Controller error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
