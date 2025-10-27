"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type { Employee } from "@/types/metadata";
import type {
  ApprovalLineTemplate,
  TemplateVersionDetail,
  ApprovalStepTemplate,
  AssigneeRule,
} from "@/types/approval-flow";
import ApprovalStepsSection, {
  type StepSlot,
  type MultiStep,
} from "../../../new/sections/approval-steps-section";
import VersionInfoPanel from "./components/version-info-panel";
import EmployeePickerModal from "../../../new/components/employee-picker-modal";
import DepartmentSelectorModal from "../../../new/components/department-selector-modal";

interface NewVersionClientProps {
  template: ApprovalLineTemplate;
  currentVersion: TemplateVersionDetail | null;
}

export default function NewVersionClient({
  template,
  currentVersion,
}: NewVersionClientProps) {
  const router = useRouter();

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

  const [versionNote, setVersionNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [currentArea, setCurrentArea] = useState<
    "agreement" | "approval" | "implementation" | "reference"
  >("agreement");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // 기존 버전의 단계 정보를 초기값으로 설정
  useEffect(() => {
    if (currentVersion && currentVersion.steps) {
      // 합의 단계 초기화 (5칸)
      const agreementSteps = currentVersion.steps.filter(
        (s) => s.stepType === "AGREEMENT"
      );
      const initialAgreementSlots: StepSlot[] = Array.from(
        { length: 5 },
        (_, i) => {
          const step = agreementSteps[i];
          if (step) {
            return {
              id: `agreement-${i}`,
              assigneeRule: step.assigneeRule,
              isRequired: step.isRequired || false,
              isEmpty: false,
              needsSelection: false,
              targetEmployeeId: step.targetEmployeeId,
              selectedEmployee: step.defaultApprover
                ? {
                    id: step.defaultApprover.id,
                    employeeNumber: step.defaultApprover.employeeNumber,
                    name: step.defaultApprover.name,
                    email: step.defaultApprover.email,
                    phoneNumber: step.defaultApprover.phoneNumber || "",
                    status: "Active" as const,
                    hireDate: new Date().toISOString(),
                    departments: [],
                  }
                : undefined,
            };
          } else {
            return {
              id: `agreement-${i}`,
              assigneeRule: "DRAFTER" as AssigneeRule,
              isRequired: false,
              isEmpty: true,
              needsSelection: false,
            };
          }
        }
      );
      setAgreementSlots(initialAgreementSlots);

      // 결재 단계 초기화 (5칸)
      const approvalSteps = currentVersion.steps.filter(
        (s) => s.stepType === "APPROVAL"
      );
      const initialApprovalSlots: StepSlot[] = Array.from(
        { length: 5 },
        (_, i) => {
          const step = approvalSteps[i];
          if (step) {
            return {
              id: `approval-${i}`,
              assigneeRule: step.assigneeRule,
              isRequired: step.isRequired || false,
              isEmpty: false,
              needsSelection: false,
              targetEmployeeId: step.targetEmployeeId,
              selectedEmployee: step.defaultApprover
                ? {
                    id: step.defaultApprover.id,
                    employeeNumber: step.defaultApprover.employeeNumber,
                    name: step.defaultApprover.name,
                    email: step.defaultApprover.email,
                    phoneNumber: step.defaultApprover.phoneNumber || "",
                    status: "Active" as const,
                    hireDate: new Date().toISOString(),
                    departments: [],
                  }
                : undefined,
            };
          } else {
            return {
              id: `approval-${i}`,
              assigneeRule: "DRAFTER" as AssigneeRule,
              isRequired: false,
              isEmpty: true,
              needsSelection: false,
            };
          }
        }
      );
      setApprovalSlots(initialApprovalSlots);

      // 시행 단계 초기화
      const implementationStepsData = currentVersion.steps
        .filter((s) => s.stepType === "IMPLEMENTATION")
        .map((step) => ({
          id: step.id || `implementation-${Date.now()}-${Math.random()}`,
          stepType: "IMPLEMENTATION" as const,
          assigneeRule: step.assigneeRule,
          isRequired: step.isRequired || false,
          selectedEmployees: step.defaultApprover
            ? [
                {
                  id: step.defaultApprover.id,
                  employeeNumber: step.defaultApprover.employeeNumber,
                  name: step.defaultApprover.name,
                  email: step.defaultApprover.email,
                  phoneNumber: step.defaultApprover.phoneNumber || "",
                  status: "Active" as const,
                  hireDate: new Date().toISOString(),
                  departments: [],
                },
              ]
            : [],
        }));
      setImplementationSteps(implementationStepsData);

      // 참조 단계 초기화
      const referenceStepsData = currentVersion.steps
        .filter((s) => s.stepType === "REFERENCE")
        .map((step) => ({
          id: step.id || `reference-${Date.now()}-${Math.random()}`,
          stepType: "REFERENCE" as const,
          assigneeRule: step.assigneeRule,
          isRequired: step.isRequired || false,
          selectedEmployees: step.defaultApprover
            ? [
                {
                  id: step.defaultApprover.id,
                  employeeNumber: step.defaultApprover.employeeNumber,
                  name: step.defaultApprover.name,
                  email: step.defaultApprover.email,
                  phoneNumber: step.defaultApprover.phoneNumber || "",
                  status: "Active" as const,
                  hireDate: new Date().toISOString(),
                  departments: [],
                },
              ]
            : [],
          selectedDepartments: step.targetDepartment
            ? [
                {
                  id: step.targetDepartment.id,
                  name: step.targetDepartment.departmentName,
                  code: step.targetDepartment.departmentCode,
                },
              ]
            : [],
        }));
      setReferenceSteps(referenceStepsData);
    }
  }, [currentVersion]);

  // new-approval-line-client.tsx에서 가져온 핸들러들
  const handleUpdateAgreementSlot = (
    index: number,
    field: keyof StepSlot,
    value: unknown
  ) => {
    const newSlots = [...agreementSlots];
    if (field === "assigneeRule") {
      newSlots[index].assigneeRule = value as StepSlot["assigneeRule"];
      const assigneeRule = value as string;
      newSlots[index].needsSelection = assigneeRule === "FIXED";
      newSlots[index].isEmpty = false;
    } else if (field === "isRequired") {
      newSlots[index].isRequired = value as StepSlot["isRequired"];
    } else if (field === "isEmpty") {
      newSlots[index].isEmpty = value as StepSlot["isEmpty"];
    } else if (field === "needsSelection") {
      newSlots[index].needsSelection = value as StepSlot["needsSelection"];
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
      newSlots[index].needsSelection = assigneeRule === "FIXED";
      newSlots[index].isEmpty = false;
    } else if (field === "isRequired") {
      newSlots[index].isRequired = value as StepSlot["isRequired"];
    } else if (field === "isEmpty") {
      newSlots[index].isEmpty = value as StepSlot["isEmpty"];
    } else if (field === "needsSelection") {
      newSlots[index].needsSelection = value as StepSlot["needsSelection"];
    }
    setApprovalSlots(newSlots);
  };

  const handleRemoveAgreementSlot = (index: number) => {
    const newSlots = [...agreementSlots];
    newSlots[index] = {
      id: `agreement-${index}`,
      assigneeRule: "DRAFTER" as AssigneeRule,
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    const filledSlots: StepSlot[] = [];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i].isEmpty) {
        filledSlots.push(newSlots[i]);
      }
    }
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
    newSlots[index] = {
      id: `approval-${index}`,
      assigneeRule: "DRAFTER" as AssigneeRule,
      isRequired: false,
      isEmpty: true,
      needsSelection: false,
    };
    const filledSlots: StepSlot[] = [];
    for (let i = 0; i < newSlots.length; i++) {
      if (!newSlots[i].isEmpty) {
        filledSlots.push(newSlots[i]);
      }
    }
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
      newSteps[currentIndex].selectedEmployees = [employee];
      setImplementationSteps(newSteps);
    } else if (currentArea === "reference") {
      const newSteps = [...referenceSteps];
      newSteps[currentIndex].selectedEmployees = [employee];
      setReferenceSteps(newSteps);
    }

    setShowEmployeeModal(false);
    setCurrentIndex(null);
  };

  const handleDepartmentSelect = (department: {
    id: string;
    name: string;
    code: string;
    employeeCount?: number;
  }) => {
    if (currentIndex === null) return;
    const newSteps = [...referenceSteps];
    newSteps[currentIndex].selectedDepartments = [department];
    setReferenceSteps(newSteps);

    setShowDepartmentModal(false);
    setCurrentIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const hasAgreement = agreementSlots.some((slot) => !slot.isEmpty);
    const hasApproval = approvalSlots.some((slot) => !slot.isEmpty);

    if (!hasAgreement && !hasApproval && implementationSteps.length === 0) {
      setError("최소 1개 이상의 결재 단계가 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        setError("인증 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      const stepsToSubmit: ApprovalStepTemplate[] = [];

      // 합의 단계
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

      await apiClient.createApprovalLineTemplateVersion(token, template.id, {
        versionNote: versionNote || undefined,
        steps: stepsToSubmit,
      });

      router.push(`/admin/approval-lines/${template.id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "결재선 템플릿 버전 생성에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          결재선 템플릿 새 버전 생성
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          &quot;{template.name}&quot; 템플릿의 새 버전을 생성합니다.
        </p>
      </div>

      <VersionInfoPanel template={template} currentVersion={currentVersion} />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            버전 변경 사유
          </label>
          <textarea
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="이 버전의 변경 사유를 입력하세요"
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
            disabled={loading}
          />
        </div>

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

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "생성 중..." : "생성하기"}
          </button>
        </div>
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
                (d: { id: string }) => d.id
              ) || []
            : []
        }
      />
    </div>
  );
}
