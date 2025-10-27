import { getToken, getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { DocumentProvider } from "@/contexts/document-context";
import { ApprovalProcessProvider } from "@/contexts/approval-process-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  const user = await getUser();

  if (!token || !user) {
    redirect("/login");
  }

  return (
    <DocumentProvider>
      <ApprovalProcessProvider>
        <MainLayout user={user}>{children}</MainLayout>
      </ApprovalProcessProvider>
    </DocumentProvider>
  );
}
