"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import SubmitDocumentModal from "@/components/document/submit-document-modal";
import type { Document, ApprovalStep } from "@/types/api";

interface ApprovalStepPreview {
  stepOrder: number;
  stepType: string;
  isRequired: boolean;
  employeeId: string;
  employeeName: string;
  departmentName?: string;
  positionTitle?: string;
  assigneeRule: string;
}

interface DocumentDetailClientProps {
  document: Document;
  approvalSteps: ApprovalStep[] | null;
  token: string;
}

export default function DocumentDetailClient({
  document,
  approvalSteps,
  token,
}: DocumentDetailClientProps) {
  const router = useRouter();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 결재선 미리보기 (DRAFT 상태일 때)
  const [approvalLinePreview, setApprovalLinePreview] = useState<{
    templateName: string;
    steps: ApprovalStepPreview[];
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // DRAFT 상태일 때 결재선 미리보기 로드
  useEffect(() => {
    const loadPreview = async () => {
      if (document.status !== "DRAFT") return;

      setLoadingPreview(true);
      try {
        const preview = await apiClient.previewApprovalLine(
          token,
          document.formId,
          {
            formVersionId: document.formVersionId,
          }
        );

        setApprovalLinePreview({
          templateName: preview.templateName,
          steps: preview.steps,
        });
      } catch (err) {
        console.error("결재선 미리보기 로드 실패:", err);
        // 미리보기 실패는 에러로 표시하지 않음
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPreview();
  }, [document.status, document.formId, document.formVersionId, token]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DRAFT: { label: "임시저장", className: "bg-gray-100 text-gray-800" },
      PENDING: {
        label: "결재대기",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "승인완료", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-800" },
      IMPLEMENTED: {
        label: "시행완료",
        className: "bg-blue-100 text-blue-800",
      },
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

  const handleCancelApproval = async () => {
    if (!cancelReason.trim()) {
      setError("취소 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.cancelApproval(token, {
        documentId: document.id,
        reason: cancelReason,
      });

      setShowCancelModal(false);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "결재 취소에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("문서를 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      await apiClient.deleteDocument(token, document.id);
      router.push("/documents/my");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "문서 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.submitDocument(token, document.id, {
        draftContext: {}, // 모든 필드가 optional이므로 빈 객체 전달
      });
      router.refresh();
    } catch (err: unknown) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {document.title}
            </h1>
            {getStatusBadge(document.status)}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            문서번호: {document.documentNumber || "-"} | 작성일:{" "}
            {new Date(document.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          {document.status === "DRAFT" && (
            <>
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                제출
              </button>
              <Link
                href={`/documents/${document.id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                삭제
              </button>
            </>
          )}
          {document.status === "PENDING" && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              결재 취소
            </button>
          )}
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">문서 정보</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">양식 버전 ID</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {document.formVersionId}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">상태</dt>
            <dd className="mt-1">{getStatusBadge(document.status)}</dd>
          </div>
          {document.submittedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">제출일</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(document.submittedAt).toLocaleString()}
              </dd>
            </div>
          )}
          {document.cancelReason && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">취소 사유</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {document.cancelReason}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Document Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">문서 내용</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: document.content }}
        />
      </div>

      {/* Approval Steps - Enhanced Timeline */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          {document.status === "DRAFT" ? "예상 결재선" : "결재 현황"}
        </h2>

        {/* DRAFT 상태: 결재선 미리보기 */}
        {document.status === "DRAFT" && (
          <>
            {loadingPreview ? (
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
            ) : approvalLinePreview ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {approvalLinePreview.templateName}
                      </p>
                      <p className="text-xs text-blue-700">
                        문서를 제출하면 이 결재선으로 상신됩니다
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {approvalLinePreview.steps.map((step, index) => {
                    const stepTypeLabel =
                      step.stepType === "AGREEMENT"
                        ? "협의"
                        : step.stepType === "APPROVAL"
                        ? "결재"
                        : step.stepType === "IMPLEMENTATION"
                        ? "시행"
                        : step.stepType === "REFERENCE"
                        ? "참조"
                        : step.stepType;

                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-sm font-semibold text-gray-700">
                            {step.stepOrder}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                step.stepType === "AGREEMENT"
                                  ? "bg-purple-100 text-purple-800"
                                  : step.stepType === "APPROVAL"
                                  ? "bg-blue-100 text-blue-800"
                                  : step.stepType === "IMPLEMENTATION"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {stepTypeLabel}
                            </span>
                            {step.isRequired && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {step.employeeName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {step.departmentName && `${step.departmentName} `}
                            {step.positionTitle && `· ${step.positionTitle}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">
                  결재선을 불러올 수 없습니다
                </p>
              </div>
            )}
          </>
        )}

        {/* 제출된 상태: 실제 결재 현황 */}
        {document.status !== "DRAFT" &&
        approvalSteps &&
        approvalSteps.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {approvalSteps.map((step, index) => {
                const isCompleted =
                  step.status === "APPROVED" || step.status === "COMPLETED";
                const isRejected = step.status === "REJECTED";
                const isPending = step.status === "PENDING";
                const isInProgress =
                  isPending &&
                  (index === 0 ||
                    approvalSteps[index - 1]?.status === "APPROVED" ||
                    approvalSteps[index - 1]?.status === "COMPLETED");

                const stepTypeLabel =
                  step.stepType === "AGREEMENT"
                    ? "협의"
                    : step.stepType === "APPROVAL"
                    ? "결재"
                    : step.stepType === "IMPLEMENTATION"
                    ? "시행"
                    : step.stepType === "REFERENCE"
                    ? "참조"
                    : step.stepType;

                return (
                  <div
                    key={step.id}
                    className="relative flex items-start space-x-4 pl-11"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 flex items-center justify-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm ${
                          isCompleted
                            ? "bg-green-100 border-green-500 text-green-700"
                            : isRejected
                            ? "bg-red-100 border-red-500 text-red-700"
                            : isInProgress
                            ? "bg-blue-100 border-blue-500 text-blue-700 ring-4 ring-blue-100"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : isRejected ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 p-4 rounded-lg border ${
                        isInProgress
                          ? "bg-blue-50 border-blue-200"
                          : isCompleted
                          ? "bg-green-50 border-green-200"
                          : isRejected
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              step.stepType === "AGREEMENT"
                                ? "bg-purple-100 text-purple-800"
                                : step.stepType === "APPROVAL"
                                ? "bg-blue-100 text-blue-800"
                                : step.stepType === "IMPLEMENTATION"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {stepTypeLabel}
                          </span>
                          {step.isRequired && (
                            <span className="text-red-500 text-xs font-medium">
                              필수
                            </span>
                          )}
                        </div>
                        {getStatusBadge(step.status)}
                      </div>

                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {step.approverName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {step.approverDepartmentName}
                          {step.approverPositionTitle &&
                            ` · ${step.approverPositionTitle}`}
                        </p>
                      </div>

                      {step.comment && (
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">의견</p>
                          <p className="text-sm text-gray-900">
                            {step.comment}
                          </p>
                        </div>
                      )}

                      {(step.approvedAt ||
                        step.rejectedAt ||
                        step.completedAt) && (
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(
                            (step.approvedAt ||
                              step.rejectedAt ||
                              step.completedAt) as string
                          ).toLocaleString()}
                        </p>
                      )}

                      {isInProgress && (
                        <div className="mt-3 flex items-center space-x-2">
                          <div className="flex-shrink-0">
                            <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <p className="text-xs font-medium text-blue-700">
                            진행 중
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : document.status !== "DRAFT" ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-4 text-sm text-gray-500">결재 정보가 없습니다.</p>
          </div>
        ) : null}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              결재 취소
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cancelReason"
                  className="block text-sm font-medium text-gray-700"
                >
                  취소 사유 (필수)
                </label>
                <textarea
                  id="cancelReason"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="취소 사유를 입력하세요"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                    setError("");
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  닫기
                </button>
                <button
                  onClick={handleCancelApproval}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "처리 중..." : "결재 취소"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      <SubmitDocumentModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
