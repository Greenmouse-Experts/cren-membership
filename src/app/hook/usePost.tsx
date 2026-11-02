// @ts-nocheck
import { API_URL } from "@/app/services/env";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const usePostHook = () => {
  const handlePost = useCallback(async (url, payload, type, success) => {
   
      const token  = localStorage.getItem("igbo_token");
    
    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      
      const res = await axios.post(
        `${API_URL}/${url}`,
        payload,
        config
      );
      success();
    } catch (error) {
      if (error?.response?.data?.errors) {
        Object.entries(error?.response?.data?.errors).forEach(
          ([key, value]) => {
            toast.error(value[0]);
          }
        );
      }
    }
  }, []);
  return { handlePost };
};
export default usePostHook;
