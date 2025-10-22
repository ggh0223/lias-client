"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type {
  ApprovalLineTemplate,
  ApprovalLineTemplateVersion,
} from "@/types/api";

interface NewVersionClientProps {
  template: ApprovalLineTemplate;
  currentVersion: ApprovalLineTemplateVersion | null;
  token: string;
}

interface Step {
  stepOrder: number;
  stepType: string;
  assigneeRule: string;
  targetDepartmentId?: string;
  targetPositionId?: string;
  targetEmployeeId?: string;
  isRequired: boolean;
}

export default function NewVersionClient({
  template,
  currentVersion,
  token,
}: NewVersionClientProps) {
  const router = useRouter();
  const [versionNote, setVersionNote] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    {
      stepOrder: 1,
      stepType: "APPROVAL",
      assigneeRule: "DRAFTER_SUPERIOR",
      isRequired: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 기존 버전의 단계 정보를 초기값으로 설정
  useEffect(() => {
    if (currentVersion && currentVersion.steps) {
      const initialSteps = currentVersion.steps.map((step) => ({
        stepOrder: step.stepOrder,
        stepType: step.stepType,
        assigneeRule: step.assigneeRule,
        targetDepartmentId: step.targetDepartmentId,
        targetPositionId: step.targetPositionId,
        targetEmployeeId: step.defaultApproverId,
        isRequired: step.required,
      }));
      setSteps(initialSteps);
    }
  }, [currentVersion]);

  const stepTypes = [
    { value: "AGREEMENT", label: "협의" },
    { value: "APPROVAL", label: "결재" },
    { value: "IMPLEMENTATION", label: "시행" },
    { value: "REFERENCE", label: "참조" },
  ];

  const assigneeRules = [
    { value: "FIXED", label: "고정 담당자" },
    { value: "DRAFTER", label: "기안자" },
    { value: "DRAFTER_SUPERIOR", label: "기안자 상급자" },
  ];

  const handleAddStep = () => {
    const newStepOrder = steps.length + 1;
    setSteps([
      ...steps,
      {
        stepOrder: newStepOrder,
        stepType: "APPROVAL",
        assigneeRule: "DRAFTER_SUPERIOR",
        isRequired: true,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // 단계 순서 재정렬
    newSteps.forEach((step, i) => {
      step.stepOrder = i + 1;
    });
    setSteps(newSteps);
  };

  const handleStepChange = (
    index: number,
    field: keyof Step,
    value: unknown
  ) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (steps.length === 0) {
      setError("최소 1개 이상의 결재 단계가 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createApprovalLineTemplateVersion(token, template.id, {
        versionNote,
        steps,
      });

      router.push(`/admin/approval-lines/${template.id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "결재선 템플릿 버전 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          결재선 템플릿 새 버전 생성
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          &quot;{template.name}&quot; 템플릿의 새 버전을 생성합니다.
        </p>
      </div>

      {/* 템플릿 정보 */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">템플릿 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">템플릿명:</span>
            <span className="ml-2 font-medium text-gray-900">
              {template.name}
            </span>
          </div>
          <div>
            <span className="text-gray-500">유형:</span>
            <span className="ml-2 font-medium text-gray-900">
              {template.type}
            </span>
          </div>
          <div>
            <span className="text-gray-500">조직 범위:</span>
            <span className="ml-2 font-medium text-gray-900">
              {template.orgScope}
            </span>
          </div>
          <div>
            <span className="text-gray-500">상태:</span>
            <span className="ml-2 font-medium text-gray-900">
              {template.status}
            </span>
          </div>
          {currentVersion && (
            <div>
              <span className="text-gray-500">현재 버전:</span>
              <span className="ml-2 font-medium text-gray-900">
                v{currentVersion.versionNo}
              </span>
            </div>
          )}
        </div>
        {currentVersion && currentVersion.steps && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              ℹ️ 아래 단계들은 현재 버전(v{currentVersion.versionNo})의 단계를
              기반으로 초기화되었습니다. 필요에 따라 수정하세요.
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            버전 변경 사유
          </label>
          <textarea
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="이 버전의 변경 사유를 입력하세요"
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              결재 단계 *
            </label>
            <button
              type="button"
              onClick={handleAddStep}
              disabled={loading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              단계 추가
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    단계 {step.stepOrder}
                  </span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      disabled={loading}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      단계 유형
                    </label>
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={step.stepType}
                      onChange={(e) =>
                        handleStepChange(index, "stepType", e.target.value)
                      }
                      disabled={loading}
                    >
                      {stepTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      담당자 규칙
                    </label>
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={step.assigneeRule}
                      onChange={(e) =>
                        handleStepChange(index, "assigneeRule", e.target.value)
                      }
                      disabled={loading}
                    >
                      {assigneeRules.map((rule) => (
                        <option key={rule.value} value={rule.value}>
                          {rule.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {step.assigneeRule === "FIXED" && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        고정 담당자 ID *
                      </label>
                      <input
                        type="text"
                        required
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="직원 ID를 입력하세요"
                        value={step.targetEmployeeId || ""}
                        onChange={(e) =>
                          handleStepChange(
                            index,
                            "targetEmployeeId",
                            e.target.value
                          )
                        }
                        disabled={loading}
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox rounded border-gray-300"
                        checked={step.isRequired}
                        onChange={(e) =>
                          handleStepChange(
                            index,
                            "isRequired",
                            e.target.checked
                          )
                        }
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        필수 단계
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
