/**
 * Approval Steps Section - 결재 단계 섹션
 */

import type { Employee } from "@/types/metadata";
import type { StepType, AssigneeRule } from "@/types/approval-flow";

// 합의/결재 영역의 개별 칸 (최대 5칸)
export interface StepSlot {
  id: string;
  assigneeRule: AssigneeRule;
  isRequired: boolean;
  selectedEmployee?: Employee;
  targetEmployeeId?: string;
  isEmpty: boolean;
  needsSelection: boolean; // 직원/부서 선택이 필요한지
}

// 시행/참조 영역의 단계
export interface MultiStep {
  id: string;
  stepType: StepType;
  assigneeRule: AssigneeRule;
  isRequired: boolean;
  selectedEmployees?: Employee[]; // 시행/참조용
  selectedDepartments?: { id: string; name: string; employeeCount?: number }[]; // 참조용
  targetEmployeeId?: string;
  targetDepartmentId?: string;
  needsSelection?: boolean; // 직원/부서 선택이 필요한지
}

interface ApprovalStepsSectionProps {
  agreementSlots: StepSlot[]; // 합의 5칸
  approvalSlots: StepSlot[]; // 결재 5칸
  implementationSteps: MultiStep[]; // 시행 (여러명)
  referenceSteps: MultiStep[]; // 참조 (여러명 + 여러 부서)
  loading: boolean;
  onUpdateAgreementSlot: (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => void;
  onUpdateApprovalSlot: (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => void;
  onRemoveAgreementSlot: (index: number) => void;
  onRemoveApprovalSlot: (index: number) => void;
  onAddImplementationStep: () => void;
  onAddReferenceStep: () => void;
  onUpdateImplementationStep: (
    index: number,
    field: string,
    value: unknown
  ) => void;
  onUpdateReferenceStep: (index: number, field: string, value: unknown) => void;
  onRemoveImplementationStep: (index: number) => void;
  onRemoveReferenceStep: (index: number) => void;
  onOpenEmployeePicker: (
    area: "agreement" | "approval" | "implementation" | "reference",
    index: number
  ) => void;
  onOpenDepartmentSelector: (index: number) => void;
}

export default function ApprovalStepsSection({
  agreementSlots,
  approvalSlots,
  implementationSteps,
  referenceSteps,
  loading,
  onUpdateAgreementSlot,
  onUpdateApprovalSlot,
  onRemoveAgreementSlot,
  onRemoveApprovalSlot,
  onAddImplementationStep,
  onAddReferenceStep,
  onUpdateImplementationStep,
  onUpdateReferenceStep,
  onRemoveImplementationStep,
  onRemoveReferenceStep,
  onOpenEmployeePicker,
  onOpenDepartmentSelector,
}: ApprovalStepsSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-medium text-gray-900">결재 단계 *</h2>
      </div>

      <div className="space-y-6">
        {/* 합의 영역 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">합의</label>
          </div>
          <div className="flex space-x-1">
            {agreementSlots.map((slot, index) => {
              // 추가할 때만 왼쪽부터 순서대로 입력 가능
              const filledCount = agreementSlots.filter(
                (s) => !s.isEmpty
              ).length;
              const canAddNew = !slot.isEmpty || index === filledCount; // 빈 슬롯 추가 가능
              const isSelectDisabled = slot.isEmpty && !canAddNew; // 빈 슬롯이고 추가 불가능할 때만 비활성화

              const availableRules = [
                { value: "FIXED", label: "고정 담당자" },
                { value: "DRAFTER", label: "기안자" },
                { value: "DRAFTER_SUPERIOR", label: "기안자 상급자" },
              ];

              return (
                <div
                  key={slot.id}
                  className="flex flex-col items-center w-20 space-y-1 relative"
                >
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                      !slot.isEmpty
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                    }`}
                  >
                    {!slot.isEmpty && (
                      <>
                        <div className="text-xs truncate w-full text-center px-1">
                          {slot.assigneeRule === "DRAFTER"
                            ? "기안자"
                            : slot.assigneeRule === "DRAFTER_SUPERIOR"
                            ? "상급자"
                            : slot.assigneeRule === "FIXED" &&
                              slot.selectedEmployee
                            ? slot.selectedEmployee.name
                            : slot.assigneeRule === "FIXED" &&
                              slot.needsSelection
                            ? "직원선택"
                            : slot.assigneeRule === "FIXED"
                            ? "고정"
                            : "미지정"}
                        </div>
                        {slot.isRequired && (
                          <div className="text-red-500 text-xs">*</div>
                        )}
                      </>
                    )}
                  </div>

                  {/* 삭제 버튼 */}
                  {!slot.isEmpty && (
                    <button
                      type="button"
                      onClick={() => onRemoveAgreementSlot(index)}
                      disabled={loading}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                      ×
                    </button>
                  )}

                  {/* 담당자 규칙 선택 */}
                  <select
                    value={slot.isEmpty ? "" : slot.assigneeRule}
                    onChange={(e) => {
                      if (e.target.value) {
                        if (slot.isEmpty) {
                          // 새로 추가하는 경우
                          if (canAddNew) {
                            onUpdateAgreementSlot(
                              index,
                              "assigneeRule",
                              e.target.value
                            );

                            // FIXED가 아닌 경우 (기안자, 상급자) isEmpty를 false로 설정
                            if (e.target.value !== "FIXED") {
                              onUpdateAgreementSlot(index, "isEmpty", false);
                            }

                            // FIXED일 때만 직원 선택 필요
                            if (e.target.value === "FIXED") {
                              onOpenEmployeePicker("agreement", index);
                            }
                          }
                        } else {
                          // 기존 단계 수정 - 한 번만 호출하도록 정리
                          onUpdateAgreementSlot(
                            index,
                            "assigneeRule",
                            e.target.value
                          );
                          // FIXED로 변경하는 경우, 이미 선택된 직원이 없으면 모달 열기
                          if (
                            e.target.value === "FIXED" &&
                            !slot.selectedEmployee
                          ) {
                            onOpenEmployeePicker("agreement", index);
                          }
                        }
                      }
                    }}
                    disabled={loading || isSelectDisabled}
                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">규칙</option>
                    {availableRules.map((rule) => (
                      <option key={rule.value} value={rule.value}>
                        {rule.label}
                      </option>
                    ))}
                  </select>

                  {/* 직원 선택 버튼 (FIXED일 때만 표시) */}
                  {!slot.isEmpty &&
                    slot.needsSelection &&
                    !slot.selectedEmployee && (
                      <button
                        type="button"
                        onClick={() => onOpenEmployeePicker("agreement", index)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        직원 선택
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 결재 영역 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">결재</label>
          </div>
          <div className="flex space-x-1">
            {approvalSlots.map((slot, index) => {
              // 추가할 때만 왼쪽부터 순서대로 입력 가능
              const filledCount = approvalSlots.filter(
                (s) => !s.isEmpty
              ).length;
              const canAddNew = !slot.isEmpty || index === filledCount; // 빈 슬롯 추가 가능
              const isSelectDisabled = slot.isEmpty && !canAddNew; // 빈 슬롯이고 추가 불가능할 때만 비활성화

              const availableRules = [
                { value: "FIXED", label: "고정 담당자" },
                { value: "DRAFTER", label: "기안자" },
                { value: "DRAFTER_SUPERIOR", label: "기안자 상급자" },
              ];

              return (
                <div
                  key={slot.id}
                  className="flex flex-col items-center w-20 space-y-1 relative"
                >
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium ${
                      !slot.isEmpty
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                    }`}
                  >
                    {!slot.isEmpty && (
                      <>
                        <div className="text-xs truncate w-full text-center px-1">
                          {slot.assigneeRule === "DRAFTER"
                            ? "기안자"
                            : slot.assigneeRule === "DRAFTER_SUPERIOR"
                            ? "상급자"
                            : slot.assigneeRule === "FIXED" &&
                              slot.selectedEmployee
                            ? slot.selectedEmployee.name
                            : slot.assigneeRule === "FIXED" &&
                              slot.needsSelection
                            ? "직원선택"
                            : slot.assigneeRule === "FIXED"
                            ? "고정"
                            : "미지정"}
                        </div>
                        {slot.isRequired && (
                          <div className="text-red-500 text-xs">*</div>
                        )}
                      </>
                    )}
                  </div>

                  {/* 삭제 버튼 */}
                  {!slot.isEmpty && (
                    <button
                      type="button"
                      onClick={() => onRemoveApprovalSlot(index)}
                      disabled={loading}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                      ×
                    </button>
                  )}

                  {/* 담당자 규칙 선택 */}
                  <select
                    value={slot.isEmpty ? "" : slot.assigneeRule}
                    onChange={(e) => {
                      if (e.target.value) {
                        if (slot.isEmpty) {
                          // 새로 추가하는 경우
                          if (canAddNew) {
                            onUpdateApprovalSlot(
                              index,
                              "assigneeRule",
                              e.target.value
                            );

                            // FIXED가 아닌 경우 (기안자, 상급자) isEmpty를 false로 설정
                            if (e.target.value !== "FIXED") {
                              onUpdateApprovalSlot(index, "isEmpty", false);
                            }

                            // FIXED일 때만 직원 선택 필요
                            if (e.target.value === "FIXED") {
                              onOpenEmployeePicker("approval", index);
                            }
                          }
                        } else {
                          // 기존 단계 수정 - 한 번만 호출하도록 정리
                          onUpdateApprovalSlot(
                            index,
                            "assigneeRule",
                            e.target.value
                          );
                          // FIXED로 변경하는 경우, 이미 선택된 직원이 없으면 모달 열기
                          if (
                            e.target.value === "FIXED" &&
                            !slot.selectedEmployee
                          ) {
                            onOpenEmployeePicker("approval", index);
                          }
                        }
                      }
                    }}
                    disabled={loading || isSelectDisabled}
                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">규칙</option>
                    {availableRules.map((rule) => (
                      <option key={rule.value} value={rule.value}>
                        {rule.label}
                      </option>
                    ))}
                  </select>

                  {/* 직원 선택 버튼 (FIXED일 때만 표시) */}
                  {!slot.isEmpty &&
                    slot.needsSelection &&
                    !slot.selectedEmployee && (
                      <button
                        type="button"
                        onClick={() => onOpenEmployeePicker("approval", index)}
                        className="text-xs text-green-600 hover:text-green-800"
                      >
                        직원 선택
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 시행 영역 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">시행</label>
            <button
              type="button"
              onClick={onAddImplementationStep}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              + 추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {implementationSteps.length > 0 ? (
              implementationSteps.map((step, index) => {
                const availableRules = [
                  { value: "FIXED", label: "고정 담당자" },
                  { value: "DRAFTER", label: "기안자" },
                  { value: "DRAFTER_SUPERIOR", label: "기안자 상급자" },
                ];

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-1.5 p-2 border border-gray-300 rounded-md bg-white w-fit"
                  >
                    <select
                      value={step.assigneeRule}
                      onChange={(e) => {
                        onUpdateImplementationStep(
                          index,
                          "assigneeRule",
                          e.target.value
                        );
                        if (e.target.value === "FIXED") {
                          onOpenEmployeePicker("implementation", index);
                        }
                      }}
                      disabled={loading}
                      className="text-xs border border-gray-300 rounded px-2 py-1 w-28"
                    >
                      {availableRules.map((rule) => (
                        <option key={rule.value} value={rule.value}>
                          {rule.label}
                        </option>
                      ))}
                    </select>

                    <div className="text-sm truncate max-w-[120px]">
                      {step.assigneeRule === "FIXED" &&
                      step.selectedEmployees &&
                      step.selectedEmployees.length > 0
                        ? step.selectedEmployees[0].name
                        : step.assigneeRule === "DRAFTER"
                        ? "기안자"
                        : step.assigneeRule === "DRAFTER_SUPERIOR"
                        ? "기안자 상급자"
                        : "미지정"}
                    </div>

                    {step.assigneeRule === "FIXED" && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenEmployeePicker("implementation", index)
                        }
                        className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                      >
                        + 선택
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveImplementationStep(index)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-500 p-2 rounded border border-gray-200">
                시행자 없음
              </div>
            )}
          </div>
        </div>

        {/* 참조 영역 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">참조</label>
            <button
              type="button"
              onClick={onAddReferenceStep}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              + 추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {referenceSteps.length > 0 ? (
              referenceSteps.map((step, index) => {
                const availableRules = [
                  { value: "FIXED", label: "고정 담당자" },
                  { value: "DRAFTER", label: "기안자" },
                  { value: "DRAFTER_SUPERIOR", label: "기안자 상급자" },
                  { value: "DEPARTMENT_REFERENCE", label: "부서 전체" },
                ];

                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-1.5 p-2 border border-gray-300 rounded-md bg-white w-fit"
                  >
                    <select
                      value={step.assigneeRule}
                      onChange={(e) => {
                        onUpdateReferenceStep(
                          index,
                          "assigneeRule",
                          e.target.value
                        );
                        if (e.target.value === "FIXED") {
                          onOpenEmployeePicker("reference", index);
                        } else if (e.target.value === "DEPARTMENT_REFERENCE") {
                          onOpenDepartmentSelector(index);
                        }
                      }}
                      disabled={loading}
                      className="text-xs border border-gray-300 rounded px-2 py-1 w-32"
                    >
                      {availableRules.map((rule) => (
                        <option key={rule.value} value={rule.value}>
                          {rule.label}
                        </option>
                      ))}
                    </select>

                    <div className="text-sm truncate max-w-[150px]">
                      {step.assigneeRule === "FIXED" &&
                      step.selectedEmployees &&
                      step.selectedEmployees.length > 0
                        ? `직원: ${step.selectedEmployees[0].name}`
                        : step.assigneeRule === "DEPARTMENT_REFERENCE" &&
                          step.selectedDepartments &&
                          step.selectedDepartments.length > 0
                        ? `부서: ${step.selectedDepartments[0].name}`
                        : step.assigneeRule === "DRAFTER"
                        ? "기안자"
                        : step.assigneeRule === "DRAFTER_SUPERIOR"
                        ? "기안자 상급자"
                        : step.assigneeRule === "DEPARTMENT_REFERENCE"
                        ? "부서 미지정"
                        : "미지정"}
                    </div>

                    {step.assigneeRule === "FIXED" && (
                      <button
                        type="button"
                        onClick={() => onOpenEmployeePicker("reference", index)}
                        className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                      >
                        + 선택
                      </button>
                    )}
                    {step.assigneeRule === "DEPARTMENT_REFERENCE" && (
                      <button
                        type="button"
                        onClick={() => onOpenDepartmentSelector(index)}
                        className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                      >
                        + 선택
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveReferenceStep(index)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-500 p-2 rounded border border-gray-200">
                참조자 없음
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
