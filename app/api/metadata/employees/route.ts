import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";

/**
 * GET /api/v2/metadata/employees
 * 직원 검색
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
    const search = searchParams.get("search") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;

    const employees = await apiServer.searchEmployees(token, {
      search,
      departmentId,
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("직원 검색 에러:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "검색에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
