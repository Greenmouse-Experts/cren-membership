import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "@/app/services/env";
import type { ApiResponse } from "@/types/api";

export interface UseGetOptions<T = any> extends Omit<
  UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>>,
  "queryKey" | "queryFn"
> {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  enabled?: boolean;
}

export const fetchApi = async <T = any,>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("igbo_token") : null;
  const res = await axios.get<ApiResponse<T>>(`${API_URL}/${url}`, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...config?.headers,
    },
  });
  return res.data;
};

const useGetHook = <T = any,>(url: string | null | undefined, options?: UseGetOptions<T>) => {
  const query = useQuery<ApiResponse<T>, Error>({
    queryKey: [url, options?.params],
    queryFn: () => fetchApi<T>(url!, { params: options?.params, headers: options?.headers }),
    enabled: !!url && (options?.enabled ?? true),
    ...options,
  });

  return {
    ...query,
    query,
    data: query.data,
    loading: query.isLoading,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useGetHook;
