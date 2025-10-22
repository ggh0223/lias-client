import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import NewVersionClient from "./new-version-client";

export default async function NewVersionPage({
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

    // 현재 버전의 정보도 가져오기
    let currentVersion = null;
    if (template.currentVersionId) {
      try {
        currentVersion = await apiClient.getApprovalLineTemplateVersion(
          token,
          params.id,
          template.currentVersionId
        );
      } catch (err) {
        console.error("Error fetching current version:", err);
      }
    }

    return (
      <NewVersionClient
        template={template}
        currentVersion={currentVersion}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching template:", error);
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">템플릿을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }
}
