/**
 * Auth Utilities - Server Side
 * 서버 컴포넌트와 Server Actions에서 사용하는 인증 유틸리티
 */

import { cookies } from "next/headers";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export interface User {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
}

// 서버 사이드 토큰 저장
export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

// 서버 사이드 토큰 가져오기
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value || null;
}

// 서버 사이드 토큰 삭제
export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}

// 서버 사이드 사용자 정보 저장
export async function setUser(user: User) {
  const cookieStore = await cookies();
  cookieStore.set(USER_KEY, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

// 서버 사이드 사용자 정보 가져오기
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_KEY)?.value;
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

// 서버 사이드 사용자 정보 삭제
export async function removeUser() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_KEY);
}
