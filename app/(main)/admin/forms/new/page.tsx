import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import NewFormClient from "./new-form-client";

export default async function NewFormPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const templates = await apiClient.getApprovalLineTemplates(token);
    return (
      <NewFormClient
        initialTemplates={Array.isArray(templates) ? templates : []}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching approval line templates:", error);
    return <NewFormClient initialTemplates={[]} token={token} />;
  }
}
