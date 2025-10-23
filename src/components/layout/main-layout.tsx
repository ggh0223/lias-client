"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth-actions";
import type { User } from "@/lib/auth-client";
import OrgSidebar from "./org-sidebar";
import TestDataManager from "./test-data-manager";

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOrgSidebarOpen, setIsOrgSidebarOpen] = useState(false);

  const navigation = [
    { name: "시스템 가이드", href: "/guide", icon: "📖" },
    { name: "대시보드", href: "/dashboard", icon: "📊" },
    { name: "내 결재 대기", href: "/approval/pending", icon: "⏳" },
    { name: "내 문서", href: "/documents/my", icon: "📄" },
    { name: "문서 작성", href: "/documents/new", icon: "✏️" },
    { name: "문서양식 관리", href: "/admin/forms", icon: "📋" },
    { name: "결재선 관리", href: "/admin/approval-lines", icon: "📌" },
  ];

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 text-gray-600 hover:text-gray-900 text-xl"
                title="메뉴 토글"
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                LIAS 결재 시스템
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsOrgSidebarOpen(!isOrgSidebarOpen)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="조직도 토글"
              >
                👥 조직도
              </button>
              <TestDataManager />
              <div className="text-sm">
                <p className="text-gray-700 font-medium">{user.name}</p>
                <p className="text-gray-500">{user.employeeNumber}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white shadow-sm flex-shrink-0 overflow-y-auto">
            <nav className="mt-5 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Right Sidebar - Organization Chart */}
        <OrgSidebar
          isOpen={isOrgSidebarOpen}
          onClose={() => setIsOrgSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
