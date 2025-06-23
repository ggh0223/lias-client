"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// 서버 사이드에서 토큰 가져오기
export const getServerToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
};

// 서버 사이드에서 사용자 정보 가져오기
export const getServerUserInfo = async () => {
  const token = await getServerToken();

  if (!token) {
    return null;
  }

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("서버 사용자 정보 조회 실패:", error);
    return null;
  }
};

// 서버 사이드 인증 확인
export const checkServerAuth = async () => {
  const user = await getServerUserInfo();

  if (!user) {
    redirect("/login");
  }

  return user;
};

// 서버 사이드 권한 확인
export const checkServerRole = async (requiredRoles: string[]) => {
  const user = await getServerUserInfo();

  if (!user) {
    redirect("/login");
  }

  const hasRequiredRole = requiredRoles.some((role) =>
    user.roles.includes(role)
  );

  if (!hasRequiredRole) {
    redirect("/dashboard");
  }

  return user;
};

// 로그아웃 서버 액션
export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  redirect("/login");
};
