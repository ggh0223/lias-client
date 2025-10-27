import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import NewFormClient from "./new-form-client";

export default async function NewFormPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const templates = await apiServer.getApprovalLineTemplates(token);
    return (
      <NewFormClient
        initialTemplates={Array.isArray(templates) ? templates : []}
      />
    );
  } catch (error) {
    console.error("Error fetching approval line templates:", error);
    return <NewFormClient initialTemplates={[]} />;
  }
}
