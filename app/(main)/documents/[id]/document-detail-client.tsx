"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import SubmitDocumentModal from "@/components/document/submit-document-modal";
import ApprovalLineDisplay from "@/components/document/approval-line-display";
import type { Document, EmployeeDetail, ApprovalStep } from "@/types/api";

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
  token: string;
}

export default function DocumentDetailClient({
  document,
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

  // 실제 결재 단계 데이터 (PENDING/APPROVED/REJECTED 상태일 때)
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([]);

  // 결재선 수정 관련 상태
  const [isEditingApprovalLine, setIsEditingApprovalLine] = useState(false);
  const [editableSteps, setEditableSteps] = useState<ApprovalStepPreview[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(
    null
  );
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isMultiSelectModalOpen, setIsMultiSelectModalOpen] = useState(false);
  const [selectedStepType, setSelectedStepType] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeDetail[]>(
    []
  );

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
          const steps = await apiClient.getDocumentApprovalSteps(
            token,
            document.id
          );
          setApprovalSteps(steps);
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

  // 결재선 수정 관련 함수들
  const handleEditApprovalLine = () => {
    if (approvalLinePreview) {
      setEditableSteps([...approvalLinePreview.steps]);
      setIsEditingApprovalLine(true);
    }
  };

  const handleCancelEdit = () => {
    if (approvalLinePreview) {
      setEditableSteps([...approvalLinePreview.steps]);
    }
    setIsEditingApprovalLine(false);
  };

  const handleSaveApprovalLine = () => {
    setApprovalLinePreview((prev) =>
      prev
        ? {
            ...prev,
            steps: editableSteps,
          }
        : null
    );
    setIsEditingApprovalLine(false);
  };

  const handleEmployeeSelect = (employee: EmployeeDetail) => {
    if (selectedStepIndex !== null) {
      const updatedSteps = [...editableSteps];
      const departmentName =
        employee.departments?.[0]?.department?.departmentName || "";
      const positionTitle =
        employee.departments?.[0]?.position?.positionTitle || "";

      updatedSteps[selectedStepIndex] = {
        ...updatedSteps[selectedStepIndex],
        employeeId: employee.id,
        employeeName: employee.name,
        departmentName,
        positionTitle,
      };
      setEditableSteps(updatedSteps);
    }
    setIsEmployeeModalOpen(false);
    setSelectedStepIndex(null);
  };

  const handleStepClick = (
    step: ApprovalStepPreview | null,
    stepType: string,
    stepIndex: number
  ) => {
    if (isEditingApprovalLine) {
      if (step) {
        // 기존 단계 수정
        setSelectedStepIndex(stepIndex);
        setIsEmployeeModalOpen(true);
      } else {
        // 새 단계 추가 - UI 순서에 맞는 stepOrder 계산
        const newStepOrder = calculateNextStepOrder(stepType);

        const newStep: ApprovalStepPreview = {
          stepOrder: newStepOrder,
          stepType: stepType as
            | "CONSULTATION"
            | "APPROVAL"
            | "IMPLEMENTATION"
            | "REFERENCE",
          assigneeRule: "FIXED",
          employeeId: "",
          employeeName: "",
          departmentName: "",
          positionTitle: "",
          isRequired: true,
        };
        setEditableSteps([...editableSteps, newStep]);
        setSelectedStepIndex(editableSteps.length);
        setIsEmployeeModalOpen(true);
      }
    }
  };

  const handleDeleteStepClick = (step: ApprovalStepPreview) => {
    if (confirm("이 결재 단계를 삭제하시겠습니까?")) {
      const stepIndex = editableSteps.findIndex(
        (s) => s.stepType === step.stepType && s.stepOrder === step.stepOrder
      );
      if (stepIndex !== -1) {
        // 직접 삭제 로직 실행
        const stepToDelete = editableSteps[stepIndex];
        const updatedSteps = editableSteps.filter(
          (_, index) => index !== stepIndex
        );

        // 해당 타입의 단계들만 재정렬
        const reorderedSteps = updatedSteps.map((step) => {
          if (step.stepType === stepToDelete.stepType) {
            // 같은 타입의 단계들만 stepOrder 재정렬
            const sameTypeSteps = updatedSteps
              .filter((s) => s.stepType === step.stepType)
              .sort((a, b) => a.stepOrder - b.stepOrder);
            const newOrder = sameTypeSteps.indexOf(step) + 1;
            return { ...step, stepOrder: newOrder };
          }
          return step;
        });

        setEditableSteps(reorderedSteps);
      }
    }
  };

  // 시행자/참조자 다중 선택 핸들러
  const handleMultiSelectClick = (stepType: string) => {
    if (isEditingApprovalLine) {
      setSelectedStepType(stepType);

      // 기존에 선택된 직원들을 가져와서 모달에 전달
      const existingSteps = editableSteps.filter(
        (s) => s.stepType === stepType
      );

      // 임시 EmployeeDetail 객체 생성 (모달에서 실제 데이터로 교체됨)
      const existingEmployees: EmployeeDetail[] = existingSteps.map((step) => ({
        id: step.employeeId,
        name: step.employeeName,
        employeeNumber: "",
        email: "",
        departments: [],
      }));

      setSelectedEmployees(existingEmployees);
      setIsMultiSelectModalOpen(true);
    }
  };

  // 다중 선택 완료 핸들러
  const handleMultiSelectComplete = (employees: EmployeeDetail[]) => {
    // 기존 시행자/참조자 제거
    const filteredSteps = editableSteps.filter(
      (s) => s.stepType !== selectedStepType
    );

    // UI 순서에 맞는 stepOrder 계산
    const baseStepOrder = calculateNextStepOrder(selectedStepType);

    // 새로운 시행자/참조자 추가 - UI 순서에 맞는 stepOrder로 설정
    const newSteps = employees.map((employee, index) => {
      const departmentName =
        employee.departments?.[0]?.department?.departmentName || "";
      const positionTitle =
        employee.departments?.[0]?.position?.positionTitle || "";

      return {
        stepOrder: baseStepOrder + index,
        stepType: selectedStepType,
        assigneeRule: "FIXED",
        employeeId: employee.id,
        employeeName: employee.name,
        departmentName,
        positionTitle,
        isRequired: false,
      } as ApprovalStepPreview;
    });

    setEditableSteps([...filteredSteps, ...newSteps]);
    setIsMultiSelectModalOpen(false);
    setSelectedEmployees([]);
  };

  // 개별 시행자/참조자 삭제 핸들러
  const handleRemoveEmployee = (stepType: string, employeeId: string) => {
    const updatedSteps = editableSteps.filter(
      (step) => !(step.stepType === stepType && step.employeeId === employeeId)
    );
    setEditableSteps(updatedSteps);
  };

  // UI 순서에 맞는 다음 stepOrder 계산
  const calculateNextStepOrder = (stepType: string): number => {
    // UI에서 표시되는 순서: 협의 -> 결재 -> 시행 -> 참조
    const stepTypeOrder = [
      "CONSULTATION",
      "AGREEMENT",
      "APPROVAL",
      "IMPLEMENTATION",
      "REFERENCE",
    ];

    // CONSULTATION을 AGREEMENT로 변환
    const normalizedType = stepType === "CONSULTATION" ? "AGREEMENT" : stepType;

    // 현재 타입의 순서 찾기
    const currentTypeIndex = stepTypeOrder.indexOf(normalizedType);

    // 현재 타입 이전의 모든 타입들의 단계 수 계산
    let previousStepsCount = 0;
    for (let i = 0; i < currentTypeIndex; i++) {
      const type = stepTypeOrder[i];
      const typeSteps = editableSteps.filter(
        (s) =>
          (s.stepType === "CONSULTATION" ? "AGREEMENT" : s.stepType) === type
      );
      previousStepsCount += typeSteps.length;
    }

    // 현재 타입의 기존 단계 수
    const currentTypeSteps = editableSteps.filter(
      (s) =>
        (s.stepType === "CONSULTATION" ? "AGREEMENT" : s.stepType) ===
        normalizedType
    );

    // 다음 stepOrder = 이전 타입들의 단계 수 + 현재 타입의 단계 수 + 1
    return previousStepsCount + currentTypeSteps.length + 1;
  };

  // UI 순서대로 stepOrder 재조정 함수
  const reorderStepsByUI = (
    steps: ApprovalStepPreview[]
  ): ApprovalStepPreview[] => {
    // UI에서 표시되는 순서: 협의 -> 결재 -> 시행 -> 참조
    const stepTypeOrder = [
      "CONSULTATION",
      "AGREEMENT",
      "APPROVAL",
      "IMPLEMENTATION",
      "REFERENCE",
    ];

    // 각 타입별로 그룹화하고 정렬
    const groupedSteps: { [key: string]: ApprovalStepPreview[] } = {};
    steps.forEach((step) => {
      const type =
        step.stepType === "CONSULTATION" ? "AGREEMENT" : step.stepType;
      if (!groupedSteps[type]) {
        groupedSteps[type] = [];
      }
      groupedSteps[type].push(step);
    });

    // 각 타입별로 stepOrder로 정렬
    Object.keys(groupedSteps).forEach((type) => {
      groupedSteps[type].sort((a, b) => a.stepOrder - b.stepOrder);
    });

    // UI 순서대로 재배열하고 stepOrder 재할당
    const reorderedSteps: ApprovalStepPreview[] = [];
    let currentStepOrder = 1;

    stepTypeOrder.forEach((type) => {
      if (groupedSteps[type]) {
        groupedSteps[type].forEach((step) => {
          reorderedSteps.push({
            ...step,
            stepOrder: currentStepOrder++,
          });
        });
      }
    });

    return reorderedSteps;
  };

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

  const handleSubmit = async (customApprovalSteps?: ApprovalStepPreview[]) => {
    setLoading(true);
    try {
      if (customApprovalSteps) {
        // UI 순서대로 stepOrder 재조정
        const reorderedSteps = reorderStepsByUI(customApprovalSteps);

        // CONSULTATION을 AGREEMENT로 변환
        const convertedSteps = reorderedSteps.map((step) => ({
          ...step,
          stepType:
            step.stepType === "CONSULTATION" ? "AGREEMENT" : step.stepType,
        }));

        await apiClient.submitDocument(token, document.id, {
          draftContext: {}, // 모든 필드가 optional이므로 빈 객체 전달
          customApprovalSteps: convertedSteps, // 수정된 결재선 전달
        });
      } else {
        await apiClient.submitDocument(token, document.id, {
          draftContext: {}, // 모든 필드가 optional이므로 빈 객체 전달
        });
      }
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
                onClick={async () => {
                  // 현재 표시된 결재선을 기반으로 customApprovalSteps 생성
                  const currentSteps = isEditingApprovalLine
                    ? editableSteps
                    : approvalLinePreview?.steps || [];
                  const customApprovalSteps =
                    currentSteps.length > 0
                      ? currentSteps.map((step) => ({
                          stepOrder: step.stepOrder,
                          stepType: step.stepType,
                          isRequired: step.isRequired,
                          employeeId: step.employeeId,
                          assigneeRule: step.assigneeRule,
                          employeeName: step.employeeName,
                          departmentName: step.departmentName,
                          positionTitle: step.positionTitle,
                        }))
                      : undefined;

                  console.log("제출 시 결재선 정보:", {
                    isEditingApprovalLine,
                    currentStepsLength: currentSteps.length,
                    customApprovalSteps,
                    editableStepsLength: editableSteps.length,
                    previewStepsLength: approvalLinePreview?.steps.length || 0,
                  });

                  await handleSubmit(customApprovalSteps);
                }}
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
      {document.status === "DRAFT" && loadingPreview ? (
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
      ) : (
        <ApprovalLineDisplay
          documentStatus={document.status}
          isEditingApprovalLine={isEditingApprovalLine}
          editableSteps={editableSteps}
          approvalLinePreview={approvalLinePreview}
          approvalSteps={approvalSteps}
          onEditApprovalLine={handleEditApprovalLine}
          onSaveApprovalLine={handleSaveApprovalLine}
          onCancelEdit={handleCancelEdit}
          onStepClick={handleStepClick}
          onDeleteStepClick={handleDeleteStepClick}
          onMultiSelectClick={handleMultiSelectClick}
          onRemoveEmployee={handleRemoveEmployee}
          onMultiSelectComplete={handleMultiSelectComplete}
          isEmployeeModalOpen={isEmployeeModalOpen}
          isMultiSelectModalOpen={isMultiSelectModalOpen}
          selectedStepIndex={selectedStepIndex}
          selectedStepType={selectedStepType}
          selectedEmployees={selectedEmployees}
          onCloseEmployeeModal={() => {
            setIsEmployeeModalOpen(false);
            setSelectedStepIndex(null);
          }}
          onCloseMultiSelectModal={() => {
            setIsMultiSelectModalOpen(false);
            setSelectedEmployees([]);
          }}
          onEmployeeSelect={handleEmployeeSelect}
        />
      )}

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
