import { getToken } from "@/lib/auth-server";
import { apiServer } from "@/lib/api-server";
import { redirect } from "next/navigation";
import FormEditClient from "./form-edit-client";

export default async function FormEditPage({
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
    const templates = await apiServer.getApprovalLineTemplates(token);

    // 현재 버전 정보 조회 (결재선 정보 포함)
    let currentVersion = null;
    if (form.currentVersionId) {
      try {
        currentVersion = await apiServer.getFormVersion(
          token,
          params.id,
          form.currentVersionId
        );
      } catch (err) {
        console.error("Error fetching current version:", err);
      }
    }

    return (
      <FormEditClient
        form={form}
        currentVersion={currentVersion}
        templates={templates}
        token={token}
      />
    );
  } catch (error) {
    console.error("Error fetching form:", error);
    redirect("/admin/forms");
  }
}
