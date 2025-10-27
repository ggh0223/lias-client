import { NextRequest, NextResponse } from "next/server";
import { apiServer } from "@/lib/api-server";

/**
 * JWT 액세스 토큰 생성
 * POST /api/test-data/token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await apiServer.generateToken(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("토큰 생성 실패:", error);
    return NextResponse.json(
      {
        statusCode: 400,
        message:
          error instanceof Error
            ? error.message
            : "토큰 생성에 실패했습니다",
        error: "Bad Request",
      },
      { status: 400 }
    );
  }
}
