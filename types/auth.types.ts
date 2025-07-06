// 사용자 정보 타입 정의
export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  jobId: number;
  level: number;
}

// 회원가입 요청 타입 정의
export interface SignUpRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  jobId: number;
  level: number;
  agree: boolean;
}

// 로그인 요청 타입 정의
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  accessToken: string;
  userId: number;
  name: string;
  email: string;
  username: string;
  jobId: number;
  level: number;
  agree: boolean;
}

// 인증 상태 타입
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: UserInfo;
}
