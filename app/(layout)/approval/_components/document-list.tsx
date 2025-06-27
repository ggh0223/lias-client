"use client";

import { useState } from "react";
import {
  useApprovalDocuments,
  DocumentListType,
  Document,
} from "../../_hooks/use-approval-documents";
import { approvalApi } from "../../_lib/api/approval-api";
import { ActionDialog } from "./action-dialog";
import { DocumentDetailModal } from "./document-detail-modal";

interface DocumentListProps {
  listType: DocumentListType;
  title: string;
}

export function DocumentList({ listType, title }: DocumentListProps) {
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: string;
    documentId: string;
    documentTitle: string;
  }>({
    isOpen: false,
    type: "",
    documentId: "",
    documentTitle: "",
  });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    document: Document | null;
  }>({ open: false, document: null });

  const { data, loading, error, refetch } = useApprovalDocuments({
    listType,
    page,
    limit: 10,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAction = (
    type: string,
    documentId: string,
    documentTitle: string
  ) => {
    setDialogState({
      isOpen: true,
      type,
      documentId,
      documentTitle,
    });
  };

  const handleRowClick = (document: Document) => {
    setDetailModal({ open: true, document });
  };

  const handleActionSubmit = async () => {
    if (!dialogState.documentId) return;

    setActionLoading(true);
    try {
      switch (dialogState.type) {
        case "approve":
          await approvalApi.approveDocument(dialogState.documentId);
          break;
        case "reject":
          await approvalApi.rejectDocument(dialogState.documentId);
          break;
        case "agreement":
          await approvalApi.approveDocument(dialogState.documentId);
          break;
        case "implement":
          await approvalApi.implementDocument(dialogState.documentId);
          break;
        case "reference":
          await approvalApi.referenceDocument(dialogState.documentId);
          break;
      }

      // 성공 후 목록 새로고침
      await refetch();
      setDialogState({
        isOpen: false,
        type: "",
        documentId: "",
        documentTitle: "",
      });
    } catch (error) {
      console.error("액션 처리 오류:", error);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (!actionLoading) {
      setDialogState({
        isOpen: false,
        type: "",
        documentId: "",
        documentTitle: "",
      });
    }
  };

  const getDialogConfig = () => {
    const configs = {
      approve: {
        title: "결재 승인",
        message: `"${dialogState.documentTitle}" 문서를 승인하시겠습니까?`,
        confirmText: "승인",
      },
      reject: {
        title: "결재 반려",
        message: `"${dialogState.documentTitle}" 문서를 반려하시겠습니까?`,
        confirmText: "반려",
      },
      agreement: {
        title: "협의 처리",
        message: `"${dialogState.documentTitle}" 문서에 대한 협의를 완료하시겠습니까?`,
        confirmText: "협의완료",
      },
      implement: {
        title: "시행 처리",
        message: `"${dialogState.documentTitle}" 문서의 시행을 완료하시겠습니까?`,
        confirmText: "시행완료",
      },
      reference: {
        title: "열람 처리",
        message: `"${dialogState.documentTitle}" 문서를 열람하시겠습니까?`,
        confirmText: "열람",
      },
    };
    return (
      configs[dialogState.type as keyof typeof configs] || configs.reference
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "대기중", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "승인", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getStepTypeLabel = (type: string) => {
    const typeConfig = {
      AGREEMENT: "협의",
      APPROVAL: "결재",
      IMPLEMENTATION: "시행",
      REFERENCE: "참조",
    };
    return typeConfig[type as keyof typeof typeConfig] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">오류가 발생했습니다: {error}</p>
          <button
            onClick={refetch}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          새로고침
        </button>
      </div>

      {data?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">문서가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    문서분류
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    문서번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기안부서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기안자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    현재단계
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상신일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.items.map((document) => (
                  <tr
                    key={document.documentId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(document)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.documentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.documentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {document.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.drafter.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.drafter.name} ({document.drafter.position})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {document.currentStep
                        ? `${
                            document.currentStep.approver.name
                          } (${getStepTypeLabel(document.currentStep.type)})`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(document.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.createdAt)}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 수신참조함(received_reference)에서만 열람하기 버튼 노출 */}
                      {listType === "received_reference" && (
                        <button
                          onClick={() =>
                            handleAction(
                              "reference",
                              document.documentId,
                              document.title
                            )
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          열람하기
                        </button>
                      )}
                      {listType === "pending_approval" && (
                        <>
                          <button
                            onClick={() =>
                              handleAction(
                                "approve",
                                document.documentId,
                                document.title
                              )
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            승인
                          </button>
                          <button
                            onClick={() =>
                              handleAction(
                                "reject",
                                document.documentId,
                                document.title
                              )
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            반려
                          </button>
                        </>
                      )}
                      {listType === "pending_agreement" && (
                        <button
                          onClick={() =>
                            handleAction(
                              "agreement",
                              document.documentId,
                              document.title
                            )
                          }
                          className="text-orange-600 hover:text-orange-900"
                        >
                          협의하기
                        </button>
                      )}
                      {listType === "implementation" && (
                        <button
                          onClick={() =>
                            handleAction(
                              "implement",
                              document.documentId,
                              document.title
                            )
                          }
                          className="text-purple-600 hover:text-purple-900"
                        >
                          시행하기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      {data?.meta && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 {data.meta.total}개 중 {(page - 1) * data.meta.limit + 1}-
            {Math.min(page * data.meta.limit, data.meta.total)} 표시
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              이전
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              {page} / {Math.ceil(data.meta.total / data.meta.limit)}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(data.meta.total / data.meta.limit)}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* 액션 확인 다이얼로그 */}
      <ActionDialog
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onSubmit={handleActionSubmit}
        loading={actionLoading}
        {...getDialogConfig()}
      />
      {/* 상세보기 모달 */}
      <DocumentDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, document: null })}
        document={detailModal.document}
      />
    </div>
  );
}
