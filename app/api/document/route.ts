import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * POST /api/v2/document
 * 문서 생성 API
 * AGENTS.md: API Route Handler - Backend API와 1:1 매핑
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
    const { formVersionId, title, content } = body;

    if (!formVersionId || !title || !content) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // Backend API 호출
    const document = await apiServer.createDocument(token, {
      formVersionId,
      title,
      content,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("문서 생성 에러:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "문서 생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v2/document
 * 내 문서 목록 조회 API
 * AGENTS.md: API Route Handler - Backend API와 1:1 매핑
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

    // Backend API 호출
    const documents = await apiServer.getMyDocuments(token);

    return NextResponse.json(documents);
  } catch (error) {
    console.error("문서 조회 에러:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "문서 조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
