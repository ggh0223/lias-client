import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import FormDetailClient from "./form-detail-client";
import type { FormVersionDetail } from "@/types/approval-flow";

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
    const form = await apiServer.getFormById(token, params.id);

    // 현재 버전 정보도 가져오기
    let currentVersion: FormVersionDetail | null = null;
    if (form.currentVersionId) {
      const version = await apiServer.getFormVersion(
        token,
        params.id,
        form.currentVersionId
      );
      currentVersion = version as FormVersionDetail;
    }

    return (
      <FormDetailClient
        form={form}
        currentVersion={currentVersion}
      />
    );
  } catch (error) {
    console.error("Error fetching form:", error);
    redirect("/admin/forms");
  }
}
