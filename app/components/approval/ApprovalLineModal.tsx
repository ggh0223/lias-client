"use client";

import { useState, useEffect } from "react";
import { Text, Surface, Frame } from "lumir-design-system-shared";
import { Button, Field, Checkbox, OptionList } from "lumir-design-system-02";
import type {
  ApprovalLine,
  CreateApprovalLineData,
  ApprovalStepType,
  ApproverType,
  DepartmentScopeType,
} from "../../types/approval";

interface ApprovalLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApprovalLineData) => Promise<void>;
  initialData?: ApprovalLine;
}

// 임시 유저 데이터
const mockUsers = [
  {
    employeeId: "EMP001",
    name: "김철수",
    department: "개발팀",
    position: "팀장",
  },
  {
    employeeId: "EMP002",
    name: "이영희",
    department: "개발팀",
    position: "사원",
  },
  {
    employeeId: "EMP003",
    name: "박민수",
    department: "기획팀",
    position: "팀장",
  },
  {
    employeeId: "EMP004",
    name: "정수진",
    department: "기획팀",
    position: "사원",
  },
  {
    employeeId: "EMP005",
    name: "최동욱",
    department: "디자인팀",
    position: "팀장",
  },
  {
    employeeId: "EMP006",
    name: "한미영",
    department: "디자인팀",
    position: "사원",
  },
  {
    employeeId: "EMP007",
    name: "송태호",
    department: "인사팀",
    position: "팀장",
  },
  {
    employeeId: "EMP008",
    name: "윤서연",
    department: "인사팀",
    position: "사원",
  },
];

const defaultApprovalStep = {
  type: "APPROVAL" as ApprovalStepType,
  order: 1,
  approverType: "USER" as ApproverType,
  approverValue: "",
  isMandatory: true,
  departmentScopeType: "SELECTED" as DepartmentScopeType,
  defaultApproverId: "",
};

