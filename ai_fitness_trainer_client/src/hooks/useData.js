// client/src/hooks/useData.js
import { useState, useEffect } from "react";
import { fetchUserOnboardingData } from "../api/fetch_user_data";

const useData = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true); // Ensure loading is true on every fetch
      const response = await fetchUserOnboardingData(userId);

      if (response.success) {
        setData(response.data.data.data);
        setError(null); // clear any previous errors
      } else {
        setError(response.error || "Failed to fetch data");
        setData(null); // clear any stale data
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return { data, loading, error };
};

export default useData;
