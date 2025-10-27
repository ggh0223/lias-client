import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/approval-process/cancel
 * 결재 취소
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await apiServer.cancelDocument(token, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("결재 취소 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "취소에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
