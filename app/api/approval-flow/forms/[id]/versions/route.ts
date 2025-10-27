import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * PATCH /api/v2/approval-flow/forms/:id/versions
 * 문서양식 버전 수정
 */
export async function PATCH(
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
    const version = await apiServer.updateFormVersion(token, params.id, body);
    return NextResponse.json(version);
  } catch (error) {
    console.error("문서양식 버전 수정 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "수정에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
