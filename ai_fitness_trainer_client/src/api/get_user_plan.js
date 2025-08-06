// client/src/api/generatePlanApi.js

import axios from "axios";

export const generatePlan = async ({ userInfo, goal, duration, customPrompt }) => {
  try {
    const response = await axios.post(`/api/generate-plan`, { userInfo, goal, duration, customPrompt });

    return response.data;
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    throw error;
  }
};
