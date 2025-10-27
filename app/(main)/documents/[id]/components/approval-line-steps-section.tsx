"use client";

import type { PreviewStepInfo } from "@/types/approval-flow";

interface ApprovalLineStepsSectionProps {
  steps: PreviewStepInfo[];
}

export default function ApprovalLineStepsSection({
  steps,
}: ApprovalLineStepsSectionProps) {
  const getStepTypeBadge = (stepType: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      AGREEMENT: {
        label: "합의",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVAL: { label: "결재", className: "bg-blue-100 text-blue-800" },
      IMPLEMENTATION: {
        label: "시행",
        className: "bg-purple-100 text-purple-800",
      },
      REFERENCE: { label: "참조", className: "bg-gray-100 text-gray-800" },
    };

    const badge = typeMap[stepType] || {
      label: stepType,
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

  const getAssigneeLabel = (step: PreviewStepInfo): string => {
    return step.approverName || "미지정";
  };

  // 합의 단계
  const agreementSteps = steps.filter((s) => s.stepType === "AGREEMENT");
  const approvalSteps = steps.filter((s) => s.stepType === "APPROVAL");
  const implementationSteps = steps.filter(
    (s) => s.stepType === "IMPLEMENTATION"
  );
  const referenceSteps = steps.filter((s) => s.stepType === "REFERENCE");

  return (
    <div className="space-y-4">
      {/* 합의 */}
      {agreementSteps.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">합의</div>
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
      )}

      {/* 결재 */}
      {approvalSteps.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">결재</div>
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
      )}

      {/* 시행 */}
      {implementationSteps.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">시행</div>
          <div className="space-y-1">
            {implementationSteps.map((step, index) => (
              <div
                key={`${step.stepOrder}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {getStepTypeBadge(step.stepType)}
                  <div className="flex-1">
                    <div className="text-xs font-medium">
                      {step.approverName} ({step.approverDepartmentName})
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.approverPositionTitle}
                    </div>
                  </div>
                </div>
                {step.isRequired && (
                  <span className="text-xs text-red-500">*필수</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 참조 */}
      {referenceSteps.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">참조</div>
          <div className="space-y-1">
            {referenceSteps.map((step, index) => (
              <div
                key={`${step.stepOrder}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {getStepTypeBadge(step.stepType)}
                  <div className="flex-1">
                    <div className="text-xs font-medium">
                      {step.approverName} ({step.approverDepartmentName})
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.approverPositionTitle}
                    </div>
                  </div>
                </div>
                {step.isRequired && (
                  <span className="text-xs text-red-500">*필수</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
