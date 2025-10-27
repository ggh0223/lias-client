import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/metadata/departments/hierarchy/with-employees
 * 계층구조 부서 및 직원 조회
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
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const hierarchy = await apiServer.getDepartmentHierarchyWithEmployees(
      token,
      activeOnly
    );
    return NextResponse.json(hierarchy);
  } catch (error) {
    console.error("계층구조 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
