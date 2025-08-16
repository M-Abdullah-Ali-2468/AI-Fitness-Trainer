// client/src/api/plans_api.js

import axios from "axios";

// ✅ Set Active Plan
export const setActivePlan = async (planId) => {
  try {
    const res = await axios.put(`/api/plans/${planId}/activate`);
    return res.data;
  } catch (error) {
    console.error("Error setting active plan:", error);
    throw error;
  }
};

// ✅ Set Inactive Plan
export const setInactivePlan = async (planId) => {
  try {
    const res = await axios.put(`/api/plans/${planId}/deactivate`);
    return res.data;
  } catch (error) {
    console.error("Error setting inactive plan:", error);
    throw error;
  }
};

// ✅ Delete Plan
export const deletePlan = async (planId) => {
  try {
    const res = await axios.delete(`/api/plans/${planId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};
