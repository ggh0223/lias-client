import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/approval-flow/forms/:id/preview-approval-line
 * 결재선 미리보기
 */
export async function POST(
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

    const body = await request.json();
    const preview = await apiServer.previewApprovalLine(token, params.id, body);
    return NextResponse.json(preview);
  } catch (error) {
    console.error("결재선 미리보기 에러:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "미리보기에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
