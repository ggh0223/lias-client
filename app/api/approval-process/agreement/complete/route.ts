import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/approval-process/agreement/complete
 * 협의 완료
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
    const result = await apiServer.completeAgreement(token, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("협의 완료 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "처리에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
