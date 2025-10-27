"use client";

import type { StepSnapshot } from "@/types/approval-process";
import SubmittedApprovalStepsPanel from "./submitted-approval-steps-panel";

interface SubmittedApprovalPanelProps {
  steps: StepSnapshot[];
}

export default function SubmittedApprovalPanel({
  steps,
}: SubmittedApprovalPanelProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">결재 이력</h2>
        <p className="text-sm text-gray-500 mt-1">
          총 {steps.length}단계 | 제출 후 수정 불가
        </p>
      </div>

      <SubmittedApprovalStepsPanel steps={steps} />
    </div>
  );
}
