import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "결재 시스템 가이드",
  description: "결재 시스템의 구조와 흐름을 이해하고 효과적으로 사용하는 방법",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}
