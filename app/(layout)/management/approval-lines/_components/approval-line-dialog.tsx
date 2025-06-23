"use client";

import { useState, useEffect } from "react";
import {
  FormApprovalLine,
  CreateFormApprovalLineRequest,
  UpdateFormApprovalLineRequest,
  ApprovalStepType,
} from "../../../_lib/api/document-api";

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
}

export const ApprovalLineDialog = ({
  isOpen,
  onClose,
  onSubmit,
  approvalLine,
  mode,
}: ApprovalLineDialogProps) => {
  const [formData, setFormData] = useState<CreateFormApprovalLineRequest>({
    name: "",
    description: "",
    type: "COMMON",
    formApprovalSteps: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (mode === "edit" && approvalLine) {
      setFormData({
        name: approvalLine.name,
        description: approvalLine.description,
        type: approvalLine.type,
        formApprovalSteps: approvalLine.formApprovalSteps.map((step) => ({
          type: step.type,
          order: step.order,
          defaultApproverId: step.defaultApprover.employeeId,
        })),
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
      setError("최소 하나의 결재 단계를 추가해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === "edit" && approvalLine) {
        const updateData: UpdateFormApprovalLineRequest = {
          ...formData,
          formApprovalLineId: approvalLine.formApprovalLineId,
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
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

  const addApprovalStep = () => {
    const newStep: ApprovalStep = {
      type: "APPROVAL",
      order: formData.formApprovalSteps.length + 1,
      defaultApproverId: "",
    };

    setFormData((prev) => ({
      ...prev,
      formApprovalSteps: [...prev.formApprovalSteps, newStep],
    }));
  };

  const removeApprovalStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      formApprovalSteps: prev.formApprovalSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    }));
  };

  const updateApprovalStep = (
    index: number,
    field: keyof ApprovalStep,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      formApprovalSteps: prev.formApprovalSteps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  };

  if (!isOpen) return null;

  return (
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

          {/* 결재 단계 정보 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-primary">결재 단계</h3>
              <button
                type="button"
                onClick={addApprovalStep}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                단계 추가
              </button>
            </div>

            {formData.formApprovalSteps.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <p>결재 단계를 추가해주세요.</p>
              </div>
            )}

            {formData.formApprovalSteps.map((step, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary">{index + 1}단계</h4>
                  <button
                    type="button"
                    onClick={() => removeApprovalStep(index)}
                    className="text-danger hover:text-danger/80 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      단계 타입
                    </label>
                    <select
                      value={step.type}
                      onChange={(e) =>
                        updateApprovalStep(
                          index,
                          "type",
                          e.target.value as ApprovalStepType
                        )
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="APPROVAL">결재</option>
                      <option value="AGREEMENT">합의</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      단계 순서
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={step.order}
                      onChange={(e) =>
                        updateApprovalStep(
                          index,
                          "order",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      기본 결재자 ID
                    </label>
                    <input
                      type="text"
                      value={step.defaultApproverId}
                      onChange={(e) =>
                        updateApprovalStep(
                          index,
                          "defaultApproverId",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="결재자 ID를 입력하세요"
                    />
                  </div>
                </div>
              </div>
            ))}
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
  );
};
