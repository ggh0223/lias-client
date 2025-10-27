import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/metadata/departments/:id/employees
 * 부서별 직원 조회
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

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const employees = await apiServer.getDepartmentEmployees(
      token,
      params.id,
      activeOnly
    );
    return NextResponse.json(employees);
  } catch (error) {
    console.error("부서별 직원 조회 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "조회에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
