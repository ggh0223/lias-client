"use client";

import { useAuth } from "../_lib/auth/auth-provider";
import ClientLayoutProvider from "./client-layout";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { user, logout } = useAuth();

  // 사용자 정보 구성
  const userInfo = user
    ? {
        name: user.name,
        email: user.email,
        initials: user.name.charAt(0),
      }
    : undefined;

  return (
    <ClientLayoutProvider user={userInfo} onLogout={logout}>
      {children}
    </ClientLayoutProvider>
  );
}
