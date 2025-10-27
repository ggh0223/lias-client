import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/document/:id/submit
 * 문서 제출
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
    const document = await apiServer.submitDocument(token, params.id, body);
    return NextResponse.json(document);
  } catch (error) {
    console.error("문서 제출 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "제출에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
