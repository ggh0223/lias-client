"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./_lib/auth/auth-provider";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  console.log("HomePage 렌더링:", { isAuthenticated, isLoading });

  useEffect(() => {
    console.log("HomePage useEffect 실행:", { isAuthenticated, isLoading });

    // 로딩이 완료된 후에만 리다이렉트 처리
    if (!isLoading) {
      if (isAuthenticated) {
        console.log("인증된 사용자 - 대시보드로 이동");
        // 인증된 사용자는 대시보드로 리다이렉트
        router.push("/dashboard");
      } else {
        console.log("인증되지 않은 사용자 - 로그인 페이지로 이동");
        // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중일 때만 로딩 화면 표시
  if (isLoading) {
    console.log("로딩 중...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            LIAS 결재 시스템
          </h1>
          <p className="text-gray-600">인증 상태를 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  console.log("로딩 완료, 리다이렉트 대기 중...");

  // 로딩이 완료되었지만 리다이렉트가 아직 처리되지 않은 경우
  // (useEffect가 실행되기 전) 빈 화면 표시
  return null;
}
