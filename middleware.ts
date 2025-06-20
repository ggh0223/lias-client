import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 서버 액션 대신 직접 토큰 검증 로직 구현
  let result;

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log(accessToken);
    // 토큰이 없는 경우 바로 인증 실패 반환
    if (!accessToken && !refreshToken) {
      console.log("No authentication tokens found");
      result = { success: false, redirect: "/login" };
    } else {
      const apiUrl = process.env.LIAS_API
        ? `${process.env.LIAS_API}/auth/me`
        : null;
      console.log(apiUrl);
      // URL이 유효한지 확인
      if (!apiUrl) {
        console.error("LIAS API URL 환경 변수가 설정되지 않았습니다.");
        result = { success: false, error: "API URL이 설정되지 않았습니다." };
      } else {
        // 토큰이 있으면 사용자 정보 요청 시도
        if (accessToken) {
          const response = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.status === 401) {
            // 액세스 토큰이 유효하지 않고 리프레시 토큰이 있는 경우 토큰 갱신 시도
            if (refreshToken) {
              // 리프레시 토큰이 있어도 재갱신하지 않고 로그인으로 리다이렉트
              result = { success: false, redirect: "/login" };
            } else {
              // 리프레시 토큰이 없는 경우 로그인으로 리다이렉트
              result = { success: false, redirect: "/login" };
            }
          } else if (!response.ok) {
            console.error(
              "API 응답 오류:",
              response.status,
              response.statusText
            );
            result = { success: false, error: "서버 응답 오류" };
          } else {
            const user = await response.json();
            result = { success: true, data: user };
          }
        } else if (refreshToken) {
          // 액세스 토큰이 없지만 리프레시 토큰이 있는 경우 로그인으로 리다이렉트
          result = { success: false, redirect: "/login" };
        } else {
          // 액세스 토큰이 없는 경우
          result = { success: false, redirect: "/login" };
        }
      }
    }
  } catch (error) {
    console.error("인증 처리 중 오류 발생:", error);
    // 오류 발생 시 로그인 페이지로 리다이렉트
    const response = NextResponse.redirect(new URL("/login", request.url));
    // 모든 인증 관련 쿠키 삭제
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("client_auth");
    response.cookies.set("clear_token", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10, // 10초만 유지
    });
    return response;
  }

  const { pathname } = request.nextUrl;

  // 정적 파일은 리다이렉트하지 않고 바로 처리
  if (
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.includes("_next") ||
    pathname.includes("webpack") ||
    pathname.includes("page.js") ||
    pathname.includes("layout.js") ||
    pathname.includes("app-pages-internals")
  ) {
    return NextResponse.next();
  }

  // 로그인 페이지는 항상 접근 가능
  if (pathname === "/login") {
    if (result && result.success) {
      // 이미 인증된 사용자는 메인 페이지로
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 루트 경로는 인증된 사용자만 접근 가능
  if (pathname === "/") {
    if (!result || !result.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 인증되지 않은 사용자는 로그인 페이지로
  if (!result || !result.success) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("client_auth");
    response.cookies.set("clear_token", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10, // 10초만 유지
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif).*)",
  ],
};
