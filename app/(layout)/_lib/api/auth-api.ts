// 인증 관련 API 호출 함수

import { LoginResponse, AuthUser } from "../auth/auth-utils";
import { ApiClient, ApiResponse } from "./api-client";

// 로그인 API 호출
export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await ApiClient.post<LoginResponse>(
      "/api/auth/login",
      { email, password },
      false // 인증 불필요
    );
    return response;
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
    const response = await ApiClient.get<ApiResponse<AuthUser>>("/api/auth/me");
    return response.data;
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
    const response = await ApiClient.post<ApiResponse<{ accessToken: string }>>(
      "/api/auth/refresh"
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("토큰 갱신 중 오류가 발생했습니다.");
  }
};
