// src/api/onboarding.js

export const submitOnboardingForm = async (userId, formData) => {
  try {
    const response = await fetch("http://localhost:3000/api/form/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, ...formData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to submit onboarding form");
    }

    return result;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return { error: error.message };
  }
};
