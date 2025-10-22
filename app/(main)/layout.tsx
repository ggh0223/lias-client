import { getToken, getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";

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

  return <MainLayout user={user}>{children}</MainLayout>;
}
