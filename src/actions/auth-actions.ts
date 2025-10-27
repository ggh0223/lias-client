"use server";

import { redirect } from "next/navigation";
import { apiServer } from "@/lib/api-server";
import { setToken, setUser, removeToken, removeUser } from "@/lib/auth-server";

/**
 * 로그인 액션
 */
export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier") as string;

  if (!identifier) {
    return { error: "직원번호 또는 이메일을 입력해주세요." };
  }

  try {
    // 이메일 형식인지 확인
    const isEmail = identifier.includes("@");

    const response = await apiServer.generateToken(
      isEmail ? { email: identifier } : { employeeNumber: identifier }
    );

    // 서버 측 토큰과 사용자 정보 저장 (쿠키)
    await setToken(response.accessToken);
    await setUser(response.employee);

    // 클라이언트에서 사용할 수 있도록 토큰 반환
    return {
      success: true,
      accessToken: response.accessToken,
      employee: response.employee,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "로그인에 실패했습니다.",
    };
  }
}

/**
 * 직원번호로 빠른 로그인 액션 (조직도용)
 */
export async function quickLoginAction(employeeNumber: string) {
  if (!employeeNumber) {
    return { error: "직원번호가 필요합니다." };
  }

  try {
    const response = await apiServer.generateToken({ employeeNumber });

    // 서버 측 토큰과 사용자 정보 저장 (쿠키)
    await setToken(response.accessToken);
    await setUser(response.employee);

    // 클라이언트에서 사용할 수 있도록 토큰 반환
    return {
      success: true,
      accessToken: response.accessToken,
      employee: response.employee,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "로그인에 실패했습니다.",
    };
  }
}

/**
 * 로그아웃 액션
 */
export async function logoutAction() {
  await removeToken();
  await removeUser();
  redirect("/login");
}
