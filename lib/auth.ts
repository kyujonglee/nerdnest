import { auth } from "@/auth";
import { redirect } from "next/navigation";

// 현재 사용자 세션 가져오기
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// 인증된 사용자만 접근 가능한 페이지에서 사용
export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

// 백엔드 API 호출 시 인증 토큰 포함
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await auth();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
