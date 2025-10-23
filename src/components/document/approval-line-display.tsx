"use client";

import EmployeeSelectorModal from "./employee-selector-modal";
import type { EmployeeDetail, ApprovalStep } from "@/types/api";

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

interface ApprovalLineDisplayProps {
  documentStatus: string;
  isEditingApprovalLine: boolean;
  editableSteps: ApprovalStepPreview[];
  approvalLinePreview: {
    templateName: string;
    steps: ApprovalStepPreview[];
  } | null;
  approvalSteps: ApprovalStep[];
  onEditApprovalLine: () => void;
  onSaveApprovalLine: () => void;
  onCancelEdit: () => void;
  onStepClick: (
    step: ApprovalStepPreview | null,
    stepType: string,
    stepIndex: number
  ) => void;
  onDeleteStepClick: (step: ApprovalStepPreview) => void;
  onMultiSelectClick: (stepType: string) => void;
  onRemoveEmployee: (stepType: string, employeeId: string) => void;
  onMultiSelectComplete: (employees: EmployeeDetail[]) => void;
  isEmployeeModalOpen: boolean;
  isMultiSelectModalOpen: boolean;
  selectedStepIndex: number | null;
  selectedStepType: string;
  selectedEmployees: EmployeeDetail[];
  onCloseEmployeeModal: () => void;
  onCloseMultiSelectModal: () => void;
  onEmployeeSelect: (employee: EmployeeDetail) => void;
}

