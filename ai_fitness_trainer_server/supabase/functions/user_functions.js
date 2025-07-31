import supabase from '../supabaseClient.js';

// Create a new user
export async function createUser(clerkId, name, email) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ clerk_id: clerkId, name, email }]);

  if (error) {
    console.error('❌ Error creating user:', error.message);
    throw error;
  }

  console.log('✅ User created:', data);
  return data;
}

// Delete a user by clerk_id
export async function deleteUser(clerkId) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('❌ Error deleting user:', error.message);
    throw error;
  }

  console.log('🗑️ User deleted:', data);
  return data;
}

// Update user details by clerk_id
export async function updateUser(clerkId, updatedFields) {
  const { data, error } = await supabase
    .from('users')
    .update(updatedFields)
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('❌ Error updating user:', error.message);
    throw error;
  }

  console.log('🔄 User updated:', data);
  return data;
}
