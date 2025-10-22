import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { notFound, redirect } from "next/navigation";
import EditDocumentClient from "./edit-client";

export default async function EditDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const document = await apiClient.getDocument(token, params.id);

    // DRAFT 상태가 아니면 수정 불가
    if (document.status !== "DRAFT") {
      redirect(`/documents/${params.id}`);
    }

    return <EditDocumentClient document={document} token={token} />;
  } catch (error) {
    console.error("Error fetching document:", error);
    notFound();
  }
}
