import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import type {
  UserInfo,
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  AuthState,
} from "@/types/auth.types";

// Query Keys (타입 안전성을 위해)
export const authQueryKeys = {
  all: ["auth"] as const,
  myInfo: () => [...authQueryKeys.all, "myInfo"] as const,
} as const;

// API 호출 함수들
const authApi = {
  // 사용자 정보 조회
  getMyInfo: (): Promise<UserInfo> =>
    apiClient.get<UserInfo>("/api/members/myinfo"),

  // 회원가입
  signUp: (data: SignUpRequest): Promise<void> =>
    apiClient.post<void>("/api/members", data),

  // 로그인
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/api/members/auth", data),

  // 로그아웃 (토큰 삭제)
  logout: (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    return Promise.resolve();
  },
};

// 사용자 정보 조회 훅
export const useMyInfo = () => {
  return useQuery({
    queryKey: authQueryKeys.myInfo(),
    queryFn: authApi.getMyInfo,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: (failureCount, error: any) => {
      // 401 에러인 경우 재시도하지 않음 (인증 실패)
      if (error?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

// 회원가입 훅
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpRequest) => {
      console.log("🔄 회원가입 API 호출 시작:", data);
      return authApi.signUp(data);
    },
    onSuccess: async (data, variables) => {
      // 회원가입 성공 시 필요한 후처리
      console.log("✅ 회원가입이 완료되었습니다:", data);

      // 회원가입 성공 후 자동 로그인
      try {
        const result = await signIn("credentials", {
          email: variables.username, // variables에서 username 사용
          password: variables.password, // variables에서 password 사용
          redirect: false,
        });

        if (result?.ok) {
          console.log("🎉 자동 로그인 성공!");
        } else {
          console.warn("⚠️ 자동 로그인 실패:", result?.error);
        }
      } catch (error) {
        console.error("❌ 자동 로그인 중 오류:", error);
      }
    },
    onError: (error) => {
      console.error("❌ 회원가입 실패:", error);
    },
  });
};

// 로그인 훅
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse) => {
      // 토큰을 localStorage에 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
      }

      // 사용자 정보 캐시 무효화 및 새로고침
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.myInfo(),
      });

      console.log("로그인이 완료되었습니다.");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 모든 쿼리 캐시 클리어
      queryClient.clear();
      console.log("로그아웃이 완료되었습니다.");
    },
  });
};

// 인증 상태 확인 훅
export const useIsAuthenticated = (): AuthState => {
  const { data: userInfo, isLoading, error } = useMyInfo();

  return {
    isAuthenticated: !!userInfo && !error,
    isLoading,
    user: userInfo,
  };
};
