import supabase from '../supabaseClient.js';

/**
 * Insert onboarding form data into Supabase
 * @param {object} formData - Includes Clerk ID (formData.user_id)
 */
export const insertFormData = async (formData) => {
  try {
    // Step 1: Lookup Supabase UUID from Clerk ID
    const { data: userRow, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", formData.user_id)
      .single();

    if (lookupError || !userRow) {
      console.error("❌ Clerk ID not found in users table");
      return { success: false, error: "User not found in database." };
    }

    const actualUserId = userRow.id; // UUID from Supabase

    // Step 2: Insert form using UUID
    const { data, error } = await supabase.from("onboarding_data").insert([
      {
        user_id: actualUserId,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        activity: formData.activity,
        occupation: formData.occupation,
        smoking: formData.smoking,
        alcohol: formData.alcohol,
        water_intake: formData.water_intake,
        medical: formData.medical || null,
        allergies: formData.allergies || null,
        injuries: formData.injuries || null,
        sleep: formData.sleep,
        diet: formData.diet,
        meal_frequency: formData.meal_frequency,     // ✅ camelCase → snake_case
        workout_time: formData.workout_time          // ✅ camelCase → snake_case
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ Server error inserting onboarding data:", err.message);
    return { success: false, error: err.message };
  }
};
