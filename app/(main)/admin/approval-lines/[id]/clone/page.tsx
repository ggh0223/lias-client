import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import CloneApprovalLineClient from "./clone-approval-line-client";

export default async function CloneApprovalLinePage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const template = await apiClient.getApprovalLineTemplate(token, params.id);

    // 현재 버전 정보도 가져오기
    let currentVersion = null;
    if (template.currentVersionId) {
      currentVersion = await apiClient.getApprovalLineTemplateVersion(
        token,
        params.id,
        template.currentVersionId
      );
    }

    return (
      <CloneApprovalLineClient
        originalTemplate={template}
        originalVersion={currentVersion}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching approval line template:", error);
    redirect("/admin/approval-lines");
  }
}
