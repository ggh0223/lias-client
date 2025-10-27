import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/approval-flow/forms
 * 문서양식 목록 조회
 */
export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const forms = await apiServer.getForms(token);
    return NextResponse.json(forms);
  } catch (error) {
    console.error("문서양식 목록 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v2/approval-flow/forms
 * 문서양식 생성
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
    const form = await apiServer.createForm(token, body);
    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("문서양식 생성 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
