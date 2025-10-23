import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import DocumentDetailClient from "./document-detail-client";
import { notFound } from "next/navigation";

export default async function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const document = await apiClient.getDocument(token, params.id);

    return <DocumentDetailClient document={document} token={token} />;
  } catch (error) {
    console.error("Error fetching document:", error);
    notFound();
  }
}
