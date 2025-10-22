import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import FormsListClient from "./forms-list-client";

export default async function FormsListPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const forms = await apiClient.getForms(token);
    return (
      <FormsListClient
        initialForms={Array.isArray(forms) ? forms : []}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching forms:", error);
    return <FormsListClient initialForms={[]} token={token} />;
  }
}
