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
        meal_frequency: formData.meal_frequency,
        workout_time: formData.workout_time
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Onboarding data inserted successfully for user:", actualUserId);
    return { success: true, data };
  } catch (err) {
    console.error("❌ Server error inserting onboarding data:", err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch onboarding data from Supabase for a given Clerk user ID
 * @param {string} clerkId - Clerk user ID (not Supabase UUID)
 */
export const fetchOnboardingData = async (clerkId) => {
  try {
    // Step 1: Lookup Supabase UUID from Clerk ID
    const { data: userRow, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (lookupError || !userRow) {
      console.error("❌ Clerk ID not found in users table for fetch");
      return { success: false, error: "User not found in database." };
    }

    const actualUserId = userRow.id;

    // Step 2: Fetch onboarding data
    const { data, error } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", actualUserId)
      .single();

    if (error) {
      console.error("❌ Error fetching onboarding data:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Onboarding data fetched successfully for user:", actualUserId);
    return { success: true, data };
  } catch (err) {
    console.error("❌ Server error fetching onboarding data:", err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Update onboarding form data in Supabase
 * @param {string} onboardingId - ID of the onboarding record (NOT user ID)
 * @param {object} updateData - Fields to update
 */
export async function updateOnboardingInDB(onboardingId, updateData) {
  try {
    console.log(`🔍 Updating onboarding record ID: ${onboardingId}`);
    console.log('📝 Data to update:', updateData);

    // Remove the 'id' field from updateData to avoid updating the primary key
    const { id, ...fieldsToUpdate } = updateData;

    const { data, error } = await supabase
      .from("onboarding_data")
      .update(fieldsToUpdate) // Only update the actual fields, not the ID
      .eq("id", onboardingId) // Match by onboarding record ID
      .select(); // Return the updated row

    if (error) {
      console.error("❌ Supabase update error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.error("❌ No records updated - onboarding ID may not exist");
      return null;
    }

    console.log("✅ Onboarding data updated successfully:", data);
    return data; // Updated record(s)
    
  } catch (err) {
    console.error("❌ Error in updateOnboardingInDB:", err);
    throw err;
  }
}