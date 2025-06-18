"use client";

import { Geist } from "next/font/google";

// 1. 기본 foundation 토큰 (shared)
import "lumir-design-system-shared/foundation-tokens";

// 2. 컴포넌트 스타일 (system-02)
import "lumir-design-system-02/styles";

// 3. 테마 토큰 (system-02)
import "lumir-design-system-02/tokens";

// 4. 컴포넌트 임포트
import { Frame, Surface } from "lumir-design-system-shared";
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
      </head>
      <body className={geistSans.variable}>
        <Surface
          as="div"
          className="flex flex-col min-h-screen"
          background="secondary-system01-1-rest"
        >
          <Header />
          <Frame direction="row" className="flex flex-1">
            <Sidebar />
            <Surface
              as="main"
              className="flex-1 p-6 overflow-y-auto"
              background="secondary-system01-2-rest"
              boxShadow="10"
            >
              {children}
            </Surface>
          </Frame>
        </Surface>
      </body>
    </html>
  );
}
