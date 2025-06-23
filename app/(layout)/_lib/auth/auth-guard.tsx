"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  redirectTo = "/login",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // 권한이 필요한 경우 권한 확인
      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some((role) =>
          user.roles.includes(role)
        );

        if (!hasRequiredRole) {
          // 권한이 없는 경우 대시보드로 리다이렉트
          router.push("/dashboard");
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRoles, router, redirectTo]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 권한이 필요한 경우 권한 확인
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              접근 권한이 없습니다
            </h1>
            <p className="text-gray-600">
              이 페이지에 접근할 수 있는 권한이 없습니다.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
