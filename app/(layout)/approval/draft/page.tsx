"use client";

import { useState, useMemo } from "react";
import { CreateDocumentAction } from "../../_components/quick-actions/create-document-action";
import { DocumentTable } from "../approval/document-table";
import { Pagination } from "../approval/pagination";
import { useApprovalDocuments } from "../../_hooks/use-approval-documents";
import { PaginationQueryDto } from "../../_lib/api/approval-api";

export default function DraftPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 필터 파라미터 구성 - useMemo로 안정적인 객체 생성
  const params: PaginationQueryDto = useMemo(() => {
    const baseParams: PaginationQueryDto = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // 상태 필터가 있으면 추가
    if (statusFilter) {
      baseParams.status = [statusFilter];
    }

    return baseParams;
  }, [currentPage, itemsPerPage, statusFilter]);

  const { documents, total, loading, error, mutate } =
    useApprovalDocuments(params);
  // 검색 필터링 (클라이언트 사이드)
  const filteredDocuments = (documents || []).filter((document) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        document.title.toLowerCase().includes(searchLower) ||
        document.documentNumber.toLowerCase().includes(searchLower) ||
        document.content.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
  // 필터 초기화
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDocumentTypeFilter("");
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">상신함</h1>
          <p className="text-secondary mt-1">내가 기안한 문서들을 확인하세요</p>
        </div>
        <CreateDocumentAction variant="button" />
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="문서 제목 또는 번호로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">전체 상태</option>
          <option value="DRAFT">작성중</option>
          <option value="PENDING">결재중</option>
          <option value="APPROVED">승인</option>
          <option value="REJECTED">반려</option>
          <option value="CANCELLED">취소</option>
        </select>
        <select
          value={documentTypeFilter}
          onChange={(e) => setDocumentTypeFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">전체 양식</option>
          <option value="휴가 신청서">휴가 신청서</option>
          <option value="구매 요청서">구매 요청서</option>
          <option value="출장 신청서">출장 신청서</option>
        </select>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 border border-border rounded-lg bg-surface text-secondary hover:bg-surface/80 transition-colors"
        >
          필터 초기화
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {/* 문서 목록 */}
      <DocumentTable
        documents={filteredDocuments}
        loading={loading}
        onRefresh={handleRefresh}
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
