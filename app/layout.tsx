import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/app-context";

export const metadata: Metadata = {
  title: "LIAS 결재 시스템",
  description: "전자결재 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
