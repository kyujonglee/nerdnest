import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://nerdnest.onrender.com");
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Keep-alive cron job successful:", data);
    return NextResponse.json({
      message: "Keep-alive request sent successfully.",
    });
  } catch (error) {
    console.error("Keep-alive cron job failed:", error);
    return NextResponse.json(
      { message: "Failed to send keep-alive request." },
      { status: 500 }
    );
  }
}
