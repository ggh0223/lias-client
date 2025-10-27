"use client";

import type { ApprovalStepTemplate } from "@/types/approval-flow";

interface StepListDisplayProps {
  steps: ApprovalStepTemplate[];
  emptyMessage: string;
}

export default function StepListDisplay({
  steps,
  emptyMessage,
}: StepListDisplayProps) {
  const getAssigneeLabel = (step: ApprovalStepTemplate): string => {
    switch (step.assigneeRule) {
      case "DRAFTER":
        return "기안자";
      case "FIXED":
        // API 응답에 defaultApprover 정보가 있으면 직원명 표시
        if (step.defaultApprover) {
          return `고정직원 (${step.defaultApprover.name})`;
        }
        // 없으면 직원 ID만 표시
        return step.targetEmployeeId
          ? `고정직원 (${step.targetEmployeeId})`
          : "고정직원";
      case "DRAFTER_SUPERIOR":
        return "상급자";
      case "DEPARTMENT_REFERENCE":
        // API 응답에 targetDepartment 정보가 있으면 부서명 표시
        if (step.targetDepartment) {
          return `부서 (${step.targetDepartment.departmentName})`;
        }
        // 없으면 부서 ID만 표시
        return step.targetDepartmentId
          ? `부서 (${step.targetDepartmentId})`
          : "부서";
      default:
        return step.assigneeRule;
    }
  };

  const getRuleDetailLabel = (step: ApprovalStepTemplate): string => {
    // 설명이 있으면 표시
    if (step.description) {
      return step.description;
    }
    return step.assigneeRule;
  };

  if (steps.length === 0) {
    return (
      <div className="text-sm text-gray-600 p-2 rounded border-2 border-transparent">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {steps.map((step, index) => (
        <div
          key={`${step.stepOrder || index}`}
          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
        >
          <div className="flex-1">
            <div className="text-sm font-medium">{getAssigneeLabel(step)}</div>
            <div className="text-xs text-gray-500">
              {getRuleDetailLabel(step)}
            </div>
          </div>
          {step.isRequired && (
            <span className="text-xs text-red-500">*필수</span>
          )}
        </div>
      ))}
    </div>
  );
}
