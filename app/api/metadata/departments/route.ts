import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/metadata/departments
 * 부서 목록 조회
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

    const departments = await apiServer.getDepartments(token);
    return NextResponse.json(departments);
  } catch (error) {
    console.error("부서 목록 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
