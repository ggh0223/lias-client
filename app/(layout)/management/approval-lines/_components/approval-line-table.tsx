"use client";

import { FormApprovalLine } from "../../../_lib/api/document-api";

interface ApprovalLineTableProps {
  approvalLines: FormApprovalLine[];
  // onView: (approvalLine: FormApprovalLine) => void;
  onEdit: (approvalLine: FormApprovalLine) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ApprovalLineTable = ({
  approvalLines,
  // onView,
  onEdit,
  onDelete,
  loading = false,
}: ApprovalLineTableProps) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
        </div>
        <div className="p-6 text-center text-secondary">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          로딩 중...
        </div>
      </div>
    );
  }

  if (approvalLines.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
        </div>
        <div className="p-12 text-center text-secondary">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">결재선이 없습니다</p>
          <p className="text-sm">새로운 결재선을 생성해보세요.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">결재선 목록</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                결재선명
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                설명
              </th>
              <th className="w-1/3 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                결재단계
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                생성일
              </th>
              <th className="w-1/12 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {approvalLines.map((approvalLine) => (
              <tr
                key={approvalLine.formApprovalLineId}
                className="hover:bg-surface/50"
              >
                <td className="w-1/12 px-4 py-2">
                  <div className="text-sm font-medium text-primary truncate">
                    {approvalLine.name}
                  </div>
                </td>
                <td className="w-1/12 px-3 py-2">
                  <div className="text-sm text-secondary truncate">
                    {approvalLine.description || "-"}
                  </div>
                </td>
                <td className="w-1/3 px-3 py-2">
                  <div className="space-y-2">
                    {/* 결재 단계 */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        결재
                      </span>
                      {approvalLine.formApprovalSteps
                        .filter((step) => step.type === "APPROVAL")
                        .sort((a, b) => a.order - b.order)
                        .map((step) => (
                          <span
                            key={step.formApprovalStepId}
                            className="text-xs bg-primary/5 text-primary px-2 py-1 rounded border border-primary/20"
                          >
                            {step.defaultApprover?.name || "미지정"}
                          </span>
                        ))}
                    </div>

                    {/* 합의 단계 */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
                        합의
                      </span>
                      {approvalLine.formApprovalSteps
                        .filter((step) => step.type === "AGREEMENT")
                        .sort((a, b) => a.order - b.order)
                        .map((step) => (
                          <span
                            key={step.formApprovalStepId}
                            className="text-xs bg-secondary/5 text-secondary px-2 py-1 rounded border border-secondary/20"
                          >
                            {step.defaultApprover?.name || "미지정"}
                          </span>
                        ))}
                    </div>
                  </div>
                </td>
                <td className="w-1/12 px-3 py-2">
                  <div className="text-sm text-secondary">
                    {formatDate(approvalLine.createdAt)}
                  </div>
                </td>
                <td className="w-1/12 px-3 py-2 text-sm font-medium">
                  <button
                    onClick={() => onEdit(approvalLine)}
                    className="text-secondary hover:text-primary mr-3 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(approvalLine.formApprovalLineId)}
                    className="text-danger hover:text-danger/80 transition-colors"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
