"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { Employee } from "@/types/metadata";
import type {
  ApprovalLineType,
  OrgScope,
  ApprovalStepTemplate,
  AssigneeRule,
} from "@/types/approval-flow";
import BasicInfoSection from "./sections/basic-info-section";
import ApprovalStepsSection, {
  type StepSlot,
  type MultiStep,
} from "./sections/approval-steps-section";
import SubmitActionWidget from "./widgets/submit-action-widget";
import EmployeePickerModal from "./components/employee-picker-modal";
import DepartmentSelectorModal from "./components/department-selector-modal";

interface NewApprovalLineClientProps {
  token: string;
}

export default function NewApprovalLineClient({
  token,
}: NewApprovalLineClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ApprovalLineType>("COMMON");
  const [orgScope, setOrgScope] = useState<OrgScope>("ALL");
  const [departmentId, setDepartmentId] = useState("");

  // 합의/결재는 각각 5칸 고정
  const [agreementSlots, setAgreementSlots] = useState<StepSlot[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: `agreement-${i}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    }))
  );

  const [approvalSlots, setApprovalSlots] = useState<StepSlot[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: `approval-${i}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    }))
  );

  // 시행/참조는 동적으로 추가
  const [implementationSteps, setImplementationSteps] = useState<MultiStep[]>(
    []
  );
  const [referenceSteps, setReferenceSteps] = useState<MultiStep[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [currentArea, setCurrentArea] = useState<
    "agreement" | "approval" | "implementation" | "reference"
  >("agreement");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // 합의/결재 칸 업데이트
  const handleUpdateAgreementSlot = (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => {
    const newSlots = [...agreementSlots];
    if (field === "assigneeRule") {
      newSlots[index].assigneeRule = value as StepSlot["assigneeRule"];
      const assigneeRule = value as string;
      // FIXED일 때만 직원 선택 필요
      newSlots[index].needsSelection = assigneeRule === "FIXED";
      newSlots[index].isEmpty = false;
    } else if (field === "isRequired") {
      newSlots[index].isRequired = value as StepSlot["isRequired"];
    } else if (field === "isEmpty") {
      newSlots[index].isEmpty = value as StepSlot["isEmpty"];
    } else if (field === "needsSelection") {
      newSlots[index].needsSelection = value as StepSlot["needsSelection"];
    } else if (field === "selectedEmployee") {
      newSlots[index].selectedEmployee = value as StepSlot["selectedEmployee"];
    } else if (field === "targetEmployeeId") {
      newSlots[index].targetEmployeeId = value as StepSlot["targetEmployeeId"];
    }
    setAgreementSlots(newSlots);
  };

  const handleUpdateApprovalSlot = (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => {
    const newSlots = [...approvalSlots];
    if (field === "assigneeRule") {
      newSlots[index].assigneeRule = value as StepSlot["assigneeRule"];
      const assigneeRule = value as string;
      // FIXED일 때만 직원 선택 필요
      newSlots[index].needsSelection = assigneeRule === "FIXED";
      newSlots[index].isEmpty = false;
    } else if (field === "isRequired") {
      newSlots[index].isRequired = value as StepSlot["isRequired"];
    } else if (field === "isEmpty") {
      newSlots[index].isEmpty = value as StepSlot["isEmpty"];
    } else if (field === "needsSelection") {
      newSlots[index].needsSelection = value as StepSlot["needsSelection"];
    } else if (field === "selectedEmployee") {
      newSlots[index].selectedEmployee = value as StepSlot["selectedEmployee"];
    } else if (field === "targetEmployeeId") {
      newSlots[index].targetEmployeeId = value as StepSlot["targetEmployeeId"];
    }
    setApprovalSlots(newSlots);
  };

  // 슬롯 삭제 핸들러 (오른쪽 단계들을 왼쪽으로 이동)
  const handleRemoveAgreementSlot = (index: number) => {
    const newSlots = [...agreementSlots];
    // 해당 슬롯 초기화
    newSlots[index] = {
      id: `agreement-${index}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    // 오른쪽 슬롯들을 왼쪽으로 이동 (빈 슬롯 제외)
    const filledSlots: StepSlot[] = [];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i].isEmpty) {
        filledSlots.push(newSlots[i]);
      }
    }
    // 정렬된 슬롯들로 다시 채우기
    const sortedSlots: StepSlot[] = Array.from({ length: 5 }, (_, i) =>
      i < filledSlots.length
        ? filledSlots[i]
        : {
            id: `agreement-${i}`,
            assigneeRule: "DRAFTER" as AssigneeRule,
            isRequired: false,
            isEmpty: true,
            needsSelection: false,
          }
    );
    setAgreementSlots(sortedSlots);
  };

  const handleRemoveApprovalSlot = (index: number) => {
    const newSlots = [...approvalSlots];
    // 해당 슬롯 초기화
    newSlots[index] = {
      id: `approval-${index}`,
      assigneeRule: "DRAFTER",
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    // 오른쪽 슬롯들을 왼쪽으로 이동 (빈 슬롯 제외)
    const filledSlots: StepSlot[] = [];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i].isEmpty) {
        filledSlots.push(newSlots[i]);
      }
    }
    // 정렬된 슬롯들로 다시 채우기
    const sortedSlots: StepSlot[] = Array.from({ length: 5 }, (_, i) =>
      i < filledSlots.length
        ? filledSlots[i]
        : {
            id: `approval-${i}`,
            assigneeRule: "DRAFTER" as AssigneeRule,
            isRequired: false,
            isEmpty: true,
            needsSelection: false,
          }
    );
    setApprovalSlots(sortedSlots);
  };

  const handleAddImplementationStep = () => {
    const newStep: MultiStep = {
      id: `implementation-${Date.now()}`,
      stepType: "IMPLEMENTATION",
      assigneeRule: "FIXED",
      isRequired: false,
      selectedEmployees: [],
    };
    setImplementationSteps([...implementationSteps, newStep]);
  };

  const handleAddReferenceStep = () => {
    const newStep: MultiStep = {
      id: `reference-${Date.now()}`,
      stepType: "REFERENCE",
      assigneeRule: "FIXED",
      isRequired: false,
      selectedEmployees: [],
      selectedDepartments: [],
    };
    setReferenceSteps([...referenceSteps, newStep]);
  };

  const handleRemoveImplementationStep = (index: number) => {
    setImplementationSteps(implementationSteps.filter((_, i) => i !== index));
  };

  const handleRemoveReferenceStep = (index: number) => {
    setReferenceSteps(referenceSteps.filter((_, i) => i !== index));
  };

  const handleUpdateImplementationStep = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newSteps = [...implementationSteps];
    if (field === "assigneeRule") {
      newSteps[index] = {
        ...newSteps[index],
        assigneeRule: value as AssigneeRule,
        needsSelection: value === "FIXED",
        // 규칙 변경 시 이전 선택 초기화
        selectedEmployees: [],
      };
    }
    setImplementationSteps(newSteps);
  };

  const handleUpdateReferenceStep = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const newSteps = [...referenceSteps];
    if (field === "assigneeRule") {
      newSteps[index] = {
        ...newSteps[index],
        assigneeRule: value as AssigneeRule,
        needsSelection: value === "FIXED" || value === "DEPARTMENT_REFERENCE",
        // 규칙 변경 시 이전 선택 초기화
        selectedEmployees: [],
        selectedDepartments: [],
      };
    }
    setReferenceSteps(newSteps);
  };

  const handleOpenEmployeePicker = (
    area: "agreement" | "approval" | "implementation" | "reference",
    index: number
  ) => {
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
      const newSlots = [...agreementSlots];
      newSlots[currentIndex].selectedEmployee = employee;
      newSlots[currentIndex].targetEmployeeId = employee.id;
      newSlots[currentIndex].isEmpty = false;
      newSlots[currentIndex].needsSelection = false;
      setAgreementSlots(newSlots);
    } else if (currentArea === "approval") {
      const newSlots = [...approvalSlots];
      newSlots[currentIndex].selectedEmployee = employee;
      newSlots[currentIndex].targetEmployeeId = employee.id;
      newSlots[currentIndex].isEmpty = false;
      newSlots[currentIndex].needsSelection = false;
      setApprovalSlots(newSlots);
    } else if (currentArea === "implementation") {
      const newSteps = [...implementationSteps];
      // 하나의 직원만 할당
      newSteps[currentIndex].selectedEmployees = [employee];
      setImplementationSteps(newSteps);
    } else if (currentArea === "reference") {
      const newSteps = [...referenceSteps];
      // 하나의 직원만 할당
      newSteps[currentIndex].selectedEmployees = [employee];
      setReferenceSteps(newSteps);
    }

    setShowEmployeeModal(false);
    setCurrentIndex(null);
  };

  const handleDepartmentSelect = (department: {
    id: string;
    name: string;
    employeeCount?: number;
  }) => {
    if (currentIndex === null) return;
    const newSteps = [...referenceSteps];
    // 하나의 부서만 할당
    newSteps[currentIndex].selectedDepartments = [department];
    setReferenceSteps(newSteps);

    setShowDepartmentModal(false);
    setCurrentIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("템플릿 이름을 입력해주세요.");
      return;
    }

    // 유효한 합의/결재 단계가 있는지 확인
    const hasAgreement = agreementSlots.some((slot) => !slot.isEmpty);
    const hasApproval = approvalSlots.some((slot) => !slot.isEmpty);

    if (!hasAgreement && !hasApproval && implementationSteps.length === 0) {
      setError("최소 1개 이상의 결재 단계가 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      // API 스펙에 맞게 스텝 변환
      const stepsToSubmit: ApprovalStepTemplate[] = [];

      // 합의 단계 (왼쪽부터 순서대로)
      agreementSlots.forEach((slot) => {
        if (!slot.isEmpty) {
          stepsToSubmit.push({
            stepOrder: stepsToSubmit.length + 1,
            stepType: "AGREEMENT",
            assigneeRule: slot.assigneeRule,
            targetEmployeeId: slot.targetEmployeeId,
            isRequired: slot.isRequired,
          });
        }
      });

      // 결재 단계
      approvalSlots.forEach((slot) => {
        if (!slot.isEmpty) {
          stepsToSubmit.push({
            stepOrder: stepsToSubmit.length + 1,
            stepType: "APPROVAL",
            assigneeRule: slot.assigneeRule,
            targetEmployeeId: slot.targetEmployeeId,
            isRequired: slot.isRequired,
          });
        }
      });

      // 시행 단계
      implementationSteps.forEach((step) => {
        stepsToSubmit.push({
          stepOrder: stepsToSubmit.length + 1,
          stepType: "IMPLEMENTATION",
          assigneeRule: step.assigneeRule,
          targetEmployeeId:
            step.selectedEmployees && step.selectedEmployees.length > 0
              ? step.selectedEmployees[0].id
              : undefined,
          isRequired: step.isRequired,
        });
      });

      // 참조 단계
      referenceSteps.forEach((step) => {
        stepsToSubmit.push({
          stepOrder: stepsToSubmit.length + 1,
          stepType: "REFERENCE",
          assigneeRule: step.assigneeRule,
          targetEmployeeId:
            step.selectedEmployees && step.selectedEmployees.length > 0
              ? step.selectedEmployees[0].id
              : undefined,
          targetDepartmentId:
            step.selectedDepartments && step.selectedDepartments.length > 0
              ? step.selectedDepartments[0].id
              : undefined,
          isRequired: step.isRequired,
        });
      });

      await apiClient.createApprovalLineTemplate(token, {
        name,
        description,
        type,
        orgScope,
        departmentId:
          orgScope === "SPECIFIC_DEPARTMENT" ? departmentId : undefined,
        steps: stepsToSubmit,
      });

      router.push("/admin/approval-lines");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "결재선 템플릿 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          새로운 결재선 템플릿 생성
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          완전히 새로운 결재선 템플릿을 생성합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <BasicInfoSection
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
          type={type}
          onTypeChange={setType}
          orgScope={orgScope}
          onOrgScopeChange={setOrgScope}
          departmentId={departmentId}
          onDepartmentIdChange={setDepartmentId}
          loading={loading}
        />

        <ApprovalStepsSection
          agreementSlots={agreementSlots}
          approvalSlots={approvalSlots}
          implementationSteps={implementationSteps}
          referenceSteps={referenceSteps}
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

        <SubmitActionWidget
          loading={loading}
          error={error}
          onCancel={() => router.back()}
        />
      </form>

      {/* 직원 선택 모달 */}
      <EmployeePickerModal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setCurrentIndex(null);
        }}
        onSelect={handleEmployeeSelect}
        selectedEmployeeIds={
          currentIndex !== null && currentArea === "agreement"
            ? ([agreementSlots[currentIndex]?.targetEmployeeId].filter(
                Boolean
              ) as string[])
            : currentIndex !== null && currentArea === "approval"
            ? ([approvalSlots[currentIndex]?.targetEmployeeId].filter(
                Boolean
              ) as string[])
            : []
        }
      />

      {/* 부서 선택 모달 */}
      <DepartmentSelectorModal
        isOpen={showDepartmentModal}
        onClose={() => {
          setShowDepartmentModal(false);
          setCurrentIndex(null);
        }}
        onSelect={handleDepartmentSelect}
        selectedDepartmentIds={
          currentIndex !== null
            ? referenceSteps[currentIndex]?.selectedDepartments?.map(
                (d) => d.id
              ) || []
            : []
        }
      />
    </div>
  );
}
