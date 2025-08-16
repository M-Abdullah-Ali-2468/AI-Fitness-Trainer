import  supabase  from "../supabaseClient.js";

// ✅ Activate plan
export const setPlanActive = async (planId) => {
  const { data, error } = await supabase
    .from("generated_plans")
    .update({ is_active: true })
    .eq("id", planId)
    .select();

  if (error) throw error;
  return data[0];
};

// ✅ Deactivate plan
export const setPlanInactive = async (planId) => {
  const { data, error } = await supabase
    .from("generated_plans")
    .update({ is_active: false })
    .eq("id", planId)
    .select();

  if (error) throw error;
  return data[0];
};

// ✅ Delete plan
export const removePlan = async (planId) => {
  const { data, error } = await supabase
    .from("generated_plans")
    .delete()
    .eq("id", planId)
    .select();

  if (error) throw error;
  return data[0];
};
