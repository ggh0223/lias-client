import React, { useState } from "react";
import {
  FormApprovalLine,
  FormApprovalStep,
} from "@/app/(layout)/_lib/api/document-api";

interface ApprovalLineDetailTabsProps {
  approvalLine?: FormApprovalLine;
}

const tabList = [
  { key: "APPROVAL", label: "결재" },
  { key: "AGREEMENT", label: "합의" },
  { key: "REFERENCE", label: "수신참조" },
  { key: "IMPLEMENTATION", label: "시행" },
];

const ApprovalLineDetailTabs: React.FC<ApprovalLineDetailTabsProps> = ({
  approvalLine,
}) => {
  const [tab, setTab] = useState("APPROVAL");

  // 탭별 데이터 필터링
  const steps: FormApprovalStep[] =
    approvalLine?.formApprovalSteps?.filter((step) => step.type === tab) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* 탭 */}
      <div className="flex border-b border-border">
        {tabList.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 text-sm font-semibold border-b-2 ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* 상세 테이블 */}
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-surface">
              <th className="border border-border px-2 py-1">No</th>
              <th className="border border-border px-2 py-1">결재종류</th>
              <th className="border border-border px-2 py-1">회사</th>
              <th className="border border-border px-2 py-1">부서</th>
              <th className="border border-border px-2 py-1">직책(직급)</th>
              <th className="border border-border px-2 py-1">사원명</th>
            </tr>
          </thead>
          <tbody>
            {steps.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              steps.map((step: FormApprovalStep, idx: number) => (
                <tr key={step.formApprovalStepId}>
                  <td className="border border-border text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-border text-center">
                    {step.type === "APPROVAL"
                      ? "결재"
                      : step.type === "AGREEMENT"
                      ? "합의"
                      : step.type === "IMPLEMENTATION"
                      ? "시행"
                      : "수신참조"}
                  </td>
                  <td className="border border-border text-center">-</td>
                  <td className="border border-border text-center">
                    {step.defaultApprover?.department || "-"}
                  </td>
                  <td className="border border-border text-center">
                    {step.defaultApprover?.position || "-"}
                  </td>
                  <td className="border border-border text-center">
                    {step.defaultApprover?.name || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalLineDetailTabs;
