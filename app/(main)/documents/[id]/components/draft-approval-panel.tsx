"use client";

import type { PreviewStepInfo } from "@/types/approval-flow";
import ApprovalLineStepsSection from "./approval-line-steps-section";

interface DraftApprovalPanelProps {
  templateName: string;
  steps: PreviewStepInfo[];
  loading?: boolean;
}

export default function DraftApprovalPanel({
  templateName,
  steps,
  loading = false,
}: DraftApprovalPanelProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">결재선</h2>
        <p className="text-sm text-gray-500 mt-1">
          템플릿: {templateName} | 총 {steps.length}단계
        </p>
      </div>

      <ApprovalLineStepsSection steps={steps} />
    </div>
  );
}
