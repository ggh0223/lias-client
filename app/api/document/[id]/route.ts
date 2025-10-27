import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/document/:id
 * 문서 조회
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

    const document = await apiServer.getDocumentById(token, params.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error("문서 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v2/document/:id
 * 문서 수정
 */
export async function PUT(
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
    const document = await apiServer.updateDocument(token, params.id, body);
    return NextResponse.json(document);
  } catch (error) {
    console.error("문서 수정 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "수정에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v2/document/:id
 * 문서 삭제
 */
export async function DELETE(
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

    const result = await apiServer.deleteDocument(token, params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("문서 삭제 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "삭제에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
