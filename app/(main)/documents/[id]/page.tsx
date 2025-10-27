import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
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
    const document = await apiServer.getDocumentById(token, params.id);

    return <DocumentDetailClient document={document} token={token} />;
  } catch (error) {
    console.error("Error fetching document:", error);
    notFound();
  }
}
