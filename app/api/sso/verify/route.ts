import { NextRequest, NextResponse } from "next/server";
import { SSOClient } from "@lumir-company/sso-sdk";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다." },
        { status: 400 }
      );
    }

    // SSO Client 초기화
    const client = new SSOClient({
      baseUrl:
        process.env.NEXT_PUBLIC_SSO_BASE_URL || "https://lsso.vercel.app",
      clientId: process.env.SSO_CLIENT_ID!,
      clientSecret: process.env.SSO_CLIENT_SECRET!,
    });

    // 시스템 인증
    await client.initialize();

    // 토큰 검증
    const result = await client.sso.verifyToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: "유효하지 않은 토큰입니다." },
        { status: 401 }
      );
    }

    return NextResponse.json(result.user_info);
  } catch (error) {
    console.error("SSO 토큰 검증 실패:", error);

    const errorMessage =
      error instanceof Error ? error.message : "토큰 검증에 실패했습니다.";
    const errorStatus =
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 401;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: errorStatus }
    );
  }
}
