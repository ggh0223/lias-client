"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApprovalResponseDto } from "../../_lib/api/approval-api";
import { DocumentStatusBadge } from "./document-status-badge";
import { useDeleteApprovalDocument } from "../../_hooks/use-approval-documents";

interface DocumentTableProps {
  documents: ApprovalResponseDto[];
  loading: boolean;
  onRefresh: () => void;
}

export const DocumentTable = ({
  documents,
  loading,
  onRefresh,
}: DocumentTableProps) => {
  const router = useRouter();
  const { deleteDocument, loading: deleteLoading } =
    useDeleteApprovalDocument();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // documents가 undefined일 때 빈 배열로 처리
  const safeDocuments = documents || [];

  const handleViewDocument = (id: string) => {
    router.push(`/approval/draft/${id}`);
  };

  const handleEditDocument = (id: string) => {
    router.push(`/approval/draft/${id}/edit`);
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("정말로 이 문서를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDocument(id);
      onRefresh();
    } catch (error) {
      console.error("문서 삭제 실패:", error);
      alert("문서 삭제에 실패했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">기안 문서 목록</h2>
        </div>
        <div className="p-6 text-center text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (safeDocuments.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">기안 문서 목록</h2>
        </div>
        <div className="p-6 text-center text-secondary">
          작성된 문서가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">기안 문서 목록</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                문서 번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                양식
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                기안일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {safeDocuments.map((document) => (
              <tr key={document.documentId} className="hover:bg-surface/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {document.documentNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-primary">
                      {document.title}
                    </div>
                    <div className="text-sm text-secondary">
                      {document.content.length > 50
                        ? `${document.content.substring(0, 50)}...`
                        : document.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {document.documentType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DocumentStatusBadge status={document.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {formatDate(document.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDocument(document.documentId)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    보기
                  </button>
                  {document.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleEditDocument(document.documentId)}
                        className="text-secondary hover:text-primary mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDocument(document.documentId)
                        }
                        disabled={
                          deleteLoading && deletingId === document.documentId
                        }
                        className="text-danger hover:text-danger/80 disabled:opacity-50"
                      >
                        {deleteLoading && deletingId === document.documentId
                          ? "삭제 중..."
                          : "삭제"}
                      </button>
                    </>
                  )}
                  {document.status === "REJECTED" && (
                    <button
                      onClick={() => handleEditDocument(document.documentId)}
                      className="text-secondary hover:text-primary"
                    >
                      재상신
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
