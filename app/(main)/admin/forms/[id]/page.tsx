import { getToken } from "@/lib/auth-server";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";
import FormDetailClient from "./form-detail-client";

export default async function FormDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const form = await apiClient.getForm(token, params.id);

    // 현재 버전 정보도 가져오기
    let currentVersion = null;
    if (form.currentVersionId) {
      currentVersion = await apiClient.getFormVersion(
        token,
        params.id,
        form.currentVersionId
      );
    }

    return (
      <FormDetailClient
        form={form}
        currentVersion={currentVersion}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching form:", error);
    redirect("/admin/forms");
  }
}
