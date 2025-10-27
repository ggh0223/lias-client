"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import type { Document } from "@/types/document";
import type { StepSnapshot } from "@/types/approval-process";
import type { PreviewStepInfo } from "@/types/approval-flow";
import DocumentInfoSection from "./sections/document-info-section";
import DocumentContentSection from "./sections/document-content-section";
import SubmittedApprovalPanel from "./components/submitted-approval-panel";
import EditableApprovalPanel from "./components/editable-approval-panel";

interface DocumentDetailClientProps {
  document: Document;
  token: string;
}

export default function DocumentDetailClient({
  document,
  token,
}: DocumentDetailClientProps) {
  const router = useRouter();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 결재선 미리보기 (DRAFT 상태일 때)
  const [approvalLinePreview, setApprovalLinePreview] = useState<{
    templateName: string;
    steps: PreviewStepInfo[];
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // 수정된 결재선 정보
  const [customApprovalSteps, setCustomApprovalSteps] = useState<
    Array<{
      stepOrder: number;
      stepType: string;
      isRequired: boolean;
      employeeId?: string;
      departmentId?: string;
      assigneeRule: string;
    }>
  >([]);

  // 실제 결재 단계 데이터 (PENDING/APPROVED/REJECTED 상태일 때)
  const [approvalSteps, setApprovalSteps] = useState<StepSnapshot[]>([]);

  // 문서 상태에 따라 결재선 데이터 로드
  useEffect(() => {
    const loadApprovalData = async () => {
      if (document.status === "DRAFT") {
        // DRAFT 상태: 결재선 미리보기 로드
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
        } finally {
          setLoadingPreview(false);
        }
      } else {
        // PENDING/APPROVED/REJECTED 상태: 실제 결재 단계 데이터 로드
        try {
          const response = await apiClient.getDocumentSteps(token, document.id);
          setApprovalSteps(response.steps);
        } catch (err) {
          console.error("결재 단계 데이터 로드 실패:", err);
        }
      }
    };

    loadApprovalData();
  }, [
    document.status,
    document.formId,
    document.formVersionId,
    document.id,
    token,
  ]);

  const handleCancelApproval = async () => {
    if (!cancelReason.trim()) {
      setError("취소 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: API 클라이언트에 cancelApproval 메서드 추가 필요
      await fetch(`/api/approval-process/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: document.id,
          reason: cancelReason,
        }),
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
        draftContext: {},
        customApprovalSteps:
          customApprovalSteps.length > 0 ? customApprovalSteps : undefined,
      });
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "문서 제출에 실패했습니다."
      );
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
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(() => {
                const statusMap: Record<string, string> = {
                  DRAFT: "bg-gray-100 text-gray-800",
                  PENDING: "bg-yellow-100 text-yellow-800",
                  APPROVED: "bg-green-100 text-green-800",
                  REJECTED: "bg-red-100 text-red-800",
                  CANCELLED: "bg-gray-100 text-gray-800",
                  IMPLEMENTED: "bg-blue-100 text-blue-800",
                };
                return (
                  statusMap[document.status] || "bg-gray-100 text-gray-800"
                );
              })()}`}
            >
              {(() => {
                const statusLabels: Record<string, string> = {
                  DRAFT: "임시저장",
                  PENDING: "결재대기",
                  APPROVED: "승인완료",
                  REJECTED: "반려",
                  CANCELLED: "취소",
                  IMPLEMENTED: "시행완료",
                };
                return statusLabels[document.status] || document.status;
              })()}
            </span>
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
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "제출 중..." : "제출"}
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

      {/* Document Info Section */}
      <DocumentInfoSection document={document} />

      {/* Document Content Section */}
      {document.content && (
        <DocumentContentSection content={document.content} />
      )}

      {/* Approval Steps - DRAFT 상태 (수정 가능) */}
      {document.status === "DRAFT" && !loadingPreview && (
        <EditableApprovalPanel
          templateName={approvalLinePreview?.templateName || ""}
          initialSteps={approvalLinePreview?.steps || []}
          loading={loadingPreview}
          onApprovalStepsChange={setCustomApprovalSteps}
        />
      )}

      {/* Approval Steps - DRAFT 로딩 중 */}
      {document.status === "DRAFT" && loadingPreview && (
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
      )}

      {/* Approval Steps - 제출 후 상태 */}
      {document.status !== "DRAFT" &&
        approvalSteps.length > 0 &&
        !loadingPreview && <SubmittedApprovalPanel steps={approvalSteps} />}

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
    </div>
  );
}
