"use client";

import { useEffect } from "react";
import LoginForm from "../_components/login-form";

export default function LoginPage() {
  useEffect(() => {
    // 로컬 스토리지에서 세션 만료 정보 확인
    try {
      const sessionExpired = localStorage.getItem("session_expired");
      if (sessionExpired === "true") {
        // 토스트 메시지 대신 콘솔 로그로 대체
        console.warn("토큰이 만료되어 재로그인이 필요합니다.");
        // 메시지를 표시한 후 로컬 스토리지에서 정보 제거
        localStorage.removeItem("session_expired");
      }
    } catch (e) {
      console.error("로컬 스토리지 접근 오류:", e);
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      {/* 배경 웨이브 패턴 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] animate-wave rounded-full bg-gradient-to-r from-blue-200 to-purple-200 blur-3xl" />
          <div className="animation-delay-2000 absolute -right-1/4 bottom-0 h-[500px] w-[500px] animate-wave rounded-full bg-gradient-to-r from-purple-200 to-pink-200 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative w-full max-w-sm space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}
