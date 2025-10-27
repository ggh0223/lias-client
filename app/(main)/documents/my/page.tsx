import { getToken } from "@/lib/auth-server";
import { documentService } from "@/services/document.service";
import MyDocumentsClient from "./my-documents-client";

export default async function MyDocumentsPage() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const documents = await documentService.fetchMyDocuments(token);

    return <MyDocumentsClient initialDocuments={documents} token={token} />;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return <MyDocumentsClient initialDocuments={[]} token={token} />;
  }
}