export default function ApprovalLineModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ApprovalLineModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CreateApprovalLineData>({
    name: "",
    description: "",
    type: "COMMON",
    formApprovalSteps: [],
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStepTypeDropdowns, setShowStepTypeDropdowns] = useState<boolean[]>(
    []
  );
  const [showApproverTypeDropdowns, setShowApproverTypeDropdowns] = useState<
    boolean[]
  >([]);
  const [showDepartmentScopeDropdowns, setShowDepartmentScopeDropdowns] =
    useState<boolean[]>([]);
  const [showUserDropdowns, setShowUserDropdowns] = useState<boolean[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        type: initialData.type,
        formApprovalSteps: initialData.formApprovalSteps.map((step) => ({
          order: step.order,
          type: step.type,
          approverType: step.approverType,
          approverValue: step.approverValue || "",
          departmentScopeType: step.departmentScopeType || "SELECTED",
          isMandatory: step.isMandatory,
        })),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "COMMON",
        formApprovalSteps: [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const addApprovalStep = (type: ApprovalStepType) => {
    // 단계 수 제한 확인
    const currentStepsOfType = formData.formApprovalSteps.filter(
      (step) => step.type === type
    );
    const maxSteps = type === "EXECUTION" ? 1 : 5;

    if (currentStepsOfType.length >= maxSteps) {
      alert(
        `${
          type === "EXECUTION"
            ? "실행"
            : type === "APPROVAL"
            ? "결재"
            : type === "AGREEMENT"
            ? "합의"
            : "참조"
        } 단계는 최대 ${maxSteps}개까지만 추가할 수 있습니다.`
      );
      return;
    }

    setFormData({
      ...formData,
      formApprovalSteps: [
        ...formData.formApprovalSteps,
        {
          ...defaultApprovalStep,
          order: formData.formApprovalSteps.length + 1,
          type,
        },
      ],
    });
    setShowStepTypeDropdowns([...showStepTypeDropdowns, false]);
    setShowApproverTypeDropdowns([...showApproverTypeDropdowns, false]);
    setShowDepartmentScopeDropdowns([...showDepartmentScopeDropdowns, false]);
    setShowUserDropdowns([...showUserDropdowns, false]);
  };

  const removeApprovalStep = (index: number) => {
    setFormData({
      ...formData,
      formApprovalSteps: formData.formApprovalSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    });
    setShowStepTypeDropdowns(
      showStepTypeDropdowns.filter((_, i) => i !== index)
    );
    setShowApproverTypeDropdowns(
      showApproverTypeDropdowns.filter((_, i) => i !== index)
    );
    setShowDepartmentScopeDropdowns(
      showDepartmentScopeDropdowns.filter((_, i) => i !== index)
    );
    setShowUserDropdowns(showUserDropdowns.filter((_, i) => i !== index));
  };

  const updateApprovalStep = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      formApprovalSteps: formData.formApprovalSteps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedStepIndex(null);
      onClose();
    }
  };

  const handleStepSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const getDepartmentScopeText = (type: string) => {
    switch (type) {
      case "SELECTED":
        return "선택된 부서";
      case "DRAFT_OWNER":
        return "결재 초안 작성자의 부서";
      default:
        return type;
    }
  };

  const getSelectedUserName = (employeeId: string) => {
    const user = mockUsers.find((u) => u.employeeId === employeeId);
    return user ? `${user.name} (${user.department} - ${user.position})` : "";
  };

  if (!isOpen || !mounted) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={handleBackdropClick}
    >
      <Surface
        background="secondary-system01-inverse-rest"
        boxShadow="30"
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl animate-fade-in"
        style={{ position: "relative", zIndex: 100000 }}
      >
        {/* 헤더 */}
        <Frame className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <Text
              variant="title-2"
              weight="bold"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {initialData ? "결재선 수정" : "결재선 생성"}
            </Text>
            <div className="flex items-center gap-2">
              <Button
                variant="transparent"
                colorScheme="secondary"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200"
              >
                <Text variant="body-1" className="text-xl">
                  ✕
                </Text>
              </Button>
            </div>
          </div>
        </Frame>

        {/* 본문 */}
        <Frame className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <div className="mb-6">
              <Text
                variant="heading-3"
                weight="medium"
                className="mb-4 text-slate-800"
              >
                기본 정보
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field
                    label="이름"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="결재선 이름을 입력하세요"
                    variant="outlined"
                    size="md"
                    fieldWidth="fill-width"
                  />
                </div>
                <div className="relative">
                  <Text
                    variant="body-2"
                    weight="medium"
                    className="mb-2 text-slate-700"
                  >
                    타입 <span className="text-red-500">*</span>
                  </Text>
                  <div className="relative">
                    <div
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-white"
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={
                            formData.type ? "text-slate-800" : "text-slate-400"
                          }
                        >
                          {formData.type === "COMMON" ? "공통" : "개인화"}
                        </span>
                        <span className="text-slate-400">▼</span>
                      </div>
                    </div>
                    {showTypeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                        <OptionList
                          type="single-select"
                          selected={formData.type === "COMMON"}
                          onClick={() => {
                            setFormData({ ...formData, type: "COMMON" });
                            setShowTypeDropdown(false);
                          }}
                        >
                          공통
                        </OptionList>
                        <OptionList
                          type="single-select"
                          selected={formData.type === "CUSTOM"}
                          onClick={() => {
                            setFormData({ ...formData, type: "CUSTOM" });
                            setShowTypeDropdown(false);
                          }}
                        >
                          개인화
                        </OptionList>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Field
                  label="설명"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="결재선에 대한 설명을 입력하세요"
                  variant="outlined"
                  size="md"
                  fieldWidth="fill-width"
                />
              </div>
            </div>

            {/* 결재 단계 */}
            <div className="mb-6">
              <Text
                variant="heading-3"
                weight="medium"
                className="mb-4 text-slate-800"
              >
                결재 단계
              </Text>

              {/* 결재 단계 종류 */}
              <div className="space-y-4 mb-6">
                {[
                  {
                    type: "APPROVAL",
                    label: "결재",
                    color: "from-blue-500 to-blue-600",
                    maxSteps: 5,
                  },
                  {
                    type: "AGREEMENT",
                    label: "합의",
                    color: "from-green-500 to-green-600",
                    maxSteps: 5,
                  },
                  {
                    type: "EXECUTION",
                    label: "실행",
                    color: "from-purple-500 to-purple-600",
                    maxSteps: 1,
                  },
                  {
                    type: "REFERENCE",
                    label: "참조",
                    color: "from-gray-500 to-gray-600",
                    maxSteps: 5,
                  },
                ].map((stepType) => {
                  const stepsOfType = formData.formApprovalSteps.filter(
                    (step) => step.type === stepType.type
                  );
                  const canAddMore = stepsOfType.length < stepType.maxSteps;
                  return (
                    <div
                      key={stepType.type}
                      className="bg-slate-50 rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stepType.color} text-white flex items-center justify-center text-sm font-medium `}
                          >
                            {stepType.label}
                          </div>
                          {/* 해당 타입의 단계들이 오른쪽으로 수평 배치 */}
                          {stepsOfType.length > 0 && (
                            <div className="h-10 flex gap-1 ">
                              {stepsOfType.map((step) => {
                                const globalIndex =
                                  formData.formApprovalSteps.findIndex(
                                    (s) => s === step
                                  );
                                return (
                                  <div
                                    key={globalIndex}
                                    className="relative cursor-pointer group flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedStepIndex(globalIndex);
                                    }}
                                  >
                                    <Surface
                                      background="secondary-system01-inverse-rest"
                                      boxShadow="10"
                                      className={`px-2 py-1 rounded-lg border-2 transition-all duration-200 min-w-[100px] ${
                                        selectedStepIndex === globalIndex
                                          ? "border-blue-500 shadow-lg bg-blue-50"
                                          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                          <div
                                            className={`w-6 h-6 rounded-md bg-gradient-to-r ${stepType.color} text-white flex items-center justify-center text-xs font-medium`}
                                          >
                                            {step.order}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <Text
                                              variant="caption-1"
                                              weight="medium"
                                              className={`truncate ${
                                                selectedStepIndex ===
                                                globalIndex
                                                  ? "text-blue-700"
                                                  : "text-slate-800"
                                              }`}
                                            >
                                              {getApproverTypeText(
                                                step.approverType
                                              )}
                                              {step.isMandatory && (
                                                <span className="text-red-500 ml-1">
                                                  *
                                                </span>
                                              )}
                                            </Text>
                                            <Text
                                              variant="caption-2"
                                              color="secondary-system01-2-rest"
                                              className="truncate"
                                            >
                                              {step.approverValue || "미지정"}
                                            </Text>
                                          </div>
                                        </div>
                                        <Button
                                          variant="transparent"
                                          colorScheme="secondary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeApprovalStep(globalIndex);
                                          }}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 w-5 h-5 flex items-center justify-center flex-shrink-0"
                                        >
                                          <span className="text-xs">✕</span>
                                        </Button>
                                      </div>
                                    </Surface>

                                    {/* 선택된 단계의 설정 영역이 바로 아래에 표시 */}
                                    {selectedStepIndex === globalIndex && (
                                      <div
                                        className="absolute top-full left-0 right-0 mt-2 z-20"
                                        onClick={handleStepSettingsClick}
                                      >
                                        <Surface
                                          background="secondary-system01-inverse-rest"
                                          boxShadow="20"
                                          className="p-4 rounded-xl border border-slate-200/50 min-w-[300px] relative"
                                        >
                                          <div className="flex items-center justify-between mb-3">
                                            <Text
                                              variant="heading-3"
                                              weight="medium"
                                              className="text-slate-800"
                                            >
                                              {globalIndex + 1}단계 상세 설정
                                            </Text>
                                            <Button
                                              variant="transparent"
                                              colorScheme="secondary"
                                              onClick={() =>
                                                setSelectedStepIndex(null)
                                              }
                                              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-all duration-200"
                                            >
                                              <span className="text-lg">✕</span>
                                            </Button>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                              <Text
                                                variant="body-2"
                                                weight="medium"
                                                className="mb-2 text-slate-700"
                                              >
                                                결재자 지정 방식{" "}
                                                <span className="text-red-500">
                                                  *
                                                </span>
                                              </Text>
                                              <div className="relative">
                                                <div
                                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-white"
                                                  onClick={() => {
                                                    const newDropdowns = [
                                                      ...showApproverTypeDropdowns,
                                                    ];
                                                    newDropdowns[
                                                      selectedStepIndex
                                                    ] =
                                                      !newDropdowns[
                                                        selectedStepIndex
                                                      ];
                                                    setShowApproverTypeDropdowns(
                                                      newDropdowns
                                                    );
                                                  }}
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-slate-800">
                                                      {getApproverTypeText(
                                                        formData
                                                          .formApprovalSteps[
                                                          selectedStepIndex
                                                        ].approverType
                                                      )}
                                                    </span>
                                                    <span className="text-slate-400">
                                                      ▼
                                                    </span>
                                                  </div>
                                                </div>
                                                {showApproverTypeDropdowns[
                                                  selectedStepIndex
                                                ] && (
                                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                                                    {[
                                                      "USER",
                                                      "DEPARTMENT_POSITION",
                                                      "POSITION",
                                                      "TITLE",
                                                    ].map((type) => (
                                                      <OptionList
                                                        key={type}
                                                        type="single-select"
                                                        selected={
                                                          formData
                                                            .formApprovalSteps[
                                                            selectedStepIndex
                                                          ].approverType ===
                                                          type
                                                        }
                                                        onClick={() => {
                                                          updateApprovalStep(
                                                            selectedStepIndex,
                                                            "approverType",
                                                            type
                                                          );
                                                          const newDropdowns = [
                                                            ...showApproverTypeDropdowns,
                                                          ];
                                                          newDropdowns[
                                                            selectedStepIndex
                                                          ] = false;
                                                          setShowApproverTypeDropdowns(
                                                            newDropdowns
                                                          );
                                                        }}
                                                      >
                                                        {getApproverTypeText(
                                                          type
                                                        )}
                                                      </OptionList>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div>
                                              <Field
                                                label="결재자 지정 값"
                                                required
                                                value={
                                                  formData.formApprovalSteps[
                                                    selectedStepIndex
                                                  ].approverValue
                                                }
                                                onChange={(e) =>
                                                  updateApprovalStep(
                                                    selectedStepIndex,
                                                    "approverValue",
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="결재자 ID 또는 값"
                                                variant="outlined"
                                                size="md"
                                                fieldWidth="fill-width"
                                              />
                                            </div>
                                          </div>

                                          {/* DEPARTMENT_POSITION일 때 DepartmentScopeType 선택 */}
                                          {formData.formApprovalSteps[
                                            selectedStepIndex
                                          ].approverType ===
                                            "DEPARTMENT_POSITION" && (
                                            <div className="mt-4">
                                              <div className="relative">
                                                <Text
                                                  variant="body-2"
                                                  weight="medium"
                                                  className="mb-2 text-slate-700"
                                                >
                                                  부서 범위{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </Text>
                                                <div className="relative">
                                                  <div
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-white"
                                                    onClick={() => {
                                                      const newDropdowns = [
                                                        ...showDepartmentScopeDropdowns,
                                                      ];
                                                      newDropdowns[
                                                        selectedStepIndex
                                                      ] =
                                                        !newDropdowns[
                                                          selectedStepIndex
                                                        ];
                                                      setShowDepartmentScopeDropdowns(
                                                        newDropdowns
                                                      );
                                                    }}
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <span className="text-slate-800">
                                                        {getDepartmentScopeText(
                                                          formData
                                                            .formApprovalSteps[
                                                            selectedStepIndex
                                                          ]
                                                            .departmentScopeType ||
                                                            "SELECTED"
                                                        )}
                                                      </span>
                                                      <span className="text-slate-400">
                                                        ▼
                                                      </span>
                                                    </div>
                                                  </div>
                                                  {showDepartmentScopeDropdowns[
                                                    selectedStepIndex
                                                  ] && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                                                      {[
                                                        "SELECTED",
                                                        "DRAFT_OWNER",
                                                      ].map((type) => (
                                                        <OptionList
                                                          key={type}
                                                          type="single-select"
                                                          selected={
                                                            formData
                                                              .formApprovalSteps[
                                                              selectedStepIndex
                                                            ]
                                                              .departmentScopeType ===
                                                            type
                                                          }
                                                          onClick={() => {
                                                            updateApprovalStep(
                                                              selectedStepIndex,
                                                              "departmentScopeType",
                                                              type
                                                            );
                                                            const newDropdowns =
                                                              [
                                                                ...showDepartmentScopeDropdowns,
                                                              ];
                                                            newDropdowns[
                                                              selectedStepIndex
                                                            ] = false;
                                                            setShowDepartmentScopeDropdowns(
                                                              newDropdowns
                                                            );
                                                          }}
                                                        >
                                                          {getDepartmentScopeText(
                                                            type
                                                          )}
                                                        </OptionList>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* USER일 때 유저 선택 */}
                                          {formData.formApprovalSteps[
                                            selectedStepIndex
                                          ].approverType === "USER" && (
                                            <div className="mt-4">
                                              <div className="relative">
                                                <Text
                                                  variant="body-2"
                                                  weight="medium"
                                                  className="mb-2 text-slate-700"
                                                >
                                                  기본 결재자{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </Text>
                                                <div className="relative">
                                                  <div
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-white"
                                                    onClick={() => {
                                                      const newDropdowns = [
                                                        ...showUserDropdowns,
                                                      ];
                                                      newDropdowns[
                                                        selectedStepIndex
                                                      ] =
                                                        !newDropdowns[
                                                          selectedStepIndex
                                                        ];
                                                      setShowUserDropdowns(
                                                        newDropdowns
                                                      );
                                                    }}
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <span
                                                        className={
                                                          formData
                                                            .formApprovalSteps[
                                                            selectedStepIndex
                                                          ].defaultApproverId
                                                            ? "text-slate-800"
                                                            : "text-slate-400"
                                                        }
                                                      >
                                                        {formData
                                                          .formApprovalSteps[
                                                          selectedStepIndex
                                                        ].defaultApproverId
                                                          ? getSelectedUserName(
                                                              formData
                                                                .formApprovalSteps[
                                                                selectedStepIndex
                                                              ]
                                                                .defaultApproverId
                                                            )
                                                          : "결재자를 선택하세요"}
                                                      </span>
                                                      <span className="text-slate-400">
                                                        ▼
                                                      </span>
                                                    </div>
                                                  </div>
                                                  {showUserDropdowns[
                                                    selectedStepIndex
                                                  ] && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                                      {mockUsers.map((user) => (
                                                        <OptionList
                                                          key={user.employeeId}
                                                          type="single-select"
                                                          selected={
                                                            formData
                                                              .formApprovalSteps[
                                                              selectedStepIndex
                                                            ]
                                                              .defaultApproverId ===
                                                            user.employeeId
                                                          }
                                                          onClick={() => {
                                                            updateApprovalStep(
                                                              selectedStepIndex,
                                                              "defaultApproverId",
                                                              user.employeeId
                                                            );
                                                            const newDropdowns =
                                                              [
                                                                ...showUserDropdowns,
                                                              ];
                                                            newDropdowns[
                                                              selectedStepIndex
                                                            ] = false;
                                                            setShowUserDropdowns(
                                                              newDropdowns
                                                            );
                                                          }}
                                                        >
                                                          {user.name} (
                                                          {user.department} -{" "}
                                                          {user.position})
                                                        </OptionList>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          <div className="mt-4 flex items-center">
                                            <Checkbox
                                              checked={
                                                formData.formApprovalSteps[
                                                  selectedStepIndex
                                                ].isMandatory
                                              }
                                              onChange={(checked) =>
                                                updateApprovalStep(
                                                  selectedStepIndex,
                                                  "isMandatory",
                                                  checked
                                                )
                                              }
                                              label="필수 결재 단계"
                                              showLabel={true}
                                            />
                                          </div>
                                        </Surface>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="filled"
                          colorScheme="primary"
                          onClick={() =>
                            addApprovalStep(stepType.type as ApprovalStepType)
                          }
                          disabled={!canAddMore}
                          className={`bg-gradient-to-r ${
                            stepType.color
                          } hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 ${
                            !canAddMore ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1 px-2">
                            <span className="text-sm">+</span>
                            {/* <span className="text-sm">추가</span> */}
                          </div>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50">
              <Button
                variant="transparent"
                colorScheme="secondary"
                onClick={onClose}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                취소
              </Button>
              <Button
                variant="filled"
                colorScheme="primary"
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {initialData ? "수정" : "생성"}
              </Button>
            </div>
          </form>
        </Frame>
      </Surface>
    </div>
  );
}
