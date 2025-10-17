"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  isAuthenticated,
  getUserInfo,
  setUserInfo,
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  logout as logoutUtil,
} from "./auth-utils";
import { loginApi, getUserInfoApi } from "../api/auth-api";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("AuthProvider 렌더링:", { user, isLoading });

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("AuthProvider 초기화 시작");
      try {
        // 토큰이 있는지 먼저 확인
        const hasToken = isAuthenticated();
        console.log("토큰 확인 결과:", hasToken);

        if (hasToken) {
          // 로컬에 저장된 사용자 정보가 있으면 사용
          const localUser = getUserInfo();
          console.log("로컬 사용자 정보:", localUser);

          if (localUser) {
            setUser(localUser);
            console.log("로컬 사용자 정보로 설정 완료");
          } else {
            // 서버에서 사용자 정보 다시 조회
            try {
              console.log("서버에서 사용자 정보 조회 중...");
              await refreshUserInfo();
            } catch (error) {
              console.error("사용자 정보 조회 실패:", error);
              // 서버 조회 실패 시 로그아웃 처리
              logoutUtil();
            }
          }
        } else {
          // 토큰이 없으면 즉시 로딩 완료
          console.log("토큰이 없습니다. 로그인 페이지로 이동합니다.");
        }
      } catch (error) {
        console.error("인증 초기화 실패:", error);
        // 인증 실패 시 로그아웃 처리
        logoutUtil();
      } finally {
        console.log("AuthProvider 초기화 완료, isLoading = false");
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loginResponse = await loginApi(email, password);

      // SSO 응답에서 사용자 정보 추출
      const userInfo: AuthUser = {
        id: loginResponse.id,
        email: loginResponse.email,
        name: loginResponse.name,
        employeeNumber: loginResponse.employeeNumber,
        department: loginResponse.department,
        position: loginResponse.position,
        rank: loginResponse.rank,
        systemRoles: loginResponse.systemRoles,
      };

      // 토큰과 사용자 정보 저장
      setAccessToken(loginResponse.accessToken);
      if (loginResponse.refreshToken) {
        setRefreshToken(loginResponse.refreshToken);
      }
      setUserInfo(userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    logoutUtil();
    setUser(null);
  };

  // 사용자 정보 새로고침
  const refreshUserInfo = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const userInfo = await getUserInfoApi(token);
      setUserInfo(userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUserInfo,
  };

  console.log("AuthProvider value:", {
    user,
    isLoading,
    isAuthenticated: !!user,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
