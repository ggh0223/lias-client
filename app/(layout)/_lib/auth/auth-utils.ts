// 토큰 관리 및 검증 유틸리티

export interface AuthUser {
  email: string;
  name: string;
  department: string;
  position: string;
  rank: string;
  roles: string[];
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    email: string;
    name: string;
    department: string;
    position: string;
    rank: string;
    roles: string[];
  };
  message?: string;
}

// 토큰 저장
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

// 토큰 가져오기
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// 토큰 삭제
export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
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
  removeUserInfo();
};

// 권한 확인
export const hasRole = (requiredRoles: string[]): boolean => {
  const user = getUserInfo();
  if (!user) return false;

  return requiredRoles.some((role) => user.roles.includes(role));
};

// 관리자 권한 확인
export const isAdmin = (): boolean => {
  return hasRole(["admin"]);
};
