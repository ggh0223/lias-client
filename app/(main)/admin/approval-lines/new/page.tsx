import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import NewApprovalLineClient from "./new-approval-line-client";

export default async function NewApprovalLinePage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  return <NewApprovalLineClient token={token} />;
}
