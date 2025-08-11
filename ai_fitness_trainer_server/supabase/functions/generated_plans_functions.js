import supabase from '../supabaseClient.js'; // Adjust path if needed

/**
 * Save generated fitness plan to DB
 * @param {Object} planData - { user_id, title, days, notes, content, is_active }
 * @returns {Object} Inserted row or error
 */
export const saveGeneratedPlan = async (planData) => {
  console.log("Saving plan to DB:", planData);
  const { user_id, title, days, notes, content, is_active } = planData;

  const { data, error } = await supabase
    .from('generated_plans')
    .insert([{ user_id, title, days, notes, content, is_active }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
  return data;
};
