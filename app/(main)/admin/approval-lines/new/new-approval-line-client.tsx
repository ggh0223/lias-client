"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import EmployeePickerModal from "@/components/approval/employee-picker-modal";
import type { EmployeeDetail } from "@/types/api";

interface NewApprovalLineClientProps {
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
  selectedEmployee?: EmployeeDetail; // 선택된 직원 정보
}

export default function NewApprovalLineClient({
  token,
}: NewApprovalLineClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("COMMON");
  const [orgScope, setOrgScope] = useState("ALL");
  const [departmentId, setDepartmentId] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    {
      stepOrder: 1,
      stepType: "APPROVAL",
      assigneeRule: "FIXED",
      isRequired: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

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

  const templateTypes = [
    { value: "COMMON", label: "공통" },
    { value: "CUSTOM", label: "커스텀" },
  ];

  const orgScopes = [
    { value: "ALL", label: "전사 공통" },
    { value: "SPECIFIC_DEPARTMENT", label: "특정 부서 전용" },
  ];

  const handleAddStep = () => {
    const newStepOrder = steps.length + 1;
    setSteps([
      ...steps,
      {
        stepOrder: newStepOrder,
        stepType: "APPROVAL",
        assigneeRule: "FIXED",
        isRequired: true,
      },
    ]);
  };

  const handleOpenEmployeePicker = (index: number) => {
    setCurrentStepIndex(index);
    setIsEmployeePickerOpen(true);
  };

  const handleEmployeeSelect = (employee: EmployeeDetail) => {
    if (currentStepIndex !== null) {
      const newSteps = [...steps];
      newSteps[currentStepIndex] = {
        ...newSteps[currentStepIndex],
        targetEmployeeId: employee.id,
        selectedEmployee: employee,
      };
      setSteps(newSteps);
    }
    setIsEmployeePickerOpen(false);
    setCurrentStepIndex(null);
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

    if (!name) {
      setError("템플릿 이름을 입력해주세요.");
      return;
    }

    if (steps.length === 0) {
      setError("최소 1개 이상의 결재 단계가 필요합니다.");
      return;
    }

    // FIXED 규칙인 단계에 담당자가 선택되었는지 확인
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.assigneeRule === "FIXED" && !step.targetEmployeeId) {
        setError(`${i + 1}번 단계: 고정 담당자를 선택해주세요.`);
        return;
      }
      // DRAFTER와 DRAFTER_SUPERIOR는 targetEmployeeId가 필요 없음
      if (
        step.assigneeRule === "DRAFTER" ||
        step.assigneeRule === "DRAFTER_SUPERIOR"
      ) {
        // targetEmployeeId 제거 (있을 경우)
        delete step.targetEmployeeId;
        delete step.selectedEmployee;
      }
    }

    if (orgScope === "SPECIFIC_DEPARTMENT" && !departmentId) {
      setError("특정 부서 전용 템플릿인 경우 대상 부서를 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createApprovalLineTemplate(token, {
        name,
        description,
        type,
        orgScope,
        departmentId:
          orgScope === "SPECIFIC_DEPARTMENT" ? departmentId : undefined,
        steps,
      });

      router.push("/admin/approval-lines");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "결재선 템플릿 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          새로운 결재선 템플릿 생성
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          완전히 새로운 결재선 템플릿을 생성합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              템플릿 이름 *
            </label>
            <input
              type="text"
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="일반 결재선"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              템플릿 유형 *
            </label>
            <select
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
            >
              {templateTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            템플릿 설명
          </label>
          <textarea
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="결재선 템플릿 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              조직 범위 *
            </label>
            <select
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={orgScope}
              onChange={(e) => setOrgScope(e.target.value)}
              disabled={loading}
            >
              {orgScopes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {orgScope === "SPECIFIC_DEPARTMENT" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대상 부서 *
              </label>
              <input
                type="text"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="부서 ID를 입력하세요"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
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
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-2">
                        고정 담당자 *
                      </label>
                      {step.selectedEmployee ? (
                        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {step.selectedEmployee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {step.selectedEmployee.employeeNumber}
                              {step.selectedEmployee.email &&
                                ` • ${step.selectedEmployee.email}`}
                            </p>
                            {step.selectedEmployee.departments &&
                              step.selectedEmployee.departments.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {
                                    step.selectedEmployee.departments[0]
                                      .department.departmentName
                                  }
                                  {step.selectedEmployee.departments[0].position
                                    ?.positionTitle &&
                                    ` • ${step.selectedEmployee.departments[0].position.positionTitle}`}
                                </p>
                              )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEmployeePicker(index)}
                            disabled={loading}
                            className="ml-3 px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          >
                            변경
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenEmployeePicker(index)}
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span>담당자 선택</span>
                          </div>
                        </button>
                      )}
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

      {/* 직원 선택 모달 */}
      <EmployeePickerModal
        isOpen={isEmployeePickerOpen}
        onClose={() => {
          setIsEmployeePickerOpen(false);
          setCurrentStepIndex(null);
        }}
        onSelect={handleEmployeeSelect}
        token={token}
        title="결재 담당자 선택"
      />
    </div>
  );
}
