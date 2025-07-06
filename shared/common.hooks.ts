import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// Meta API 응답 타입 정의
export interface Category {
  id: number;
  name: string;
}

export interface Job {
  id: number;
  name: string;
}

export interface MetaResponse {
  categories: Category[];
  jobs: Job[];
}

// Meta 데이터를 가져오는 훅
export const useMeta = () => {
  return useQuery<MetaResponse>({
    queryKey: ["meta"],
    queryFn: () => apiClient.get<MetaResponse>("/nerdnest/meta"),
  });
};

// 카테고리만 가져오는 훅
export const useCategories = () => {
  const { data: meta, ...rest } = useMeta();
  return {
    ...rest,
    data: meta?.categories || [],
  };
};

// 직업(jobs)만 가져오는 훅
export const useJobs = () => {
  const { data: meta, ...rest } = useMeta();
  return {
    ...rest,
    data: meta?.jobs || [],
  };
};
