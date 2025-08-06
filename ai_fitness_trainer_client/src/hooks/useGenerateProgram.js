// client/src/hooks/useGeneratePlan.js

import { useState } from "react";
import { generatePlan } from "../../src/api/get_user_plan.js"

export const useGeneratePlan = () => {
  const [p_loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [p_error, setError] = useState(null);

  const handleGeneratePlan = async ({ userInfo, goal, duration, customPrompt })  => {
    setLoading(true);
    setError(null);

    try {
      const data = await generatePlan({ userInfo, goal, duration, customPrompt });
      setPlan(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    plan,
    p_loading,
    p_error,
    generate: handleGeneratePlan,
  };
};
