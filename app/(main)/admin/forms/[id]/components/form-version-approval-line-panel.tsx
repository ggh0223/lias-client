"use client";

import type { ApprovalStepTemplate } from "@/types/approval-flow";

interface FormVersionApprovalLinePanelProps {
  approvalLineInfo: {
    template?: {
      id: string;
      name: string;
      type: string;
      orgScope: string;
    };
    templateVersion?: {
      id: string;
      templateId: string;
      versionNo: number;
      isActive: boolean;
      changeReason?: string;
      createdAt: Date;
    };
    steps?: ApprovalStepTemplate[];
  };
}

export default function FormVersionApprovalLinePanel({
  approvalLineInfo,
}: FormVersionApprovalLinePanelProps) {
  const getAssigneeLabel = (step: ApprovalStepTemplate): string => {
    switch (step.assigneeRule) {
      case "DRAFTER":
        return "기안자";
      case "FIXED":
        if (step.defaultApprover) {
          return `고정직원 (${step.defaultApprover.name})`;
        }
        return step.targetEmployeeId
          ? `고정직원 (${step.targetEmployeeId})`
          : "고정직원";
      case "DRAFTER_SUPERIOR":
        return "상급자";
      case "DEPARTMENT_REFERENCE":
        if (step.targetDepartment) {
          return `부서 (${step.targetDepartment.departmentName})`;
        }
        return step.targetDepartmentId
          ? `부서 (${step.targetDepartmentId})`
          : "부서";
      default:
        return step.assigneeRule;
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="mb-4">
        <dt className="text-sm font-medium text-gray-500">
          연결된 결재선 템플릿
        </dt>
        <dd className="mt-1">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900">
              {approvalLineInfo.template?.name}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
              <span>버전: v{approvalLineInfo.templateVersion?.versionNo}</span>
              <span>•</span>
              <span>유형: {approvalLineInfo.template?.type}</span>
              <span>•</span>
              <span>범위: {approvalLineInfo.template?.orgScope}</span>
            </div>
          </div>
        </dd>
      </div>

      {approvalLineInfo.steps && approvalLineInfo.steps.length > 0 && (
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-3">결재 단계</dt>
          <dd className="space-y-4">
            {/* 합의 */}
            {(() => {
              const agreementSteps = approvalLineInfo.steps.filter(
                (s) => s.stepType === "AGREEMENT"
              );
              if (agreementSteps.length === 0) return null;
              return (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    합의
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, index) => {
                      const step = agreementSteps[index];
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                              step
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-gray-50 text-gray-400"
                            }`}
                          >
                            <div className="text-xs text-center px-1 leading-tight break-words">
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
                </div>
              );
            })()}

            {/* 결재 */}
            {(() => {
              const approvalSteps = approvalLineInfo.steps.filter(
                (s) => s.stepType === "APPROVAL"
              );
              if (approvalSteps.length === 0) return null;
              return (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    결재
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, index) => {
                      const step = approvalSteps[index];
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                              step
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 bg-gray-50 text-gray-400"
                            }`}
                          >
                            <div className="text-xs text-center px-1 leading-tight break-words">
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
                </div>
              );
            })()}

            {/* 시행 */}
            {(() => {
              const implementationSteps = approvalLineInfo.steps.filter(
                (s) => s.stepType === "IMPLEMENTATION"
              );
              if (implementationSteps.length === 0) return null;
              return (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    시행
                  </div>
                  <div className="space-y-1">
                    {implementationSteps.map((step, index) => (
                      <div
                        key={step.id || `${step.stepOrder}-${index}`}
                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-medium">
                            {getAssigneeLabel(step)}
                          </div>
                          {step.description && (
                            <div className="text-xs text-gray-500">
                              {step.description}
                            </div>
                          )}
                        </div>
                        {(step.isRequired || step.required) && (
                          <span className="text-xs text-red-500">*필수</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 참조 */}
            {(() => {
              const referenceSteps = approvalLineInfo.steps.filter(
                (s) => s.stepType === "REFERENCE"
              );
              if (referenceSteps.length === 0) return null;
              return (
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    참조
                  </div>
                  <div className="space-y-1">
                    {referenceSteps.map((step, index) => (
                      <div
                        key={step.id || `${step.stepOrder}-${index}`}
                        className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="text-xs font-medium">
                            {getAssigneeLabel(step)}
                          </div>
                          {step.description && (
                            <div className="text-xs text-gray-500">
                              {step.description}
                            </div>
                          )}
                        </div>
                        {(step.isRequired || step.required) && (
                          <span className="text-xs text-red-500">*필수</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </dd>
        </div>
      )}
    </div>
  );
}
