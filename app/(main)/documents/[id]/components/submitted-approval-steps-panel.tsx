"use client";

import type { StepSnapshot } from "@/types/approval-process";

interface SubmittedApprovalStepsPanelProps {
  steps: StepSnapshot[];
}

export default function SubmittedApprovalStepsPanel({
  steps,
}: SubmittedApprovalStepsPanelProps) {
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "대기", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "승인", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-800" },
    };

    const badge = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
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
                    className={`w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center text-xs ${
                      step
                        ? step.status === "APPROVED"
                          ? "border-green-500 bg-green-50"
                          : step.status === "REJECTED"
                          ? "border-red-500 bg-red-50"
                          : step.status === "CANCELLED"
                          ? "border-gray-300 bg-gray-50"
                          : "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {step ? (
                      <>
                        <div className="text-xs font-medium text-center px-1 leading-tight">
                          {step.approverName || "미지정"}
                        </div>
                        {getStatusBadge(step.status)}
                      </>
                    ) : (
                      ""
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
                    className={`w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center text-xs ${
                      step
                        ? step.status === "APPROVED"
                          ? "border-green-500 bg-green-50"
                          : step.status === "REJECTED"
                          ? "border-red-500 bg-red-50"
                          : step.status === "CANCELLED"
                          ? "border-gray-300 bg-gray-50"
                          : "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {step ? (
                      <>
                        <div className="text-xs font-medium text-center px-1 leading-tight">
                          {step.approverName || "미지정"}
                        </div>
                        {getStatusBadge(step.status)}
                      </>
                    ) : (
                      ""
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  {getStepTypeBadge(step.stepType)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {step.approverName || "미지정"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {step.approverDepartmentName} •{" "}
                      {step.approverPositionTitle}
                    </div>
                    {step.comment && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.comment}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(step.status)}
                  {step.isRequired && (
                    <span className="text-xs text-red-500">*필수</span>
                  )}
                </div>
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  {getStepTypeBadge(step.stepType)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {step.approverName || "미지정"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {step.approverDepartmentName} •{" "}
                      {step.approverPositionTitle}
                    </div>
                    {step.comment && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.comment}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(step.status)}
                  {step.isRequired && (
                    <span className="text-xs text-red-500">*필수</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
