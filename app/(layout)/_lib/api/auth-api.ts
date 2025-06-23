// 인증 관련 API 호출 함수

import { LoginResponse, AuthUser } from "../auth/auth-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 로그인 API 호출
export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "로그인에 실패했습니다.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
};

// 사용자 정보 조회 API 호출
export const getUserInfoApi = async (): Promise<AuthUser> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "사용자 정보 조회에 실패했습니다.");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("사용자 정보 조회 중 오류가 발생했습니다.");
  }
};

// 토큰 갱신 API 호출 (필요시)
export const refreshTokenApi = async (): Promise<{ accessToken: string }> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "토큰 갱신에 실패했습니다.");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("토큰 갱신 중 오류가 발생했습니다.");
  }
};
