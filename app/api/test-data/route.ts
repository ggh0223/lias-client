import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";

/**
 * 시나리오 기반 테스트 데이터 생성
 * POST /api/test-data
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      redirect("/login");
    }

    const body = await request.json();
    const result = await apiServer.createTestData(token, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("테스트 데이터 생성 실패:", error);
    return NextResponse.json(
      {
        statusCode: 400,
        message:
          error instanceof Error
            ? error.message
            : "테스트 데이터 생성에 실패했습니다",
        error: "Bad Request",
      },
      { status: 400 }
    );
  }
}