export default function ApprovalLineDisplay({
  documentStatus,
  isEditingApprovalLine,
  editableSteps,
  approvalLinePreview,
  approvalSteps,
  onEditApprovalLine,
  onSaveApprovalLine,
  onCancelEdit,
  onStepClick,
  onDeleteStepClick,
  onMultiSelectClick,
  onRemoveEmployee,
  onMultiSelectComplete,
  isEmployeeModalOpen,
  isMultiSelectModalOpen,
  selectedStepType,
  selectedEmployees,
  onCloseEmployeeModal,
  onCloseMultiSelectModal,
  onEmployeeSelect,
}: ApprovalLineDisplayProps) {
  // 결재선 데이터 계산
  const steps = isEditingApprovalLine
    ? editableSteps
    : approvalLinePreview?.steps || [];
  const consultationSteps = steps.filter(
    (s) => s.stepType === "CONSULTATION" || s.stepType === "AGREEMENT"
  );
  const approvalStepsForEdit = steps.filter((s) => s.stepType === "APPROVAL");

  // 실제 결재 단계 데이터 (PENDING/APPROVED/REJECTED 상태일 때)
  const actualApprovalSteps = approvalSteps.filter(
    (s) => s.stepType === "APPROVAL"
  );

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {documentStatus === "DRAFT" ? "예상 결재선" : "결재 현황"}
        </h2>
        {documentStatus === "DRAFT" &&
          approvalLinePreview &&
          approvalLinePreview.steps.length > 0 && (
            <div className="flex space-x-2">
              {!isEditingApprovalLine ? (
                <button
                  onClick={onEditApprovalLine}
                  className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  수정
                </button>
              ) : (
                <>
                  <button
                    onClick={onSaveApprovalLine}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    저장
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          )}
      </div>

      {/* DRAFT 상태: 결재선 미리보기 */}
      {documentStatus === "DRAFT" && (
        <>
          {approvalLinePreview ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {approvalLinePreview.templateName}
                    </p>
                    <p className="text-xs text-blue-700">
                      문서를 제출하면 이 결재선으로 상신됩니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* 협의 영역 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    협의
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const step = consultationSteps[index];
                      const hasEmployee =
                        step && step.employeeId && step.employeeId !== "";
                      const canAddMore = consultationSteps.length < 5;
                      const canAdd =
                        isEditingApprovalLine &&
                        canAddMore &&
                        (index === consultationSteps.length ||
                          consultationSteps.length === 0);

                      // 빈 칸이면서 추가 가능한 경우
                      const isEmptyAndCanAdd = !step && canAdd;

                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer hover:shadow-md transition-shadow ${
                              step
                                ? hasEmployee
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                            }`}
                            title={
                              step
                                ? `${step.employeeName} (${step.departmentName}) - 클릭하여 수정/삭제`
                                : isEmptyAndCanAdd
                                ? "클릭하여 협의자 추가"
                                : ""
                            }
                            onClick={() => {
                              if (isEmptyAndCanAdd) {
                                onStepClick(step, "CONSULTATION", index);
                              } else if (step) {
                                onStepClick(
                                  step,
                                  "CONSULTATION",
                                  consultationSteps.indexOf(step)
                                );
                              }
                            }}
                          >
                            <div className="text-xs truncate w-full text-center px-1">
                              {step
                                ? step.employeeName ||
                                  (step.assigneeRule === "DRAFTER"
                                    ? "기안자"
                                    : step.assigneeRule === "DRAFTER_SUPERIOR"
                                    ? "기안자 상급자"
                                    : step.assigneeRule === "DEPARTMENT_HEAD"
                                    ? "부서장"
                                    : step.assigneeRule === "POSITION_BASED"
                                    ? "직책 기반"
                                    : step.assigneeRule)
                                : isEmptyAndCanAdd
                                ? "+"
                                : ""}
                            </div>
                            {step && step.isRequired && (
                              <div className="text-red-500 text-xs">*</div>
                            )}
                          </div>
                          {step && isEditingApprovalLine && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteStepClick(step);
                              }}
                              className="mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 결재 영역 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    결재
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const step =
                        documentStatus === "DRAFT"
                          ? approvalStepsForEdit[index]
                          : actualApprovalSteps[index];
                      const isDraftStep = documentStatus === "DRAFT";
                      const hasEmployee = isDraftStep
                        ? step &&
                          "employeeId" in step &&
                          step.employeeId &&
                          step.employeeId !== ""
                        : step &&
                          "approverId" in step &&
                          step.approverId &&
                          step.approverId !== "";
                      const currentSteps =
                        documentStatus === "DRAFT"
                          ? approvalStepsForEdit
                          : actualApprovalSteps;
                      const canAddMore = currentSteps.length < 5;
                      const canAdd =
                        isEditingApprovalLine &&
                        canAddMore &&
                        (index === currentSteps.length ||
                          currentSteps.length === 0);

                      // 빈 칸이면서 추가 가능한 경우
                      const isEmptyAndCanAdd = !step && canAdd;

                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer hover:shadow-md transition-shadow ${
                              step
                                ? hasEmployee
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                            }`}
                            title={
                              step
                                ? isDraftStep
                                  ? `${
                                      "employeeName" in step
                                        ? step.employeeName
                                        : ""
                                    } (${
                                      "departmentName" in step
                                        ? step.departmentName
                                        : ""
                                    }) - 클릭하여 수정/삭제`
                                  : `${
                                      "approverName" in step
                                        ? step.approverName
                                        : ""
                                    } (${
                                      "approverDepartmentName" in step
                                        ? step.approverDepartmentName
                                        : ""
                                    }) - 클릭하여 수정/삭제`
                                : isEmptyAndCanAdd
                                ? "클릭하여 결재자 추가"
                                : ""
                            }
                            onClick={() => {
                              if (isEmptyAndCanAdd) {
                                onStepClick(null, "APPROVAL", index);
                              } else if (step) {
                                // ApprovalStep을 ApprovalStepPreview로 변환
                                const stepPreview: ApprovalStepPreview = {
                                  stepOrder: step.stepOrder,
                                  stepType: step.stepType,
                                  employeeId: isDraftStep
                                    ? "employeeId" in step
                                      ? step.employeeId
                                      : ""
                                    : "approverId" in step
                                    ? step.approverId || ""
                                    : "",
                                  employeeName: isDraftStep
                                    ? "employeeName" in step
                                      ? step.employeeName
                                      : ""
                                    : "approverName" in step
                                    ? step.approverName || ""
                                    : "",
                                  departmentName: isDraftStep
                                    ? "departmentName" in step
                                      ? step.departmentName
                                      : undefined
                                    : "approverDepartmentName" in step
                                    ? step.approverDepartmentName
                                    : undefined,
                                  positionTitle: isDraftStep
                                    ? "positionTitle" in step
                                      ? step.positionTitle
                                      : undefined
                                    : "approverPositionTitle" in step
                                    ? step.approverPositionTitle
                                    : undefined,
                                  assigneeRule: step.assigneeRule,
                                  isRequired: step.isRequired || false,
                                };
                                onStepClick(
                                  stepPreview,
                                  "APPROVAL",
                                  currentSteps.indexOf(
                                    step as ApprovalStepPreview & ApprovalStep
                                  )
                                );
                              }
                            }}
                          >
                            <div className="text-xs truncate w-full text-center px-1">
                              {step
                                ? isDraftStep
                                  ? "employeeName" in step
                                    ? step.employeeName ||
                                      (step.assigneeRule === "DRAFTER"
                                        ? "기안자"
                                        : step.assigneeRule ===
                                          "DRAFTER_SUPERIOR"
                                        ? "기안자 상급자"
                                        : step.assigneeRule ===
                                          "DEPARTMENT_HEAD"
                                        ? "부서장"
                                        : step.assigneeRule === "POSITION_BASED"
                                        ? "직책 기반"
                                        : step.assigneeRule)
                                    : ""
                                  : "approverName" in step
                                  ? step.approverName ||
                                    (step.assigneeRule === "DRAFTER"
                                      ? "기안자"
                                      : step.assigneeRule === "DRAFTER_SUPERIOR"
                                      ? "기안자 상급자"
                                      : step.assigneeRule === "DEPARTMENT_HEAD"
                                      ? "부서장"
                                      : step.assigneeRule === "POSITION_BASED"
                                      ? "직책 기반"
                                      : step.assigneeRule)
                                  : ""
                                : isEmptyAndCanAdd
                                ? "+"
                                : ""}
                            </div>
                            {step && step.isRequired && (
                              <div className="text-red-500 text-xs">*</div>
                            )}
                          </div>
                          {step && isEditingApprovalLine && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // ApprovalStep을 ApprovalStepPreview로 변환
                                const stepPreview: ApprovalStepPreview = {
                                  stepOrder: step.stepOrder,
                                  stepType: step.stepType,
                                  employeeId: isDraftStep
                                    ? "employeeId" in step
                                      ? step.employeeId
                                      : ""
                                    : "approverId" in step
                                    ? step.approverId || ""
                                    : "",
                                  employeeName: isDraftStep
                                    ? "employeeName" in step
                                      ? step.employeeName
                                      : ""
                                    : "approverName" in step
                                    ? step.approverName || ""
                                    : "",
                                  departmentName: isDraftStep
                                    ? "departmentName" in step
                                      ? step.departmentName
                                      : undefined
                                    : "approverDepartmentName" in step
                                    ? step.approverDepartmentName
                                    : undefined,
                                  positionTitle: isDraftStep
                                    ? "positionTitle" in step
                                      ? step.positionTitle
                                      : undefined
                                    : "approverPositionTitle" in step
                                    ? step.approverPositionTitle
                                    : undefined,
                                  assigneeRule: step.assigneeRule,
                                  isRequired: step.isRequired || false,
                                };
                                onDeleteStepClick(stepPreview);
                              }}
                              className="mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 시행 영역 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    시행
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      const steps = isEditingApprovalLine
                        ? editableSteps
                        : approvalLinePreview?.steps || [];
                      const implementationSteps = steps.filter(
                        (s) => s.stepType === "IMPLEMENTATION"
                      );

                      if (implementationSteps.length > 0) {
                        return (
                          <div className="space-y-1">
                            {implementationSteps.map((step, index) => (
                              <div
                                key={`${step.employeeId}-${index}`}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                              >
                                <div className="flex-1">
                                  <div className="text-sm font-medium">
                                    {step.employeeName ||
                                      (step.assigneeRule === "DRAFTER"
                                        ? "기안자"
                                        : step.assigneeRule ===
                                          "DRAFTER_SUPERIOR"
                                        ? "기안자 상급자"
                                        : step.assigneeRule ===
                                          "DEPARTMENT_HEAD"
                                        ? "부서장"
                                        : step.assigneeRule === "POSITION_BASED"
                                        ? "직책 기반"
                                        : step.assigneeRule)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {step.departmentName} {step.positionTitle}
                                  </div>
                                </div>
                                {isEditingApprovalLine && (
                                  <button
                                    onClick={() =>
                                      onRemoveEmployee(
                                        "IMPLEMENTATION",
                                        step.employeeId
                                      )
                                    }
                                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={`text-sm text-gray-600 p-2 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${
                              isEditingApprovalLine
                                ? "border-gray-300 hover:border-gray-400"
                                : "border-transparent"
                            }`}
                            title={
                              isEditingApprovalLine
                                ? "클릭하여 시행자 추가"
                                : ""
                            }
                            onClick={() => onMultiSelectClick("IMPLEMENTATION")}
                          >
                            {isEditingApprovalLine
                              ? "클릭하여 시행자 추가"
                              : "시행자 없음"}
                          </div>
                        );
                      }
                    })()}
                    {isEditingApprovalLine &&
                      (() => {
                        const steps = isEditingApprovalLine
                          ? editableSteps
                          : approvalLinePreview?.steps || [];
                        const implementationSteps = steps.filter(
                          (s) => s.stepType === "IMPLEMENTATION"
                        );
                        return implementationSteps.length > 0 ? (
                          <button
                            onClick={() => onMultiSelectClick("IMPLEMENTATION")}
                            className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            시행자 추가/수정
                          </button>
                        ) : null;
                      })()}
                  </div>
                </div>

                {/* 참조 영역 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    참조
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      const steps = isEditingApprovalLine
                        ? editableSteps
                        : approvalLinePreview?.steps || [];
                      const referenceSteps = steps.filter(
                        (s) => s.stepType === "REFERENCE"
                      );

                      if (referenceSteps.length > 0) {
                        return (
                          <div className="space-y-1">
                            {referenceSteps.map((step, index) => (
                              <div
                                key={`${step.employeeId}-${index}`}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                              >
                                <div className="flex-1">
                                  <div className="text-sm font-medium">
                                    {step.employeeName ||
                                      (step.assigneeRule === "DRAFTER"
                                        ? "기안자"
                                        : step.assigneeRule ===
                                          "DRAFTER_SUPERIOR"
                                        ? "기안자 상급자"
                                        : step.assigneeRule ===
                                          "DEPARTMENT_HEAD"
                                        ? "부서장"
                                        : step.assigneeRule === "POSITION_BASED"
                                        ? "직책 기반"
                                        : step.assigneeRule)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {step.departmentName} {step.positionTitle}
                                  </div>
                                </div>
                                {isEditingApprovalLine && (
                                  <button
                                    onClick={() =>
                                      onRemoveEmployee(
                                        "REFERENCE",
                                        step.employeeId
                                      )
                                    }
                                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={`text-sm text-gray-600 p-2 rounded border-2 cursor-pointer hover:shadow-md transition-shadow ${
                              isEditingApprovalLine
                                ? "border-gray-300 hover:border-gray-400"
                                : "border-transparent"
                            }`}
                            title={
                              isEditingApprovalLine
                                ? "클릭하여 참조자 추가"
                                : ""
                            }
                            onClick={() => onMultiSelectClick("REFERENCE")}
                          >
                            {isEditingApprovalLine
                              ? "클릭하여 참조자 추가"
                              : "참조자 없음"}
                          </div>
                        );
                      }
                    })()}
                    {isEditingApprovalLine &&
                      (() => {
                        const steps = isEditingApprovalLine
                          ? editableSteps
                          : approvalLinePreview?.steps || [];
                        const referenceSteps = steps.filter(
                          (s) => s.stepType === "REFERENCE"
                        );
                        return referenceSteps.length > 0 ? (
                          <button
                            onClick={() => onMultiSelectClick("REFERENCE")}
                            className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            참조자 추가/수정
                          </button>
                        ) : null;
                      })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">
                결재선을 불러올 수 없습니다
              </p>
            </div>
          )}
        </>
      )}

      {/* 제출된 상태: 실제 결재 현황 */}
      {documentStatus !== "DRAFT" &&
      approvalSteps &&
      approvalSteps.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {approvalSteps.map((step, index) => {
              const isCompleted =
                step.status === "APPROVED" || step.status === "COMPLETED";
              const isRejected = step.status === "REJECTED";
              const isPending = step.status === "PENDING";
              const isInProgress =
                isPending &&
                (index === 0 ||
                  approvalSteps[index - 1]?.status === "APPROVED" ||
                  approvalSteps[index - 1]?.status === "COMPLETED");

              const stepTypeLabel =
                step.stepType === "AGREEMENT"
                  ? "협의"
                  : step.stepType === "APPROVAL"
                  ? "결재"
                  : step.stepType === "IMPLEMENTATION"
                  ? "시행"
                  : step.stepType === "REFERENCE"
                  ? "참조"
                  : step.stepType;

              return (
                <div
                  key={step.id}
                  className="relative flex items-start space-x-4 pl-11"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 flex items-center justify-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm ${
                        isCompleted
                          ? "bg-green-100 border-green-500 text-green-700"
                          : isRejected
                          ? "bg-red-100 border-red-500 text-red-700"
                          : isInProgress
                          ? "bg-blue-100 border-blue-500 text-blue-700 ring-4 ring-blue-100"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : isRejected ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-4 rounded-lg border ${
                      isInProgress
                        ? "bg-blue-50 border-blue-200"
                        : isCompleted
                        ? "bg-green-50 border-green-200"
                        : isRejected
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            step.stepType === "AGREEMENT"
                              ? "bg-purple-100 text-purple-800"
                              : step.stepType === "APPROVAL"
                              ? "bg-blue-100 text-blue-800"
                              : step.stepType === "IMPLEMENTATION"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {stepTypeLabel}
                        </span>
                        {step.isRequired && (
                          <span className="text-red-500 text-xs font-medium">
                            필수
                          </span>
                        )}
                      </div>
                      {getStatusBadge(step.status)}
                    </div>

                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {step.approverName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {step.approverDepartmentName}
                        {step.approverPositionTitle &&
                          ` · ${step.approverPositionTitle}`}
                      </p>
                    </div>

                    {step.comment && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">의견</p>
                        <p className="text-sm text-gray-900">{step.comment}</p>
                      </div>
                    )}

                    {(step.approvedAt ||
                      step.rejectedAt ||
                      step.completedAt) && (
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(
                          (step.approvedAt ||
                            step.rejectedAt ||
                            step.completedAt) as string
                        ).toLocaleString()}
                      </p>
                    )}

                    {isInProgress && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="text-xs font-medium text-blue-700">
                          진행 중
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : documentStatus !== "DRAFT" ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-500">결재 정보가 없습니다.</p>
        </div>
      ) : null}

      {/* Employee Selector Modal */}
      <EmployeeSelectorModal
        isOpen={isEmployeeModalOpen}
        onClose={onCloseEmployeeModal}
        onSelect={onEmployeeSelect}
        title="결재자 선택"
      />

      {/* Multi-Select Employee Modal */}
      <EmployeeSelectorModal
        isOpen={isMultiSelectModalOpen}
        onClose={onCloseMultiSelectModal}
        onSelect={() => {}} // 빈 함수로 처리
        onMultiSelect={onMultiSelectComplete}
        allowMultiSelect={true}
        selectedEmployees={selectedEmployees}
        title={
          selectedStepType === "IMPLEMENTATION" ? "시행자 선택" : "참조자 선택"
        }
      />
    </div>
  );
}
