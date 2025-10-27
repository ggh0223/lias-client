"use client";

import type { TemplateVersionDetail } from "@/types/approval-flow";
import StepSlotsDisplay from "./step-slots-display";
import StepListDisplay from "./step-list-display";

interface StepsPanelProps {
  currentVersion: TemplateVersionDetail;
}

export default function StepsPanel({ currentVersion }: StepsPanelProps) {
  if (!currentVersion.steps || currentVersion.steps.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-gray-500">등록된 결재 단계가 없습니다.</p>
      </div>
    );
  }

  // 단계 타입별로 분류
  const agreementSteps = currentVersion.steps.filter(
    (s) => s.stepType === "AGREEMENT"
  );
  const approvalSteps = currentVersion.steps.filter(
    (s) => s.stepType === "APPROVAL"
  );
  const implementationSteps = currentVersion.steps.filter(
    (s) => s.stepType === "IMPLEMENTATION"
  );
  const referenceSteps = currentVersion.steps.filter(
    (s) => s.stepType === "REFERENCE"
  );

  return (
    <div className="px-6 py-5 space-y-6">
      {currentVersion.changeReason && (
        <div>
          <dt className="text-sm font-medium text-gray-500">변경 사유</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {currentVersion.changeReason}
          </dd>
        </div>
      )}

      {/* 합의 및 결재는 5칸 그리드 */}
      {agreementSteps.length > 0 && (
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-3">합의</dt>
          <dd>
            <StepSlotsDisplay
              steps={agreementSteps}
              itemClassName="border-blue-500 bg-blue-50 text-blue-700"
            />
          </dd>
        </div>
      )}

      {approvalSteps.length > 0 && (
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-3">결재</dt>
          <dd>
            <StepSlotsDisplay
              steps={approvalSteps}
              itemClassName="border-green-500 bg-green-50 text-green-700"
            />
          </dd>
        </div>
      )}

      {/* 시행 및 참조는 리스트 */}
      {implementationSteps.length > 0 && (
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-3">시행</dt>
          <dd>
            <StepListDisplay
              steps={implementationSteps}
              emptyMessage="시행자 없음"
            />
          </dd>
        </div>
      )}

      {referenceSteps.length > 0 && (
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-3">참조</dt>
          <dd>
            <StepListDisplay
              steps={referenceSteps}
              emptyMessage="참조자 없음"
            />
          </dd>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <dt className="text-sm font-medium text-gray-500">생성일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(currentVersion.createdAt).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">수정일</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(currentVersion.createdAt).toLocaleString()}
          </dd>
        </div>
      </div>
    </div>
  );
}
