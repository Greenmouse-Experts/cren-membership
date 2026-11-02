// @ts-nocheck
import { API_URL } from "@/app/services/env";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const usePostRead = () => {
  const handlePost = useCallback(async (url, type, success) => {
    const token  = localStorage.getItem("igbo_token");
    try {
      const config = {
        method: "post",
        url: `${API_URL}/${url}`,
        headers: {
          "Content-Type": type,
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios(config);
      success();
    } catch (error) {
      Object.entries(error.response.data.errors).forEach(([key, value]) => {
        toast.error(value[0]);
      });
    }
  }, []);
  return { handlePost };
};

export default usePostRead;
