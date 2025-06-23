import type { Metadata } from "next";
import "@/globals.css";
import { AuthProvider } from "./_lib/auth/auth-provider";
import AuthenticatedLayout from "./_components/authenticated-layout";

export const metadata: Metadata = {
  title: "LIAS - 결재 시스템",
  description: "LIAS 결재 시스템",
};

export default function LayoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        <AuthProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
