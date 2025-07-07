import { getSession } from "next-auth/react";

// API 에러 클래스
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// API 응답 타입
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// API 클라이언트 클래스
class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    // 개발환경에서는 Next.js API Routes 프록시 사용 (CORS 문제 해결)
    // 프로덕션에서는 직접 외부 API 서버 사용
    const isDevelopment = process.env.NODE_ENV === "development";

    if (baseURL) {
      this.baseURL = baseURL;
    } else if (isDevelopment) {
      // 개발환경에서는 Next.js API Routes 프록시 사용
      this.baseURL = "/api";
    } else {
      // 프로덕션에서는 직접 백엔드 API 사용
      this.baseURL = `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://nerdnest.onrender.com"
      }/api`;
    }

    console.log("API Client initialized with baseURL:", this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // 기본 헤더 설정
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 토큰이 있다면 Authorization 헤더 추가
    const token = await this.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    console.log("🚀 API Request:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined,
    });

    try {
      const response = await fetch(url, config);

      console.log("📡 API Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // 응답이 ok가 아닌 경우 에러 처리
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorData;

        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ API Error Response:", errorData);
        } catch {
          errorMessage = response.statusText || errorMessage;
          console.error("❌ API Error (no JSON):", errorMessage);
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }

      // 응답이 비어있는 경우 (204 No Content 등)
      if (response.status === 204) {
        console.log("✅ API Success (No Content)");
        return {} as T;
      }

      const responseData = await response.json();
      console.log("✅ API Success Response:", responseData);
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // 네트워크 에러 등
      throw new ApiError("네트워크 오류가 발생했습니다.", 0, error);
    }
  }

  // 토큰 가져오기 (NextAuth 세션에서)
  private async getToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    try {
      // NextAuth 세션에서 토큰 가져오기
      const session = await getSession();
      return session?.accessToken || null;
    } catch (error) {
      console.warn("세션에서 토큰을 가져오는데 실패했습니다:", error);

      // fallback: localStorage에서 토큰 가져오기 (기존 로그인 방식과의 호환성)
      return localStorage.getItem("accessToken");
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// 전역 API 클라이언트 인스턴스
export const apiClient = new ApiClient();
