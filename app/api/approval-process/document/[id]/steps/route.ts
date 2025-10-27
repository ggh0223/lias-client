import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/approval-process/document/:id/steps
 * 문서의 결재 단계 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const result = await apiServer.getDocumentSteps(token, params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("문서의 결재 단계 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
