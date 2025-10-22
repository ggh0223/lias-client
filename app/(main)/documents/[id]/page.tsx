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

    // 결재 단계 정보 가져오기 (있는 경우)
    let approvalSteps = null;
    if (document.approvalLineSnapshotId) {
      try {
        approvalSteps = await apiClient.getDocumentApprovalSteps(
          token,
          params.id
        );
      } catch {
        // 결재 단계가 없는 경우 무시
      }
    }

    return (
      <DocumentDetailClient
        document={document}
        approvalSteps={approvalSteps}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching document:", error);
    notFound();
  }
}
