"use client";

import { Geist } from "next/font/google";

// 1. 기본 foundation 토큰 (shared)
import "lumir-design-system-shared/foundation-tokens";

// 2. 컴포넌트 스타일 (system-02)
import "lumir-design-system-02/styles";

// 3. 테마 토큰 (system-02)
import "lumir-design-system-02/tokens";

// 4. 컴포넌트 임포트
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// 5. 애플리케이션 스타일
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="light">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={geistSans.variable}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 overflow-auto p-8 bg-white/40 backdrop-blur-sm">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
