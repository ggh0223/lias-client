"use client";

import { useState, useEffect } from "react";
import type { PreviewStepInfo } from "@/types/approval-flow";
import type { Employee } from "@/types/metadata";
import type {
  StepSlot,
  MultiStep,
} from "../../../admin/approval-lines/new/sections/approval-steps-section";
import ApprovalStepsSection from "../../../admin/approval-lines/new/sections/approval-steps-section";
import EmployeePickerModal from "../../../admin/approval-lines/new/components/employee-picker-modal";
import DepartmentSelectorModal from "../../../admin/approval-lines/new/components/department-selector-modal";

interface EditableApprovalPanelProps {
  templateName: string;
  initialSteps: PreviewStepInfo[];
  loading?: boolean;
  onApprovalStepsChange?: (steps: CustomApprovalStep[]) => void;
}

interface CustomApprovalStep {
  stepOrder: number;
  stepType: string;
  isRequired: boolean;
  employeeId?: string;
  departmentId?: string;
  assigneeRule: string;
}

export default function EditableApprovalPanel({
  templateName,
  initialSteps,
  loading = false,
  onApprovalStepsChange,
}: EditableApprovalPanelProps) {
  // PreviewStepInfo를 StepSlot/MultiStep으로 변환
  const initializeSlots = () => {
    const agreementSteps = initialSteps.filter(
      (s) => s.stepType === "AGREEMENT"
    );
    const approvalSteps = initialSteps.filter((s) => s.stepType === "APPROVAL");
    const implementationSteps = initialSteps.filter(
      (s) => s.stepType === "IMPLEMENTATION"
    );
    const referenceSteps = initialSteps.filter(
      (s) => s.stepType === "REFERENCE"
    );

    const agreementSlots: StepSlot[] = Array.from({ length: 5 }, (_, i) => {
      const step = agreementSteps[i];
      if (step) {
        const assigneeRule = step.assigneeRule || "DRAFTER";
        const employeeId = step.employeeId || step.approverId || "";
        const employeeName = step.employeeName || step.approverName || "";

        return {
          id: `agreement-${i}`,
          assigneeRule: assigneeRule,
          isRequired: step.isRequired,
          targetEmployeeId: employeeId,
          isEmpty: false,
          needsSelection: assigneeRule === "FIXED",
          selectedEmployee: employeeId
            ? {
                id: employeeId,
                employeeNumber: "",
                name: employeeName,
                email: "",
                phoneNumber: "",
                status: "Active" as const,
                hireDate: new Date().toISOString(),
                departments: [],
              }
            : undefined,
        };
      }
      return {
        id: `agreement-${i}`,
        assigneeRule: "DRAFTER",
        isRequired: false,
        isEmpty: true,
        needsSelection: false,
      };
    });

    const approvalSlots: StepSlot[] = Array.from({ length: 5 }, (_, i) => {
      const step = approvalSteps[i];
      if (step) {
        const assigneeRule = step.assigneeRule || "DRAFTER";
        const employeeId = step.employeeId || step.approverId || "";
        const employeeName = step.employeeName || step.approverName || "";

        return {
          id: `approval-${i}`,
          assigneeRule: assigneeRule,
          isRequired: step.isRequired,
          targetEmployeeId: employeeId,
          isEmpty: false,
          needsSelection: assigneeRule === "FIXED",
          selectedEmployee: employeeId
            ? {
                id: employeeId,
                employeeNumber: "",
                name: employeeName,
                email: "",
                phoneNumber: "",
                status: "Active" as const,
                hireDate: new Date().toISOString(),
                departments: [],
              }
            : undefined,
        };
      }
      return {
        id: `approval-${i}`,
        assigneeRule: "DRAFTER",
        isRequired: false,
        isEmpty: true,
        needsSelection: false,
      };
    });

    const implSteps: MultiStep[] = implementationSteps.map((step) => {
      const assigneeRule = step.assigneeRule || "DRAFTER";
      const employeeId = step.employeeId || step.approverId || "";
      const employeeName = step.employeeName || step.approverName || "";

      return {
        id: `implementation-${step.stepOrder}`,
        stepType: "IMPLEMENTATION",
        assigneeRule: assigneeRule,
        isRequired: step.isRequired,
        needsSelection: assigneeRule === "FIXED",
        selectedEmployees: employeeId
          ? [
              {
                id: employeeId,
                employeeNumber: "",
                name: employeeName,
                email: "",
                phoneNumber: "",
                status: "Active" as const,
                hireDate: new Date().toISOString(),
                departments: [],
              },
            ]
          : [],
      };
    });

    // 참조 단계 그룹화: 같은 stepOrder를 가진 항목들을 하나로 통합
    const refStepsByOrder = referenceSteps.reduce((acc, step) => {
      const order = step.stepOrder;
      if (!acc[order]) {
        acc[order] = [];
      }
      acc[order].push(step);
      return acc;
    }, {} as Record<number, typeof referenceSteps>);

    const refSteps: MultiStep[] = Object.entries(refStepsByOrder).map(
      ([order, steps]) => {
        // 첫 번째 step을 기준으로 assigneeRule 결정
        const firstStep = steps[0];
        const assigneeRule = firstStep.assigneeRule || "DRAFTER";

        // 모든 steps에서 직원 정보 수집
        const selectedEmployees = steps
          .filter((step) => step.employeeId || step.approverId)
          .map((step) => ({
            id: step.employeeId || step.approverId || "",
            employeeNumber: "",
            name: step.employeeName || step.approverName || "",
            email: "",
            phoneNumber: "",
            status: "Active" as const,
            hireDate: new Date().toISOString(),
            departments: [],
          }));

        // DEPARTMENT_REFERENCE 규칙일 때만 부서 정보 수집
        const selectedDepartments =
          assigneeRule === "DEPARTMENT_REFERENCE"
            ? steps
                .filter(
                  (step) =>
                    (step.departmentName || step.approverDepartmentName) &&
                    step.departmentName !== "미지정" &&
                    step.approverDepartmentName !== "미지정"
                )
                .map((step) => {
                  const deptName =
                    step.departmentName || step.approverDepartmentName || "";
                  return {
                    id: `dept-${deptName}`,
                    name: deptName,
                  };
                })
            : [];

        return {
          id: `reference-${order}`,
          stepType: "REFERENCE",
          assigneeRule: assigneeRule,
          isRequired: firstStep.isRequired,
          needsSelection:
            assigneeRule === "FIXED" || assigneeRule === "DEPARTMENT_REFERENCE",
          selectedEmployees,
          selectedDepartments,
        };
      }
    );

    return {
      agreementSlots,
      approvalSlots,
      implementationSteps: implSteps,
      referenceSteps: refSteps,
    };
  };

  const [state, setState] = useState(() => initializeSlots());
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [currentArea, setCurrentArea] = useState<
    "agreement" | "approval" | "implementation" | "reference"
  >("agreement");

  // 결재선 변경 시 상위 컴포넌트에 알림
  useEffect(() => {
    if (onApprovalStepsChange) {
      const customSteps: CustomApprovalStep[] = [];
      let stepOrder = 1;

      // 합의 단계
      state.agreementSlots.forEach((slot) => {
        if (!slot.isEmpty) {
          customSteps.push({
            stepOrder: stepOrder++,
            stepType: "AGREEMENT",
            assigneeRule: slot.assigneeRule,
            isRequired: slot.isRequired,
            employeeId: slot.targetEmployeeId,
          });
        }
      });

      // 결재 단계
      state.approvalSlots.forEach((slot) => {
        if (!slot.isEmpty) {
          customSteps.push({
            stepOrder: stepOrder++,
            stepType: "APPROVAL",
            assigneeRule: slot.assigneeRule,
            isRequired: slot.isRequired,
            employeeId: slot.targetEmployeeId,
          });
        }
      });

      // 시행 단계
      state.implementationSteps.forEach((step) => {
        customSteps.push({
          stepOrder: stepOrder++,
          stepType: "IMPLEMENTATION",
          assigneeRule: step.assigneeRule,
          isRequired: step.isRequired,
          employeeId:
            step.selectedEmployees && step.selectedEmployees.length > 0
              ? step.selectedEmployees[0].id
              : undefined,
        });
      });

      // 참조 단계
      state.referenceSteps.forEach((step) => {
        const stepData: CustomApprovalStep = {
          stepOrder: stepOrder++,
          stepType: "REFERENCE",
          assigneeRule: step.assigneeRule,
          isRequired: step.isRequired,
        };

        // UUID 형식 확인을 위한 정규식
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        // assigneeRule에 따라 데이터 설정
        if (step.assigneeRule === "DEPARTMENT_REFERENCE") {
          // 부서 전체 참조일 때만 부서 ID 포함
          if (step.selectedDepartments && step.selectedDepartments.length > 0) {
            const deptId = step.selectedDepartments[0].id;
            // UUID 형식일 때만 포함
            if (deptId && uuidRegex.test(deptId)) {
              stepData.departmentId = deptId;
            }
          }
        } else if (step.assigneeRule === "FIXED") {
          // 고정 담당자일 때는 직원 ID만 포함
          if (step.selectedEmployees && step.selectedEmployees.length > 0) {
            const empId = step.selectedEmployees[0].id;
            // UUID 형식일 때만 포함
            if (empId && uuidRegex.test(empId)) {
              stepData.employeeId = empId;
            }
          }
        }

        customSteps.push(stepData);
      });

      onApprovalStepsChange(customSteps);
    }
  }, [state, onApprovalStepsChange]);

  const handleUpdateAgreementSlot = (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => {
    console.log(
      "before update:",
      index,
      field,
      value,
      state.agreementSlots[index]
    );

    const newSlots = [...state.agreementSlots];

    if (field === "assigneeRule") {
      // assigneeRule 변경 시 needsSelection도 함께 업데이트
      newSlots[index] = {
        ...newSlots[index],
        assigneeRule: value as StepSlot["assigneeRule"],
        needsSelection: value === "FIXED",
      };

      // FIXED로 변경될 때 모달 열기
      if (value === "FIXED") {
        setCurrentArea("agreement");
        setCurrentIndex(index);
        setShowEmployeeModal(true);
      } else {
        // 다른 규칙으로 변경하면 선택된 직원 제거
        newSlots[index].selectedEmployee = undefined;
        newSlots[index].targetEmployeeId = undefined;
      }
    } else if (field === "isEmpty") {
      // isEmpty만 변경하고 assigneeRule은 유지
      newSlots[index] = { ...newSlots[index], isEmpty: value as boolean };
    } else {
      newSlots[index] = { ...newSlots[index], [field]: value };
    }

    console.log("after update:", newSlots[index]);
    setState({ ...state, agreementSlots: newSlots });
  };

  const handleUpdateApprovalSlot = (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => {
    console.log(
      "before update:",
      index,
      field,
      value,
      state.approvalSlots[index]
    );

    const newSlots = [...state.approvalSlots];

    if (field === "assigneeRule") {
      // assigneeRule 변경 시 needsSelection도 함께 업데이트
      newSlots[index] = {
        ...newSlots[index],
        assigneeRule: value as StepSlot["assigneeRule"],
        needsSelection: value === "FIXED",
      };

      // FIXED로 변경될 때 모달 열기
      if (value === "FIXED") {
        setCurrentArea("approval");
        setCurrentIndex(index);
        setShowEmployeeModal(true);
      } else {
        // 다른 규칙으로 변경하면 선택된 직원 제거
        newSlots[index].selectedEmployee = undefined;
        newSlots[index].targetEmployeeId = undefined;
      }
    } else if (field === "isEmpty") {
      // isEmpty만 변경하고 assigneeRule은 유지
      newSlots[index] = { ...newSlots[index], isEmpty: value as boolean };
    } else {
      newSlots[index] = { ...newSlots[index], [field]: value };
    }

    console.log("after update:", newSlots[index]);
    setState({ ...state, approvalSlots: newSlots });
  };

  const handleRemoveAgreementSlot = (index: number) => {
    const newSlots = [...state.agreementSlots];
    // 왼쪽으로 시프트
    for (let i = index; i < newSlots.length - 1; i++) {
      newSlots[i] = newSlots[i + 1];
    }
    newSlots[newSlots.length - 1] = {
      id: `agreement-${newSlots.length - 1}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    setState({ ...state, agreementSlots: newSlots });
  };

  const handleRemoveApprovalSlot = (index: number) => {
    const newSlots = [...state.approvalSlots];
    for (let i = index; i < newSlots.length - 1; i++) {
      newSlots[i] = newSlots[i + 1];
    }
    newSlots[newSlots.length - 1] = {
      id: `approval-${newSlots.length - 1}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    setState({ ...state, approvalSlots: newSlots });
  };

  const handleAddImplementationStep = () => {
    const newStep: MultiStep = {
      id: `implementation-${Date.now()}`,
      stepType: "IMPLEMENTATION",
      assigneeRule: "DRAFTER",
      isRequired: false,
      needsSelection: false,
      selectedEmployees: [],
    };
    setState({
      ...state,
      implementationSteps: [...state.implementationSteps, newStep],
    });
  };

  const handleAddReferenceStep = () => {
    const newStep: MultiStep = {
      id: `reference-${Date.now()}`,
      stepType: "REFERENCE",
      assigneeRule: "DRAFTER",
      isRequired: false,
      needsSelection: false,
      selectedEmployees: [],
      selectedDepartments: [],
    };
    setState({
      ...state,
      referenceSteps: [...state.referenceSteps, newStep],
    });
  };

  const handleUpdateImplementationStep = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newSteps = [...state.implementationSteps];
    const step = newSteps[index];
    newSteps[index] = {
      ...step,
      [field]: value,
      needsSelection: field === "assigneeRule" && value === "FIXED",
    };
    setState({ ...state, implementationSteps: newSteps });
  };

  const handleUpdateReferenceStep = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newSteps = [...state.referenceSteps];
    const step = newSteps[index];
    newSteps[index] = {
      ...step,
      [field]: value,
      needsSelection:
        field === "assigneeRule" &&
        (value === "FIXED" || value === "DEPARTMENT_REFERENCE"),
    };
    setState({ ...state, referenceSteps: newSteps });
  };

  const handleRemoveImplementationStep = (index: number) => {
    const newSteps = state.implementationSteps.filter((_, i) => i !== index);
    setState({ ...state, implementationSteps: newSteps });
  };

  const handleRemoveReferenceStep = (index: number) => {
    const newSteps = state.referenceSteps.filter((_, i) => i !== index);
    setState({ ...state, referenceSteps: newSteps });
  };

  const handleOpenEmployeePicker = (
    area: "agreement" | "approval" | "implementation" | "reference",
    index: number
  ) => {
    console.log(area, index);
    setCurrentArea(area);
    setCurrentIndex(index);
    setShowEmployeeModal(true);
  };

  const handleOpenDepartmentSelector = (index: number) => {
    setCurrentIndex(index);
    setShowDepartmentModal(true);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    if (currentIndex === null) return;

    if (currentArea === "agreement") {
      const newSlots = [...state.agreementSlots];
      const currentSlot = newSlots[currentIndex];
      newSlots[currentIndex] = {
        ...currentSlot,
        selectedEmployee: employee,
        targetEmployeeId: employee.id,
        needsSelection: false,
        isEmpty: false,
        // assigneeRule 유지
        assigneeRule: currentSlot.assigneeRule,
      };
      setState({ ...state, agreementSlots: newSlots });
    } else if (currentArea === "approval") {
      const newSlots = [...state.approvalSlots];
      const currentSlot = newSlots[currentIndex];
      newSlots[currentIndex] = {
        ...currentSlot,
        selectedEmployee: employee,
        targetEmployeeId: employee.id,
        needsSelection: false,
        isEmpty: false,
        // assigneeRule 유지
        assigneeRule: currentSlot.assigneeRule,
      };
      setState({ ...state, approvalSlots: newSlots });
    } else if (currentArea === "implementation") {
      const newSteps = [...state.implementationSteps];
      newSteps[currentIndex] = {
        ...newSteps[currentIndex],
        selectedEmployees: [employee],
      };
      setState({ ...state, implementationSteps: newSteps });
    } else if (currentArea === "reference") {
      const newSteps = [...state.referenceSteps];
      newSteps[currentIndex] = {
        ...newSteps[currentIndex],
        selectedEmployees: [employee],
      };
      setState({ ...state, referenceSteps: newSteps });
    }

    setShowEmployeeModal(false);
    setCurrentIndex(null);
  };

  const handleDepartmentSelect = (department: {
    id: string;
    name: string;
    code: string;
  }) => {
    if (currentIndex === null) return;

    const newSteps = [...state.referenceSteps];
    newSteps[currentIndex] = {
      ...newSteps[currentIndex],
      selectedDepartments: [{ id: department.id, name: department.name }],
      targetDepartmentId: department.id,
    };
    setState({ ...state, referenceSteps: newSteps });

    setShowDepartmentModal(false);
    setCurrentIndex(null);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">결재선 설정</h2>
          <p className="text-sm text-gray-500 mt-1">
            템플릿: {templateName} | 제출 전 수정 가능
          </p>
        </div>

        <ApprovalStepsSection
          agreementSlots={state.agreementSlots}
          approvalSlots={state.approvalSlots}
          implementationSteps={state.implementationSteps}
          referenceSteps={state.referenceSteps}
          loading={loading}
          onUpdateAgreementSlot={handleUpdateAgreementSlot}
          onUpdateApprovalSlot={handleUpdateApprovalSlot}
          onRemoveAgreementSlot={handleRemoveAgreementSlot}
          onRemoveApprovalSlot={handleRemoveApprovalSlot}
          onAddImplementationStep={handleAddImplementationStep}
          onAddReferenceStep={handleAddReferenceStep}
          onUpdateImplementationStep={handleUpdateImplementationStep}
          onUpdateReferenceStep={handleUpdateReferenceStep}
          onRemoveImplementationStep={handleRemoveImplementationStep}
          onRemoveReferenceStep={handleRemoveReferenceStep}
          onOpenEmployeePicker={handleOpenEmployeePicker}
          onOpenDepartmentSelector={handleOpenDepartmentSelector}
        />
      </div>

      {/* 직원 선택 모달 */}
      <EmployeePickerModal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setCurrentIndex(null);
        }}
        onSelect={handleEmployeeSelect}
        selectedEmployeeIds={[]}
      />

      {/* 부서 선택 모달 */}
      <DepartmentSelectorModal
        isOpen={showDepartmentModal}
        onClose={() => {
          setShowDepartmentModal(false);
          setCurrentIndex(null);
        }}
        onSelect={handleDepartmentSelect}
        selectedDepartmentIds={[]}
      />
    </>
  );
}
