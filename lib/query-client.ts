import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api-client";

// 전역 에러 처리 함수
const handleGlobalError = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // 인증 실패 - 로그인 페이지로 리디렉션
        console.error("인증이 필요합니다.");
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          // 필요시 로그인 페이지로 리디렉션
          // window.location.href = '/login';
        }
        break;
      case 403:
        console.error("접근 권한이 없습니다.");
        break;
      case 404:
        console.error("요청한 리소스를 찾을 수 없습니다.");
        break;
      case 500:
        console.error("서버 내부 오류가 발생했습니다.");
        break;
      default:
        console.error("API 오류:", error.message);
    }
  } else {
    console.error("알 수 없는 오류:", error);
  }
};

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 에러 재시도 설정
      retry: (failureCount, error) => {
        // API 에러인 경우
        if (error instanceof ApiError) {
          // 4xx 에러는 재시도하지 않음
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
          // 5xx 에러는 3번까지 재시도
          return failureCount < 3;
        }
        // 네트워크 에러 등은 3번까지 재시도
        return failureCount < 3;
      },
      // 백그라운드에서 자동 새로고침 비활성화
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 새로고침
      refetchOnReconnect: true,
      // 기본 stale time
      staleTime: 1000 * 60 * 5, // 5분
    },
    mutations: {
      // 에러 발생 시 전역 에러 처리
      onError: handleGlobalError,
    },
  },
});
