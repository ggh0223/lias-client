"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { ApprovalLineTemplate } from "@/types/api";

interface NewFormClientProps {
  initialTemplates: ApprovalLineTemplate[];
  token: string;
}

export default function NewFormClient({
  initialTemplates,
  token,
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
      // 결재선 템플릿이 선택된 경우
      if (selectedTemplate) {
        const approvalTemplate = initialTemplates.find(
          (t) => t.id === selectedTemplate
        );
        if (!approvalTemplate?.currentVersionId) {
          throw new Error("템플릿 버전을 찾을 수 없습니다.");
        }

        await apiClient.createFormWithApprovalLine(token, {
          formName,
          formCode,
          description,
          template,
          useExistingLine: true,
          lineTemplateVersionId: approvalTemplate.currentVersionId,
        });
      } else {
        // 결재선 템플릿이 선택되지 않은 경우 (문서 제출 시 자동 생성)
        await apiClient.createFormWithApprovalLine(token, {
          formName,
          formCode,
          description,
          template,
          // useExistingLine: undefined (결재선 없이 생성)
        });
      }

      router.push("/admin/forms");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "문서양식 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">문서양식 생성</h1>
        <p className="mt-1 text-sm text-gray-500">
          새로운 문서양식을 생성합니다. 결재선은 선택사항이며, 선택하지 않으면
          문서 제출 시 자동으로 생성됩니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            양식명 *
          </label>
          <input
            type="text"
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: 지출결의서"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            양식 코드 *
          </label>
          <input
            type="text"
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: EXPENSE_FORM"
            value={formCode}
            onChange={(e) => setFormCode(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="양식에 대한 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문서양식 템플릿 (HTML)
          </label>
          <textarea
            rows={8}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="예: <h1>휴가 신청서</h1><p>신청 내용: </p>"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            문서 작성 시 기본으로 표시될 HTML 템플릿을 입력하세요. 빈 채로 두면
            빈 템플릿으로 생성됩니다.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            결재선 템플릿 (선택사항)
          </label>
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            disabled={loading}
          >
            <option value="">결재선 없음 (문서 제출 시 자동 생성)</option>
            {initialTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.type})
              </option>
            ))}
          </select>
          {selectedTemplate ? (
            <p className="mt-1 text-sm text-gray-500">
              선택한 결재선 템플릿이 문서양식에 연결됩니다.
            </p>
          ) : (
            <p className="mt-1 text-sm text-blue-600">
              💡 결재선을 선택하지 않으면 문서 제출 시 기안자의 부서 계층에 따라
              자동으로 결재선이 생성됩니다.
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "생성 중..." : "생성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
