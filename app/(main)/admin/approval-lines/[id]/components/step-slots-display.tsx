"use client";

import type { ApprovalStepTemplate } from "@/types/approval-flow";

interface StepSlotsDisplayProps {
  steps: ApprovalStepTemplate[];
  itemClassName: string;
}

export default function StepSlotsDisplay({
  steps,
  itemClassName,
}: StepSlotsDisplayProps) {
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

  return (
    <div className="flex space-x-2">
      {Array.from({ length: 5 }, (_, index) => {
        const step = steps[index];

        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                step
                  ? itemClassName
                  : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
            >
              <div className="text-xs text-center px-1 leading-tight">
                {step ? getAssigneeLabel(step) : ""}
              </div>
              {step && step.isRequired && (
                <div className="text-red-500 text-xs">*</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
