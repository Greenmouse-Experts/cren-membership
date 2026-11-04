import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/app/services/env";
import { extract_message } from "@/helpers/auth";

export interface PostMutationParams {
  url: string;
  payload?: any;
  type?: string;
}

const usePostHook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ url, payload, type }: PostMutationParams) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("igbo_token") : null;
      const isFormData = payload instanceof FormData;
      const contentType = type && type.includes("/") ? type : "application/json";

      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (!isFormData) {
        headers["Content-Type"] = contentType;
      }

      const res = await axios.post(`${API_URL}/${url}`, payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      if (error?.response?.data?.errors && typeof error.response.data.errors === "object") {
        Object.values(error.response.data.errors).forEach((val: any) => {
          if (Array.isArray(val) && val.length > 0) {
            toast.error(val[0]);
          } else if (typeof val === "string") {
            toast.error(val);
          }
        });
      } else {
        toast.error(extract_message(error));
      }
    },
  });

  const handlePost = useCallback(
    async (url: string, payload: any, type?: any, success?: any) => {
      const callback =
        typeof type === "function" ? type : typeof success === "function" ? success : undefined;
      const contentType = typeof type === "string" ? type : undefined;

      try {
        //@ts-ignore
        const data = await mutation.mutateAsync({ url, payload, type: contentType });
        if (callback) {
          callback(data);
        }
        return data;
      } catch (error) {
        // Error handling is handled in mutation onError
      }
    },
    [mutation],
  );

  return {
    handlePost,
    mutation,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    loading: mutation.isPending,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};

export default usePostHook;
