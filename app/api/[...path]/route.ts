import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://nerdnest.onrender.com";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const apiPath = path.join("/");

  // 백엔드 API URL 구성
  const url = new URL(request.url);
  const queryString = url.search; // ?page=0&keyword=UX 형태
  const backendUrl = `${BACKEND_BASE_URL}/${apiPath}${queryString}`;

  console.log("🔄 Proxying request:", {
    method: request.method,
    originalUrl: request.url,
    backendUrl,
    headers: Object.fromEntries(request.headers.entries()),
  });

  try {
    // 요청 헤더 복사 (일부 제외)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Next.js 내부 헤더나 호스트 관련 헤더 제외
      if (!key.startsWith("x-") && key !== "host" && key !== "connection") {
        headers.set(key, value);
      }
    });

    // 요청 본문 읽기
    let body: string | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text();
    }

    // 백엔드 API 호출
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    console.log("📡 Backend response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // 응답 데이터 읽기
    const responseData = await response.text();

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // CORS 헤더 및 기타 필요한 헤더만 복사
      if (
        key === "content-type" ||
        key === "content-length" ||
        key.startsWith("access-control-")
      ) {
        responseHeaders.set(key, value);
      }
    });

    // CORS 헤더 추가
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    responseHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: "프록시 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};

// OPTIONS 메서드 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
