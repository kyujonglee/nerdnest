import { NextRequest, NextResponse } from "next/server";
import { CreateBoardRequest } from "@/types/board.types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://nerdnest.onrender.com";

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: CreateBoardRequest = await request.json();

    console.log("🔄 Creating board:", body);

    // 백엔드 API URL 구성
    const backendUrl = `${BACKEND_BASE_URL}/api/boards`;

    // 요청 헤더 복사 (인증 토큰 포함)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Next.js 내부 헤더나 호스트 관련 헤더 제외
      if (!key.startsWith("x-") && key !== "host" && key !== "connection") {
        headers.set(key, value);
      }
    });

    // Content-Type 헤더 설정
    headers.set("Content-Type", "application/json");

    console.log("📤 Sending to backend:", {
      url: backendUrl,
      headers: Object.fromEntries(headers.entries()),
      body,
    });

    // 백엔드 API 호출
    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("📡 Backend response:", {
      status: response.status,
      statusText: response.statusText,
    });

    // 응답 데이터 읽기
    const responseData = await response.text();
    let parsedData;

    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    if (!response.ok) {
      console.error("❌ Backend error:", parsedData);
      return NextResponse.json(
        { error: parsedData.message || "게시글 등록에 실패했습니다." },
        { status: response.status }
      );
    }

    console.log("✅ Board created successfully:", parsedData);

    // 성공 응답
    return NextResponse.json(parsedData, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("💥 API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

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
