"use client";

import { useState } from "react";
import { useApprovalLines } from "./_hooks/use-approval-lines";
import { ApprovalLineTable } from "./_components/approval-line-table";
import { ApprovalLineDialog } from "./_components/approval-line-dialog";
import { ApprovalLineDetailDialog } from "./_components/approval-line-detail-dialog";
import {
  FormApprovalLine,
  CreateFormApprovalLineRequest,
  UpdateFormApprovalLineRequest,
} from "../../_lib/api/document-api";

export default function ApprovalLinesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApprovalLine, setSelectedApprovalLine] =
    useState<FormApprovalLine | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");

  const {
    approvalLines,
    paginationMeta,
    currentType,
    loading,
    createApprovalLine,
    updateApprovalLine,
    deleteApprovalLine,
    handlePageChange,
    handleTypeChange,
    // handleSearch,
  } = useApprovalLines();

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    const type = tab === "common" ? "COMMON" : "CUSTOM";
    handleTypeChange(type);
  };

  // 검색어 변경 핸들러
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);
  //   handleSearch(value);
  // };

  const handleCreate = async (
    data: CreateFormApprovalLineRequest | UpdateFormApprovalLineRequest
  ) => {
    try {
      if ("formApprovalLineId" in data) {
        // UpdateFormApprovalLineRequest인 경우
        await updateApprovalLine(data.formApprovalLineId, data);
      } else {
        // CreateFormApprovalLineRequest인 경우
        await createApprovalLine(data);
      }
      setIsCreateModalOpen(false);
    } catch {
      // 에러는 다이얼로그에서 처리됨
    }
  };

  const handleEdit = async (
    data: CreateFormApprovalLineRequest | UpdateFormApprovalLineRequest
  ) => {
    try {
      if ("formApprovalLineId" in data) {
        await updateApprovalLine(data.formApprovalLineId, data);
        setIsEditModalOpen(false);
        setSelectedApprovalLine(null);
      }
    } catch {
      // 에러는 다이얼로그에서 처리됨
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 결재선을 삭제하시겠습니까?")) {
      try {
        await deleteApprovalLine(id);
      } catch {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEditClick = (approvalLine: FormApprovalLine) => {
    setSelectedApprovalLine(approvalLine);
    setIsEditModalOpen(true);
  };

  // 검색어가 있을 때는 페이지네이션을 숨기고 필터링된 결과만 표시
  // const shouldShowPagination = !searchTerm.trim();

  // 페이지네이션 렌더링
  const renderPagination = () => {
    // !shouldShowPagination ||
    if (!paginationMeta) return null;

    const { total, page, limit, hasNext } = paginationMeta;
    const totalPages = Math.ceil(total / limit);
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-secondary">
          총 {total}개 중 {(page - 1) * limit + 1}-
          {Math.min(page * limit, total)}개 표시
        </div>
        <div className="flex items-center space-x-2">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-border rounded hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>

          {/* 페이지 번호들 */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-surface transition-colors"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 text-secondary">...</span>
              )}
            </>
          )}

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 text-sm border rounded transition-colors ${
                pageNum === page
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:bg-surface"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-secondary">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-surface transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* 다음 페이지 버튼 */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
            className="px-3 py-1 text-sm border border-border rounded hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">결재선 관리</h1>
          <p className="text-secondary mt-1">결재선을 생성하고 관리하세요</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          결재선 생성
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange("personal")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentType === "CUSTOM"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary hover:border-border"
            }`}
          >
            내 결재선
          </button>
          <button
            onClick={() => handleTabChange("common")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentType === "COMMON"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary hover:border-border"
            }`}
          >
            공통 결재선
          </button>
        </nav>
      </div>

      {/* 검색 및 필터 */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="결재선 이름으로 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="text-sm text-secondary flex items-center">
          {searchTerm.trim()
            ? `검색 결과: ${approvalLines.length}개의 결재선`
            : `총 ${paginationMeta?.total || 0}개의 결재선`}
        </div>
      </div> */}

      {/* 결재선 목록 */}
      <ApprovalLineTable
        approvalLines={approvalLines}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* 페이지네이션 */}
      {renderPagination()}

      {/* 결재선 생성 다이얼로그 */}
      <ApprovalLineDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* 결재선 수정 다이얼로그 */}
      <ApprovalLineDialog
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedApprovalLine(null);
        }}
        onSubmit={handleEdit}
        approvalLine={selectedApprovalLine}
        mode="edit"
      />

      {/* 결재선 상세 보기 다이얼로그 */}
      <ApprovalLineDetailDialog
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApprovalLine(null);
        }}
        approvalLine={selectedApprovalLine}
      />
    </div>
  );
}
