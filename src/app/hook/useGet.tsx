// @ts-nocheck
import { API_URL } from "@/app/services/env";
import { useEffect, useState } from "react";
import axios from "axios";

const useGetHook = (url) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchItem = async () => {
    setLoading(true);
    const token  = localStorage.getItem("igbo_token");
    
    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      };
     
      const res = await axios.get(
        `${API_URL}/${url}`,
        config
      );
      const data = res.data;
      setItem(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchItem();
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, data: item, refetch };
};
export default useGetHook;
