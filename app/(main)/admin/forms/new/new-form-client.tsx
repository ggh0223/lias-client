"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type { ApprovalLineTemplate } from "@/types/approval-flow";
import FormBasicInfoSection from "./sections/form-basic-info-section";
import FormTemplateSection from "./sections/form-template-section";
import FormApprovalLineSection from "./sections/form-approval-line-section";
import FormSubmitWidget from "./widgets/form-submit-widget";

interface NewFormClientProps {
  initialTemplates: ApprovalLineTemplate[];
}

export default function NewFormClient({
  initialTemplates,
}: NewFormClientProps) {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formName || !formCode) {
      setError("양식명과 코드는 필수입니다.");
      return;
    }

    setLoading(true);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        setError("인증 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 결재선 템플릿이 선택된 경우
      if (selectedTemplate) {
        const approvalTemplate = initialTemplates.find(
          (t) => t.id === selectedTemplate
        );
        if (!approvalTemplate?.currentVersionId) {
          throw new Error("템플릿 버전을 찾을 수 없습니다.");
        }

        await apiClient.createForm(token, {
          formName,
          formCode,
          description,
          template,
          useExistingLine: true,
          lineTemplateVersionId: approvalTemplate.currentVersionId,
        });
      } else {
        // 결재선 템플릿이 선택되지 않은 경우 (문서 제출 시 자동 생성)
        await apiClient.createForm(token, {
          formName,
          formCode,
          description,
          template,
        });
      }

      router.push("/admin/forms");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "문서템플릿 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">문서템플릿 생성</h1>
        <p className="mt-1 text-sm text-gray-500">
          새로운 문서템플릿을 생성합니다. 결재선은 선택사항이며, 선택하지 않으면
          문서 제출 시 자동으로 생성됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormBasicInfoSection
          formName={formName}
          onFormNameChange={setFormName}
          formCode={formCode}
          onFormCodeChange={setFormCode}
          description={description}
          onDescriptionChange={setDescription}
          loading={loading}
        />

        <FormTemplateSection
          template={template}
          onTemplateChange={setTemplate}
          loading={loading}
        />

        <FormApprovalLineSection
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          templates={initialTemplates}
          loading={loading}
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <FormSubmitWidget loading={loading} onCancel={() => router.back()} />
      </form>
    </div>
  );
}
