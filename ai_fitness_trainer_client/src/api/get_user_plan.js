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

/**
 * Save a generated fitness plan to backend
 * @param {Object} planData - { user_id, title, days, notes, content }
 * @returns {Object} saved plan response from server
 */
export const saveGeneratedPlan = async (planData) => {
  try {
    const response = await axios.post('/api/plans/save', planData);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to save generated plan:', error);
    throw error;
  }
};
