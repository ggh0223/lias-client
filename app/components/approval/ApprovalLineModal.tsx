"use client";

import { useState } from "react";
import type {
  ApprovalLine,
  CreateApprovalLineData,
  ApprovalStepType,
  ApproverType,
} from "../../types/approval";

interface ApprovalLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApprovalLineData) => Promise<void>;
  initialData?: ApprovalLine;
}

const defaultApprovalStep = {
  type: "APPROVAL" as ApprovalStepType,
  order: 1,
  approverType: "USER" as ApproverType,
  approverValue: "",
  isMandatory: true,
};

export default function ApprovalLineModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ApprovalLineModalProps) {
  const [formData, setFormData] = useState<CreateApprovalLineData>(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "COMMON",
    formApprovalSteps: initialData?.formApprovalSteps || [defaultApprovalStep],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const addApprovalStep = () => {
    setFormData({
      ...formData,
      formApprovalSteps: [
        ...formData.formApprovalSteps,
        {
          ...defaultApprovalStep,
          order: formData.formApprovalSteps.length + 1,
        },
      ],
    });
  };

  const removeApprovalStep = (index: number) => {
    setFormData({
      ...formData,
      formApprovalSteps: formData.formApprovalSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    });
  };

  const updateApprovalStep = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      formApprovalSteps: formData.formApprovalSteps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "결재선 수정" : "결재선 생성"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              타입 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "COMMON" | "CUSTOM",
                })
              }
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="COMMON">공통</option>
              <option value="CUSTOM">개인화</option>
            </select>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">결재 단계</h3>
              <button
                type="button"
                onClick={addApprovalStep}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                단계 추가
              </button>
            </div>
            <div className="space-y-4">
              {formData.formApprovalSteps.map((step, index) => (
                <div key={index} className="border rounded p-4 relative">
                  {formData.formApprovalSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApprovalStep(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        결재 타입 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={step.type}
                        onChange={(e) =>
                          updateApprovalStep(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded"
                        required
                      >
                        <option value="APPROVAL">결재</option>
                        <option value="AGREEMENT">합의</option>
                        <option value="EXECUTION">실행</option>
                        <option value="REFERENCE">참조</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        순서 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={step.order}
                        onChange={(e) =>
                          updateApprovalStep(
                            index,
                            "order",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border rounded"
                        min={1}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        결재자 지정 방식 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={step.approverType}
                        onChange={(e) =>
                          updateApprovalStep(
                            index,
                            "approverType",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded"
                        required
                      >
                        <option value="USER">사용자</option>
                        <option value="DEPARTMENT_POSITION">부서/직책</option>
                        <option value="POSITION">직책</option>
                        <option value="TITLE">직위</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        결재자 지정 값 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={step.approverValue}
                        onChange={(e) =>
                          updateApprovalStep(
                            index,
                            "approverValue",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={step.isMandatory}
                        onChange={(e) =>
                          updateApprovalStep(
                            index,
                            "isMandatory",
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">
                        필수 결재 단계
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {initialData ? "수정" : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
