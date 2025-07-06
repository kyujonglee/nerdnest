import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { LoginRequest, LoginResponse } from "@/types/auth.types";

// 로그인 스키마 정의
const signInSchema = z.object({
  email: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "fallback-secret-for-development-only",
  providers: [
    Credentials({
      // 로그인 폼 필드 정의
      credentials: {
        email: {
          label: "아이디",
          type: "text",
          placeholder: "아이디를 입력하세요",
        },
        password: {
          label: "비밀번호",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          console.log("🔍 Authorization attempt:", { credentials });

          // Zod를 사용한 입력값 검증
          const { email, password } = signInSchema.parse(credentials);
          console.log("✅ Validation passed:", { email, password: "***" });

          // 실제 API 호출 (email 필드를 username으로 사용)
          const loginData: LoginRequest = {
            username: email, // 프론트엔드에서는 email 필드명을 사용하지만 백엔드에서는 username으로 처리
            password,
          };

          console.log("📤 Login API request:", {
            username: email,
            password: "***",
          });

          // 서버 사이드에서는 절대 URL 사용 (NextAuth authorize는 서버에서 실행됨)
          const backendUrl = `${
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://nerdnest.onrender.com"
          }/api/members/auth`;

          console.log("🌐 Backend URL:", backendUrl);

          const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          });

          console.log("📡 API Response:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ API Error response:", errorText);
            return null;
          }

          const result: LoginResponse = await response.json();

          console.log("✅ Login successful:", result);

          // NextAuth 사용자 객체 형식으로 변환
          return {
            id: result.userId.toString(),
            email: result.email,
            name: result.name,
            image: null,
            accessToken: result.accessToken,
            username: result.username,
            jobId: result.jobId,
            level: result.level,
          };
        } catch (error: any) {
          console.error("💥 Auth error:", error);

          // API 에러 메시지 로깅
          if (error.status) {
            console.error(`❌ API Error ${error.status}:`, error.message);
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 로그인 시점에 백엔드에서 받은 정보를 JWT에 저장
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.jobId = user.jobId;
        token.level = user.level;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 토큰 및 사용자 정보 추가
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.username = token.username;
        session.user.jobId = token.jobId;
        session.user.level = token.level;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // 커스텀 로그인 페이지
  },
  session: {
    strategy: "jwt", // JWT 전략 사용
  },
});
