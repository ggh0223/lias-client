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
  const [activeTab, setActiveTab] = useState("common");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApprovalLine, setSelectedApprovalLine] =
    useState<FormApprovalLine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    loading,
    createApprovalLine,
    updateApprovalLine,
    deleteApprovalLine,
    getCommonApprovalLines,
    getCustomApprovalLines,
  } = useApprovalLines();

  // 현재 탭에 따른 결재선 목록 필터링
  const getCurrentApprovalLines = () => {
    const lines =
      activeTab === "common"
        ? getCommonApprovalLines()
        : getCustomApprovalLines();

    // 검색어 필터링
    if (searchTerm.trim()) {
      return lines.filter(
        (line) =>
          line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          line.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return lines;
  };

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

  const handleView = (approvalLine: FormApprovalLine) => {
    setSelectedApprovalLine(approvalLine);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (approvalLine: FormApprovalLine) => {
    setSelectedApprovalLine(approvalLine);
    setIsEditModalOpen(true);
  };

  const currentApprovalLines = getCurrentApprovalLines();
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

      {/* 에러 메시지 */}
      {/* {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger">
          {error}
        </div>
      )} */}

      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("common")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "common"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary hover:border-border"
            }`}
          >
            공통 결재선
          </button>
          <button
            onClick={() => setActiveTab("personal")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "personal"
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary hover:border-border"
            }`}
          >
            내 결재선
          </button>
        </nav>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="결재선 이름으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="text-sm text-secondary flex items-center">
          총 {currentApprovalLines.length}개의 결재선
        </div>
      </div>

      {/* 결재선 목록 */}
      <ApprovalLineTable
        approvalLines={currentApprovalLines}
        onView={handleView}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        loading={loading}
      />

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
