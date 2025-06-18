"use client";

import { useState, useEffect } from "react";
import type { ApprovalLine, CreateApprovalLineData } from "../types/approval";
import ApprovalLineModal from "../components/approval/ApprovalLineModal";
import { approvalLineApi } from "../api/document";

export default function ApprovalLinesPage() {
  const [approvalLines, setApprovalLines] = useState<ApprovalLine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<ApprovalLine | undefined>();

  useEffect(() => {
    fetchApprovalLines();
  }, []);

  const fetchApprovalLines = async () => {
    try {
      const response = await approvalLineApi.getList();
      setApprovalLines(response.data);
    } catch (error) {
      console.error("결재선 목록 조회 실패:", error);
    }
  };

  const handleCreateApprovalLine = async (data: CreateApprovalLineData) => {
    try {
      if (selectedLine) {
        await approvalLineApi.update(selectedLine.formApprovalLineId, data);
      } else {
        await approvalLineApi.create(data);
      }
      await fetchApprovalLines();
      setIsModalOpen(false);
      setSelectedLine(undefined);
    } catch (error) {
      console.error("결재선 생성/수정 실패:", error);
    }
  };

  const handleDeleteApprovalLine = async (id: string) => {
    if (!confirm("정말로 이 결재선을 삭제하시겠습니까?")) return;

    try {
      await approvalLineApi.delete(id);
      await fetchApprovalLines();
    } catch (error) {
      console.error("결재선 삭제 실패:", error);
    }
  };

  const openEditModal = (line: ApprovalLine) => {
    setSelectedLine(line);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">결재선 관리</h1>
        <button
          onClick={() => {
            setSelectedLine(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          결재선 생성
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvalLines.map((line) => (
          <div
            key={line.formApprovalLineId}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{line.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(line)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  수정
                </button>
                <button
                  onClick={() =>
                    handleDeleteApprovalLine(line.formApprovalLineId)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">{line.description}</p>
            <div className="text-sm">
              <span className="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
                {line.type === "COMMON" ? "공통" : "개인화"}
              </span>
              <span className="text-gray-500">
                {line.formApprovalSteps.length}단계
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">결재 단계</h4>
              <div className="space-y-2">
                {line.formApprovalSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm bg-gray-50 p-2 rounded"
                  >
                    <span className="mr-2">{step.order}.</span>
                    <span className="font-medium">
                      {step.type === "APPROVAL" && "결재"}
                      {step.type === "AGREEMENT" && "합의"}
                      {step.type === "EXECUTION" && "실행"}
                      {step.type === "REFERENCE" && "참조"}
                    </span>
                    <span className="mx-2">-</span>
                    <span className="text-gray-600">
                      {step.approverType === "USER" && "사용자"}
                      {step.approverType === "DEPARTMENT_POSITION" &&
                        "부서/직책"}
                      {step.approverType === "POSITION" && "직책"}
                      {step.approverType === "TITLE" && "직위"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ApprovalLineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLine(undefined);
        }}
        onSubmit={handleCreateApprovalLine}
        initialData={selectedLine}
      />
    </div>
  );
}
