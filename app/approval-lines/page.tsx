"use client";

import { useState, useEffect } from "react";
import { Text, Surface } from "lumir-design-system-shared";
import { Button } from "lumir-design-system-02";
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

  const getStepTypeText = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return "결재";
      case "AGREEMENT":
        return "합의";
      case "EXECUTION":
        return "실행";
      case "REFERENCE":
        return "참조";
      default:
        return type;
    }
  };

  const getApproverTypeText = (type: string) => {
    switch (type) {
      case "USER":
        return "사용자";
      case "DEPARTMENT_POSITION":
        return "부서/직책";
      case "POSITION":
        return "직책";
      case "TITLE":
        return "직위";
      default:
        return type;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* 헤더 섹션 */}
      <div className="mb-6">
        <Text
          variant="title-1"
          weight="bold"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2"
        >
          결재선 관리
        </Text>
        <Text
          variant="body-2"
          color="secondary-system01-2-rest"
          className="max-w-2xl"
        >
          문서 결재에 사용할 결재선을 생성하고 관리합니다.
        </Text>
      </div>

      {/* 액션 버튼 */}
      <div className="mb-6 flex justify-end">
        <Button
          variant="filled"
          colorScheme="primary"
          onClick={() => {
            setSelectedLine(undefined);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <span>결재선 생성</span>
          </div>
        </Button>
      </div>

      {/* 테이블 */}
      <Surface
        background="secondary-system01-inverse-rest"
        boxShadow="20"
        className="rounded-2xl overflow-hidden relative z-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-left">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    결재선명
                  </Text>
                </th>
                <th className="px-6 py-4 text-left">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    설명
                  </Text>
                </th>
                <th className="px-6 py-4 text-center">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    유형
                  </Text>
                </th>
                <th className="px-6 py-4 text-center">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    단계
                  </Text>
                </th>
                <th className="px-6 py-4 text-center">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    결재 단계
                  </Text>
                </th>
                <th className="px-6 py-4 text-center">
                  <Text
                    variant="heading-3"
                    weight="medium"
                    color="primary-system01-1-rest"
                  >
                    작업
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {approvalLines.map((line, index) => (
                <tr
                  key={line.formApprovalLineId}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-4">
                    <Text
                      variant="body-1"
                      weight="medium"
                      className="text-slate-800"
                    >
                      {line.name}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text
                      variant="body-2"
                      color="secondary-system01-2-rest"
                      className="max-w-xs truncate"
                    >
                      {line.description || "-"}
                    </Text>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        line.type === "COMMON"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {line.type === "COMMON" ? "공통" : "개인화"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Text
                      variant="body-2"
                      weight="medium"
                      className="text-slate-700"
                    >
                      {line.formApprovalSteps.length}단계
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {line.formApprovalSteps
                        .slice(0, 3)
                        .map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-center justify-center text-xs"
                          >
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xs font-medium mr-2">
                              {step.order}
                            </span>
                            <span className="text-slate-600 mr-1">
                              {getStepTypeText(step.type)}
                            </span>
                            <span className="text-slate-500">
                              ({getApproverTypeText(step.approverType)})
                            </span>
                          </div>
                        ))}
                      {line.formApprovalSteps.length > 3 && (
                        <div className="text-center">
                          <Text
                            variant="caption-1"
                            color="secondary-system01-2-rest"
                          >
                            +{line.formApprovalSteps.length - 3}단계 더
                          </Text>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="transparent"
                        colorScheme="primary"
                        onClick={() => openEditModal(line)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-sm">✏️</span>
                          <span className="text-sm">수정</span>
                        </div>
                      </Button>
                      <Button
                        variant="transparent"
                        colorScheme="secondary"
                        onClick={() =>
                          handleDeleteApprovalLine(line.formApprovalLineId)
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-sm">🗑️</span>
                          <span className="text-sm">삭제</span>
                        </div>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 상태 */}
        {approvalLines.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <Text
              variant="heading-3"
              color="secondary-system01-2-rest"
              className="mb-2"
            >
              등록된 결재선이 없습니다
            </Text>
            <Text variant="body-2" color="secondary-system01-3-rest">
              새로운 결재선을 생성해보세요
            </Text>
          </div>
        )}
      </Surface>

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
