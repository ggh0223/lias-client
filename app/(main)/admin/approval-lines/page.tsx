import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import ApprovalLinesListClient from "./approval-lines-list-client";

export default async function ApprovalLinesListPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const templates = await apiServer.getApprovalLineTemplates(token);
    return (
      <ApprovalLinesListClient
        initialTemplates={Array.isArray(templates) ? templates : []}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching approval line templates:", error);
    return <ApprovalLinesListClient initialTemplates={[]} token={token} />;
  }
}
