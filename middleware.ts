import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const { pathname } = nextUrl;

  const isAuthRoute =
    pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");

  // 로그인 상태에서 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // 인증이 필요한 라우트들 정의
  const protectedRoutes = ["/profile", "/settings"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 보호된 라우트에 접근하려는데 인증되지 않은 경우
  if (isProtectedRoute && !isLoggedIn) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
