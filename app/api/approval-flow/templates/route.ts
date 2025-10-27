import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/approval-flow/templates
 * 결재선 템플릿 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;

    const templates = await apiServer.getApprovalLineTemplates(token, type);
    return NextResponse.json(templates);
  } catch (error) {
    console.error("결재선 템플릿 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v2/approval-flow/templates
 * 결재선 템플릿 생성
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
    const template = await apiServer.createApprovalLineTemplate(token, body);
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("결재선 템플릿 생성 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
