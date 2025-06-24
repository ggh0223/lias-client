"use client";

import { useState, useEffect } from "react";
import {
  FormApprovalLine,
  CreateFormApprovalLineRequest,
  UpdateFormApprovalLineRequest,
  ApprovalStepType,
} from "../../../_lib/api/document-api";
import { EmployeeSelectorModal } from "../../../_components/employee-selector-modal";
import { Employee } from "../../../_lib/api/metadata-api";

interface ApprovalLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateFormApprovalLineRequest | UpdateFormApprovalLineRequest
  ) => Promise<void>;
  approvalLine?: FormApprovalLine | null;
  mode: "create" | "edit";
}

interface ApprovalStep {
  type: ApprovalStepType;
  order: number;
  defaultApproverId: string;
  defaultApprover?: {
    employeeId: string;
    name: string;
    employeeNumber: string;
    department: string;
    position: string;
    rank: string;
  };
}

export const ApprovalLineDialog = ({
  isOpen,
  onClose,
  onSubmit,
  approvalLine,
  mode,
}: ApprovalLineDialogProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: "COMMON" | "CUSTOM";
    formApprovalSteps: ApprovalStep[];
  }>({
    name: "",
    description: "",
    type: "COMMON",
    formApprovalSteps: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeSelectorOpen, setEmployeeSelectorOpen] = useState(false);
  const [addingApproverType, setAddingApproverType] =
    useState<ApprovalStepType | null>(null);

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (mode === "edit" && approvalLine) {
      setFormData({
        name: approvalLine.name,
        description: approvalLine.description,
        type: approvalLine.type,
        formApprovalSteps: approvalLine.formApprovalSteps
          .map((step) => ({
            type: step.type,
            order: step.order,
            defaultApproverId: step.defaultApprover.employeeId,
            defaultApprover: step.defaultApprover,
          }))
          .sort((a, b) => a.order - b.order),
      });
    } else {
      // 생성 모드일 때 폼 초기화
      setFormData({
        name: "",
        description: "",
        type: "COMMON",
        formApprovalSteps: [],
      });
    }
  }, [mode, approvalLine, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("결재선 이름을 입력해주세요.");
      return;
    }

    if (formData.formApprovalSteps.length === 0) {
      setError("최소 하나의 결재자를 추가해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API 요청용 데이터로 변환
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        formApprovalSteps: formData.formApprovalSteps.map((step) => ({
          type: step.type,
          order: step.order,
          defaultApproverId: step.defaultApproverId,
        })),
      };

      if (mode === "edit" && approvalLine) {
        const updateData: UpdateFormApprovalLineRequest = {
          ...apiData,
          formApprovalLineId: approvalLine.formApprovalLineId,
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(apiData as CreateFormApprovalLineRequest);
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addApprover = (type: ApprovalStepType) => {
    setAddingApproverType(type);
    setEmployeeSelectorOpen(true);
  };

  const removeApprover = (index: number) => {
    setFormData((prev) => {
      const removedStep = prev.formApprovalSteps[index];
      const remainingSteps = prev.formApprovalSteps.filter(
        (_, i) => i !== index
      );

      // 삭제된 단계와 같은 타입의 단계들만 재정렬
      const reorderedSteps = remainingSteps.map((step) => {
        if (step.type === removedStep.type) {
          const sameTypeSteps = remainingSteps.filter(
            (s) => s.type === step.type
          );
          const newOrder = sameTypeSteps.findIndex((s) => s === step) + 1;
          return { ...step, order: newOrder };
        }
        return step;
      });

      return {
        ...prev,
        formApprovalSteps: reorderedSteps,
      };
    });
  };

  const handleEmployeeSelect = (selectedEmployees: Employee[]) => {
    if (addingApproverType && selectedEmployees.length > 0) {
      // 새로운 결재자들을 추가
      const newSteps: ApprovalStep[] = selectedEmployees.map(
        (employee, index) => {
          // 결재자와 합의자별로 현재 단계 수 계산
          const currentSteps = formData.formApprovalSteps.filter(
            (step) => step.type === addingApproverType
          );
          const nextOrder = currentSteps.length + index + 1;

          return {
            type: addingApproverType,
            order: nextOrder,
            defaultApproverId: employee.employeeId,
            defaultApprover: {
              employeeId: employee.employeeId,
              name: employee.name,
              employeeNumber: employee.employeeNumber,
              department: employee.department,
              position: employee.position,
              rank: employee.rank,
            },
          };
        }
      );

      setFormData((prev) => ({
        ...prev,
        formApprovalSteps: [...prev.formApprovalSteps, ...newSteps],
      }));
    }
    setEmployeeSelectorOpen(false);
    setAddingApproverType(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-surface rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">
              {mode === "create" ? "결재선 생성" : "결재선 수정"}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            {/* 결재선 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">기본 정보</h3>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  결재선 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="결재선 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="결재선에 대한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  결재선 타입
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    handleInputChange(
                      "type",
                      e.target.value as "COMMON" | "CUSTOM"
                    )
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="COMMON">공통</option>
                  <option value="CUSTOM">개인화</option>
                </select>
              </div>
            </div>

            {/* 결재자 목록 */}
            <div className="space-y-6">
              {/* 결재자 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary">
                    결재자 목록
                  </h3>
                  <button
                    type="button"
                    onClick={() => addApprover("APPROVAL")}
                    className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    결재자 추가
                  </button>
                </div>

                {formData.formApprovalSteps.filter(
                  (step) => step.type === "APPROVAL"
                ).length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    결재자를 추가해주세요.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {formData.formApprovalSteps
                      .filter((step) => step.type === "APPROVAL")
                      .map((step) => {
                        const originalIndex =
                          formData.formApprovalSteps.findIndex(
                            (s) => s === step
                          );
                        return (
                          <div
                            key={originalIndex}
                            className="relative min-w-[158px] border-2 border-primary/20 rounded-lg bg-primary/5"
                          >
                            {/* 단계 표시 */}
                            {/* <div className="absolute -top-2 -left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                              {step.order}단계
                            </div> */}

                            {/* 삭제 버튼 */}
                            <button
                              type="button"
                              onClick={() => removeApprover(originalIndex)}
                              className="absolute -top-2 -right-2 bg-danger text-white text-xs w-5 h-5 rounded-full hover:bg-danger/80 transition-colors flex items-center justify-center"
                            >
                              ×
                            </button>

                            <div className="p-4">
                              {/* 결재자 정보 */}
                              {step.defaultApprover && step.defaultApprover ? (
                                <div className="space-y-2">
                                  <div
                                    key={step.defaultApprover.employeeId}
                                    className="text-center"
                                  >
                                    <div className="font-medium text-primary text-sm">
                                      {step.defaultApprover.name}
                                    </div>
                                    <div className="text-secondary text-xs">
                                      {step.defaultApprover.position}
                                    </div>
                                    <div className="text-secondary/70 text-xs">
                                      {step.defaultApprover.department}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-secondary text-sm py-4">
                                  결재자 미지정
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* 합의자 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary">
                    합의자 목록
                  </h3>
                  <button
                    type="button"
                    onClick={() => addApprover("AGREEMENT")}
                    className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-success/90 transition-colors"
                  >
                    합의자 추가
                  </button>
                </div>

                {formData.formApprovalSteps.filter(
                  (step) => step.type === "AGREEMENT"
                ).length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    합의자를 추가해주세요.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {formData.formApprovalSteps
                      .filter((step) => step.type === "AGREEMENT")
                      .map((step) => {
                        const originalIndex =
                          formData.formApprovalSteps.findIndex(
                            (s) => s === step
                          );
                        return (
                          <div
                            key={originalIndex}
                            className="relative min-w-[158px] border-2 border-secondary/20 rounded-lg bg-success/5"
                          >
                            {/* 단계 표시 */}
                            {/* <div className="absolute -top-2 -left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                              {step.order}단계
                            </div> */}

                            {/* 삭제 버튼 */}
                            <button
                              type="button"
                              onClick={() => removeApprover(originalIndex)}
                              className="absolute -top-2 -right-2 bg-danger text-white text-xs w-5 h-5 rounded-full hover:bg-danger/80 transition-colors flex items-center justify-center"
                            >
                              ×
                            </button>

                            <div className="p-4 pt-6">
                              {/* 합의자 정보 */}
                              {step.defaultApprover && step.defaultApprover ? (
                                <div className="space-y-2">
                                  <div
                                    key={step.defaultApprover.employeeId}
                                    className="text-center"
                                  >
                                    <div className="font-medium text-secondary text-sm">
                                      {step.defaultApprover.name}
                                    </div>
                                    <div className="text-secondary text-xs">
                                      {step.defaultApprover.position}
                                    </div>
                                    <div className="text-secondary/70 text-xs">
                                      {step.defaultApprover.department}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-secondary text-sm py-4">
                                  합의자 미지정
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-secondary hover:text-primary transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "처리 중..." : mode === "create" ? "생성" : "수정"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 직원 선택 모달 */}
      <EmployeeSelectorModal
        isOpen={employeeSelectorOpen}
        onClose={() => {
          setEmployeeSelectorOpen(false);
          setAddingApproverType(null);
        }}
        onSelect={handleEmployeeSelect}
        title="결재자 선택"
        multiple={true}
      />
    </>
  );
};
