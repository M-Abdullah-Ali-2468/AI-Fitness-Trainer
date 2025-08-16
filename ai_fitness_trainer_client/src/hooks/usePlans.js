import { useState, useEffect } from "react";
import { fetchUserPlans } from "../api/active_inactive_api.js";

/**
 * Custom hook to fetch active and inactive plans for a user by userId
 * @param {string|null} userId - UUID of the user, or null if not available yet
 * @param {boolean} refreshFlag - toggle to force re-fetch
 * @returns {Object} { activePlans, inactivePlans, loading, error }
 */
export default function usePlans(userId, refreshFlag) {
  const [activePlans, setActivePlans] = useState([]);
  const [inactivePlans, setInactivePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      // Reset if no userId
      setActivePlans([]);
      setInactivePlans([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchUserPlans(userId)
      .then(({ activePlans, inactivePlans }) => {
        setActivePlans(activePlans);
        setInactivePlans(inactivePlans);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [userId, refreshFlag]); // ✅ refreshFlag added

  return { activePlans, inactivePlans, loading, error };
}
