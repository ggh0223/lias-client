import { NextRequest, NextResponse } from "next/server";
import { SSOClient } from "@lumir-company/sso-sdk";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
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

    // 로그인
    const result = await client.sso.login(email, password);

    return NextResponse.json(result);
  } catch (error) {
    console.error("SSO 로그인 실패:", error);

    const errorMessage =
      error instanceof Error ? error.message : "로그인에 실패했습니다.";
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
