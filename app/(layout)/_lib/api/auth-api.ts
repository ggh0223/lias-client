// 인증 관련 API 호출 함수 (SSO SDK 사용)

import { LoginResponse, AuthUser, getRefreshToken } from "../auth/auth-utils";

// 로그인 API 호출 (SSO)
export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/sso/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "로그인에 실패했습니다.");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
};

// 사용자 정보 조회 API 호출 (SSO Token Verify)
export const getUserInfoApi = async (token: string): Promise<AuthUser> => {
  try {
    const response = await fetch("/api/sso/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "사용자 정보 조회에 실패했습니다.");
    }

    const data = await response.json();

    // SSO UserInfo를 AuthUser 형식으로 변환
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      employeeNumber: data.employee_number,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("사용자 정보 조회 중 오류가 발생했습니다.");
  }
};

// 토큰 갱신 API 호출 (SSO)
export const refreshTokenApi = async (): Promise<LoginResponse> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("Refresh Token이 없습니다.");
    }

    const response = await fetch("/api/sso/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "토큰 갱신에 실패했습니다.");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("토큰 갱신 중 오류가 발생했습니다.");
  }
};
