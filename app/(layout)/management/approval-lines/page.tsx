"use client";

import { useState } from "react";
import { useApprovalLines } from "./_hooks/use-approval-lines";
import ApprovalLineList from "./_components/approval-line-list";
import ApprovalLineDetailTabs from "./_components/approval-line-detail-tabs";
import ApprovalLineDialog from "./_components/approval-line-dialog";
import {
  createFormApprovalLineApi,
  updateFormApprovalLineApi,
  deleteFormApprovalLineApi,
  FormApprovalLine,
} from "../../_lib/api/document-api";

export default function ApprovalLinesPage() {
  const {
    approvalLines,
    currentType,
    refetch, // 목록 새로고침 함수가 있다면 사용
  } = useApprovalLines();

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedApprovalLine, setSelectedApprovalLine] =
    useState<FormApprovalLine | null>(null);
  const [loading, setLoading] = useState(false);

  const lines = approvalLines.map((line, idx) => ({
    id: line.formApprovalLineId,
    no: idx + 1,
    type: currentType === "COMMON" ? "공통" : "개인",
    name: line.name,
  }));

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedApprovalLine(null);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedId) return;
    setDialogMode("edit");
    setSelectedApprovalLine(
      approvalLines.find((l) => l.formApprovalLineId === selectedId) || null
    );
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedApprovalLine(null);
  };

  // 등록/수정 API 연동
  const handleDialogSubmit = async (data: {
    name: string;
    steps: Record<string, any[]>;
  }) => {
    setLoading(true);
    try {
      const formApprovalSteps = Object.entries(data.steps).flatMap(
        ([type, emps]) =>
          emps.map((emp, i) => ({
            type,
            order: i + 1,
            defaultApproverId: emp.employeeId,
          }))
      );
      if (dialogMode === "create") {
        await createFormApprovalLineApi({
          name: data.name,
          type: currentType,
          formApprovalSteps,
        });
        alert("결재라인이 등록되었습니다.");
      } else if (dialogMode === "edit" && selectedApprovalLine) {
        await updateFormApprovalLineApi(
          selectedApprovalLine.formApprovalLineId,
          {
            name: data.name,
            type: currentType,
            formApprovalSteps,
            formApprovalLineId: selectedApprovalLine.formApprovalLineId,
          }
        );
        alert("결재라인이 수정되었습니다.");
      }
      setIsDialogOpen(false);
      setSelectedApprovalLine(null);
      if (typeof refetch === "function") refetch();
    } catch (e) {
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 삭제 API 연동
  const handleDialogDelete = async () => {
    if (!selectedApprovalLine) return;
    setLoading(true);
    try {
      await deleteFormApprovalLineApi(selectedApprovalLine.formApprovalLineId);
      alert("결재라인이 삭제되었습니다.");
      setIsDialogOpen(false);
      setSelectedApprovalLine(null);
      if (typeof refetch === "function") refetch();
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen p-6 bg-white">
      {/* 상단: 경로/검색바 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-secondary">
          전자결재 &gt; 결재설정 &gt;{" "}
          <span className="text-primary font-semibold">결재라인설정</span>
        </div>
        <button className="text-xs text-blue-500">도움말</button>
      </div>

      <div className="flex flex-1 gap-4">
        {/* 좌측: 결재라인 목록 */}
        <div className="w-[320px] min-w-[260px] max-w-[400px] flex flex-col border border-border rounded-lg bg-surface">
          <ApprovalLineList
            lines={lines}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDialogDelete}
          />
        </div>

        {/* 우측: 결재라인 상세/탭 */}
        <div className="flex-1 flex flex-col border border-border rounded-lg bg-white">
          <ApprovalLineDetailTabs
            approvalLine={approvalLines.find(
              (line) => line.formApprovalLineId === selectedId
            )}
          />
        </div>
      </div>

      {/* 등록/수정 다이얼로그 */}
      <ApprovalLineDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        mode={dialogMode}
        approvalLine={selectedApprovalLine}
        onSubmit={handleDialogSubmit}
        onDelete={handleDialogDelete}
        loading={loading}
      />
    </div>
  );
}
