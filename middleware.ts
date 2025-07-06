import { auth } from "./auth";

export default auth((req) => {
  // 인증이 필요한 라우트들 정의
  const protectedRoutes = ["/profile", "/settings"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // 보호된 라우트에 접근하려는데 인증되지 않은 경우
  if (isProtectedRoute && !req.auth) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
