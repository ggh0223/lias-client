import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import FormsListClient from "./forms-list-client";

export default async function FormsListPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const forms = await apiServer.getForms(token);
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
