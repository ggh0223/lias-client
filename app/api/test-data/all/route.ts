import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";

/**
 * 모든 테스트 데이터 삭제
 * DELETE /api/test-data/all
 */
export async function DELETE() {
  try {
    const token = await getToken();
    if (!token) {
      redirect("/login");
    }

    const result = await apiServer.deleteAllTestData(token);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("테스트 데이터 삭제 실패:", error);
    return NextResponse.json(
      {
        statusCode: 400,
        message:
          error instanceof Error
            ? error.message
            : "테스트 데이터 삭제에 실패했습니다",
        error: "Bad Request",
      },
      { status: 400 }
    );
  }
}
