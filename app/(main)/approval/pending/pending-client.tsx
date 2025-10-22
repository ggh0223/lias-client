"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import type { ApprovalStep } from "@/types/api";

interface PendingApprovalsClientProps {
  initialApprovals: ApprovalStep[];
  token: string;
}

export default function PendingApprovalsClient({
  initialApprovals,
  token,
}: PendingApprovalsClientProps) {
  const router = useRouter();
  const [approvals] = useState(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalStep | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStepTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      AGREEMENT: "협의",
      APPROVAL: "결재",
      IMPLEMENTATION: "시행",
      REFERENCE: "참조",
    };
    return labels[type] || type;
  };

  const getStepTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      AGREEMENT: "bg-purple-100 text-purple-800",
      APPROVAL: "bg-blue-100 text-blue-800",
      IMPLEMENTATION: "bg-green-100 text-green-800",
      REFERENCE: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "대기", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "승인", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      COMPLETED: { label: "완료", className: "bg-blue-100 text-blue-800" },
    };

    const badge = statusMap[status] || {
      label: status,
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

  const handleApprove = async () => {
    if (!selectedApproval) return;

    setLoading(true);
    setError("");

    try {
      if (selectedApproval.stepType === "AGREEMENT") {
        await apiClient.completeAgreement(token, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      } else if (selectedApproval.stepType === "APPROVAL") {
        await apiClient.approveStep(token, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      } else if (selectedApproval.stepType === "IMPLEMENTATION") {
        await apiClient.completeImplementation(token, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      }

      // 성공 시 목록 새로고침
      setSelectedApproval(null);
      setComment("");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !comment.trim()) {
      setError("반려 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.rejectStep(token, {
        stepSnapshotId: selectedApproval.id,
        comment,
      });

      // 성공 시 목록 새로고침
      setSelectedApproval(null);
      setComment("");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "반려 처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">결재 대기 목록</h1>
          <p className="mt-1 text-sm text-gray-500">
            나에게 할당된 결재 대기 건을 확인하고 처리하세요.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">총</span>
          <span className="text-2xl font-bold text-blue-600">
            {approvals.length}
          </span>
          <span className="text-sm text-gray-500">건</span>
        </div>
      </div>

      {approvals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 결재 대기 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className={`bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedApproval?.id === approval.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedApproval(approval)}
              >
                {/* 문서 정보 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {approval.documentTitle || "제목 없음"}
                      </h3>
                      {approval.documentNumber && (
                        <span className="text-xs text-gray-500 font-mono">
                          #{approval.documentNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {approval.drafterName && (
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>
                            {approval.drafterName}
                            {approval.drafterDepartmentName &&
                              ` (${approval.drafterDepartmentName})`}
                          </span>
                        </div>
                      )}
                      {approval.submittedAt && (
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {new Date(approval.submittedAt).toLocaleString(
                              "ko-KR",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {approval.documentId && (
                    <Link
                      href={`/documents/${approval.documentId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      상세보기 →
                    </Link>
                  )}
                </div>

                {/* 결재 단계 정보 */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStepTypeColor(
                          approval.stepType
                        )}`}
                      >
                        {getStepTypeLabel(approval.stepType)} - 단계{" "}
                        {approval.stepOrder}
                      </span>
                      {approval.isRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          필수
                        </span>
                      )}
                      {getStatusBadge(approval.status)}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg
                        className="w-4 h-4"
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
                      <span>
                        {approval.approverName}
                        {approval.approverPositionTitle &&
                          ` · ${approval.approverPositionTitle}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 결재 처리 패널 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              {selectedApproval ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      결재 처리
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedApproval.documentTitle || "문서"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          결재 유형
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStepTypeColor(
                            selectedApproval.stepType
                          )}`}
                        >
                          {getStepTypeLabel(selectedApproval.stepType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          단계
                        </span>
                        <span className="text-sm text-gray-900">
                          {selectedApproval.stepOrder}단계
                        </span>
                      </div>
                      {selectedApproval.approverName && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            결재자
                          </span>
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
                        의견{" "}
                        {selectedApproval.stepType === "APPROVAL" && "(필수)"}
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
                        onChange={(e) => setComment(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-3 border border-red-200">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {selectedApproval.stepType === "APPROVAL" ? (
                        <>
                          <button
                            onClick={handleApprove}
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
                            onClick={handleReject}
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
                          onClick={handleApprove}
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-10 w-10 text-green-600"
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
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              결재 대기 건이 없습니다
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              모든 결재를 완료했습니다!
            </p>
            <Link
              href="/documents/my"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              내 문서 보기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
