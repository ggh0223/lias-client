import { fetchApi, setAuthToken, removeAuthToken } from "./api";
import { LoginRequest, LoginResponse, User } from "../types/auth";

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>(
      "/auth/login",
      "POST",
      credentials
    );

    // 로그인 성공 시 토큰 저장
    if (response.success && response.data.accessToken) {
      setAuthToken(response.data.accessToken);
      // 쿠키용 토큰도 설정
      response.data.token = response.data.accessToken;
    }

    return response.data;
  },

  // 로그아웃
  logout: (): void => {
    removeAuthToken();
  },

  // 현재 사용자 정보 가져오기 (토큰에서 추출)
  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // JWT 토큰의 payload 부분을 디코드
          const payload = JSON.parse(atob(token.split(".")[1]));
          return {
            email: payload.email,
            name: payload.name,
            department: payload.department,
            position: payload.position,
            rank: payload.rank,
            roles: payload.roles,
          };
        } catch (error) {
          console.error("토큰 디코드 실패:", error);
          return null;
        }
      }
    }
    return null;
  },
};
