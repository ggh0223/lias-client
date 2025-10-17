// 토큰 관리 및 검증 유틸리티

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  employeeNumber: string;
  department?: string;
  position?: string;
  rank?: string;
  systemRoles?: Record<string, string[]>;
}

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  hireDate?: string;
  status: string;
  department?: string;
  position?: string;
  rank?: string;
  systemRoles?: Record<string, string[]>;
}

// Access Token 저장
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

// Access Token 가져오기
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Access Token 삭제
export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

// Refresh Token 저장
export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
};

// Refresh Token 가져오기
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

// Refresh Token 삭제
export const removeRefreshToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("refreshToken");
  }
};

// 사용자 정보 저장
export const setUserInfo = (user: AuthUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }
};

// 사용자 정보 가져오기
export const getUserInfo = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};

// 사용자 정보 삭제
export const removeUserInfo = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userInfo");
  }
};

// 토큰 유효성 검사 (JWT 토큰 만료 확인)
export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && isTokenValid(token);
};

// 로그아웃 처리
export const logout = (): void => {
  removeAccessToken();
  removeRefreshToken();
  removeUserInfo();
};

// 권한 확인 (SSO systemRoles 구조에 맞춤)
export const hasRole = (
  systemName: string,
  requiredRoles: string[]
): boolean => {
  const user = getUserInfo();
  if (!user || !user.systemRoles) return false;

  const userRoles = user.systemRoles[systemName] || [];
  return requiredRoles.some((role) => userRoles.includes(role));
};

// 관리자 권한 확인
export const isAdmin = (systemName: string = "lias"): boolean => {
  return hasRole(systemName, ["ADMIN"]);
};
