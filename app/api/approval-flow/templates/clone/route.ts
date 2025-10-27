import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/approval-flow/templates/clone
 * 결재선 템플릿 복제
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
    const version = await apiServer.cloneApprovalLineTemplate(token, body);
    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    console.error("결재선 템플릿 복제 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "복제에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
