"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutContainer,
  Sidebar,
  DesignSettingsProvider,
  useDesignSettings,
} from "@lumir-company/design-system-v0/dist";

// 메뉴 그룹 정의
const menuGroups = [
  {
    title: "결재함",
    items: [
      {
        title: "상신함",
        path: "/approval/draft",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        ),
        listType: "drafted",
      },

      {
        title: "협의함",
        path: "/approval/agreement",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        ),
        listType: "pending_agreement",
      },
      {
        title: "미결함",
        path: "/approval/pending",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        listType: "pending_approval",
      },
      {
        title: "반려함",
        path: "/approval/rejected",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        listType: "rejected",
      },
      {
        title: "기결함",
        path: "/approval/completed",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        listType: "approved",
      },
      {
        title: "시행함",
        path: "/approval/implementation",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        ),
        listType: "implementation",
      },

      {
        title: "수신참조함",
        path: "/approval/received",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
        listType: "received_reference",
      },
    ],
  },
  {
    title: "관리 기능",
    items: [
      {
        title: "결재선 관리",
        path: "/management/approval-lines",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
      {
        title: "문서양식 관리",
        path: "/management/templates",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        title: "문서 분류 관리",
        path: "/management/categories",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        ),
      },
    ],
  },
];

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    initials: string;
  };
  onLogout?: () => void;
}

export function ClientLayout({ children, user, onLogout }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);

  // 로그인 페이지인 경우 사이드바를 표시하지 않음

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // 로그아웃 후 로그인 페이지로 이동
    router.push("/login");
  };

  const handleModeToggle = () => {
    setIsAdminMode(!isAdminMode);
    console.log("모드 전환:", !isAdminMode ? "관리자" : "사용자");
  };

  const { setRadius } = useDesignSettings();
  setRadius(0);

  return (
    <div className="flex w-full h-screen bg-background text-foreground">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activePath={pathname}
        menuGroups={menuGroups}
        user={user}
        onLogout={handleLogout}
        isAdminMode={isAdminMode}
        onModeToggle={handleModeToggle}
        showModeToggle={true}
        showNotification={true}
        showSettings={true}
      />

      <main className="flex-1 w-full ">
        <LayoutContainer
          type="full"
          hasSidebar={true}
          sidebarCollapsed={isSidebarCollapsed}
        >
          {children}
        </LayoutContainer>
      </main>
    </div>
  );
}

export default function ClientLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DesignSettingsProvider>
      <ClientLayout>{children}</ClientLayout>
    </DesignSettingsProvider>
  );
}
