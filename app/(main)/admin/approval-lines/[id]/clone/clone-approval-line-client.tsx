"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type {
  ApprovalLineTemplate,
  TemplateVersionDetail,
} from "@/types/approval-flow";

interface CloneApprovalLineClientProps {
  originalTemplate: ApprovalLineTemplate;
  originalVersion: TemplateVersionDetail | null;
}

export default function CloneApprovalLineClient({
  originalTemplate,
  originalVersion,
}: CloneApprovalLineClientProps) {
  const router = useRouter();
  const [templateName, setTemplateName] = useState(
    `${originalTemplate.name} (복사본)`
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!templateName) {
      setError("템플릿명은 필수입니다.");
      return;
    }

    setSaving(true);
    try {
      if (!originalVersion) {
        setError("원본 버전 정보가 없습니다.");
        return;
      }

      const token = clientAuth.getToken();
      if (!token) {
        setError("인증 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      const result = await apiClient.cloneApprovalLineTemplate(token, {
        baseTemplateVersionId: originalVersion.id,
        newTemplateName: templateName,
      });

      alert("결재선 템플릿이 성공적으로 복제되었습니다.");
      router.push(`/admin/approval-lines/${result.id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "결재선 템플릿 복제에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStepTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      APPROVAL: { label: "결재", className: "bg-blue-100 text-blue-800" },
      AGREEMENT: {
        label: "합의",
        className: "bg-yellow-100 text-yellow-800",
      },
      IMPLEMENTATION: {
        label: "시행",
        className: "bg-purple-100 text-purple-800",
      },
      REFERENCE: { label: "참조", className: "bg-gray-100 text-gray-800" },
    };

    const badge = typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">결재선 템플릿 복제</h1>
        <p className="mt-1 text-sm text-gray-500">
          기존 결재선 템플릿을 복사하여 새로운 템플릿을 생성합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white shadow rounded-lg p-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                원본 템플릿
              </label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                value={originalTemplate.name}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 템플릿명 *
              </label>
              <input
                type="text"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 간단한 2단계 결재선 (복사본)"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={saving}
              />
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
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "복제 중..." : "복제하기"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Preview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            원본 템플릿 미리보기
          </h3>

          {originalVersion && originalVersion.steps ? (
            <div className="space-y-3">
              {originalVersion.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStepTypeBadge(step.stepType)}
                        {(step.isRequired || step.required) && (
                          <span className="text-xs text-red-600">* 필수</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {step.assigneeRule === "DRAFTER"
                          ? "기안자"
                          : step.assigneeRule === "FIXED" &&
                            step.defaultApprover
                          ? `고정직원 (${step.defaultApprover.name})`
                          : step.assigneeRule === "DRAFTER_SUPERIOR"
                          ? "상급자"
                          : step.assigneeRule === "DEPARTMENT_REFERENCE" &&
                            step.targetDepartment
                          ? `부서 (${step.targetDepartment.departmentName})`
                          : step.assigneeRule}
                      </p>
                      {step.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">결재 단계 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
