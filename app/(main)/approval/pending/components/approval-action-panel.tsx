/**
 * Approval Action Panel - 결재 처리 패널
 */

import type { StepSnapshot } from "@/types/approval-process";

interface ApprovalActionPanelProps {
  selectedApproval: StepSnapshot | null;
  comment: string;
  onCommentChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  getStepTypeLabel: (type: string) => string;
  getStepTypeColor: (type: string) => string;
  onApprove: () => void;
  onReject?: () => void;
}

export default function ApprovalActionPanel({
  selectedApproval,
  comment,
  onCommentChange,
  loading,
  error,
  getStepTypeLabel,
  getStepTypeColor,
  onApprove,
  onReject,
}: ApprovalActionPanelProps) {
  if (!selectedApproval) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          결재 건을 선택하세요
        </h3>
        <p className="text-sm text-gray-500">
          왼쪽 목록에서 처리할 결재 건을 클릭하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">결재 처리</h3>
        <p className="text-sm text-gray-500">
          {selectedApproval.documentTitle || "문서"}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">결재 유형</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStepTypeColor(
                selectedApproval.stepType
              )}`}
            >
              {getStepTypeLabel(selectedApproval.stepType)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">단계</span>
            <span className="text-sm text-gray-900">
              {selectedApproval.stepOrder}단계
            </span>
          </div>
          {selectedApproval.approverName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">결재자</span>
              <span className="text-sm text-gray-900">
                {selectedApproval.approverName}
                {selectedApproval.approverDepartmentName &&
                  ` (${selectedApproval.approverDepartmentName})`}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            의견 {selectedApproval.stepType === "APPROVAL" && "(필수)"}
          </label>
          <textarea
            id="comment"
            rows={4}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder={
              selectedApproval.stepType === "APPROVAL"
                ? "승인 또는 반려 의견을 입력하세요"
                : "의견을 입력하세요 (선택사항)"
            }
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          {selectedApproval.stepType === "APPROVAL" && onReject ? (
            <>
              <button
                onClick={onApprove}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{loading ? "처리 중..." : "승인"}</span>
              </button>
              <button
                onClick={onReject}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>{loading ? "처리 중..." : "반려"}</span>
              </button>
            </>
          ) : (
            <button
              onClick={onApprove}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{loading ? "처리 중..." : "완료 처리"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
