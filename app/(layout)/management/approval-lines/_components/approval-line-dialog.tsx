"use client";

import React, { useState, useEffect } from "react";
import {
  FormApprovalLine,
  UpdateFormApprovalLineRequest,
  ApprovalStepType,
} from "../../../_lib/api/document-api";
import { EmployeeSelectorModal } from "../../../_components/employee-selector-modal";
import {
  Employee,
  getMetadataApi,
  DepartmentWithEmployees,
  Department,
} from "@/app/(layout)/_lib/api/metadata-api";
import Dialog from "@/app/(layout)/_components/dialog";

interface ApprovalLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  onSubmit?: (data: any) => void;
  onDelete?: () => void;
  approvalLine?: FormApprovalLine | null;
}

type StepType = "AGREEMENT" | "APPROVAL" | "REFERENCE" | "IMPLEMENTATION";
const stepTabs: { key: StepType; label: string }[] = [
  { key: "AGREEMENT", label: "합의" },
  { key: "APPROVAL", label: "결재" },
  { key: "REFERENCE", label: "수신참조" },
  { key: "IMPLEMENTATION", label: "시행" },
];

// 조직도 트리 재귀 컴포넌트 (childrenMap 활용)
const OrganizationTree: React.FC<{
  departments: Department[];
  selectedId?: string;
  onSelect: (id: string) => void;
  childrenMap: Record<string, DepartmentWithEmployees[]>;
}> = ({ departments, selectedId, onSelect, childrenMap }) => (
  <ul className="pl-2">
    {departments.map((dept) => (
      <li key={dept.departmentId}>
        <div
          className={`cursor-pointer px-1 py-0.5 rounded text-sm ${
            selectedId === dept.departmentId
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-primary/5"
          }`}
          onClick={() => onSelect(dept.departmentId)}
        >
          {dept.departmentName}
        </div>
        {childrenMap[dept.departmentId]?.length > 0 && (
          <OrganizationTree
            departments={childrenMap[dept.departmentId].map(
              (d) => d.department
            )}
            selectedId={selectedId}
            onSelect={onSelect}
            childrenMap={childrenMap}
          />
        )}
      </li>
    ))}
  </ul>
);

// 선택된 부서의 모든 하위 employees까지 포함하는 함수
function collectEmployees(
  deptWithEmp: DepartmentWithEmployees,
  orgData: DepartmentWithEmployees[]
): Employee[] {
  let result = [...deptWithEmp.employees];
  if (deptWithEmp.department.childrenDepartments) {
    for (const child of deptWithEmp.department.childrenDepartments) {
      const found = orgData.find(
        (d) => d.department.departmentId === child.department.departmentId
      );
      if (found) {
        result = result.concat(collectEmployees(found, orgData));
      }
    }
  }
  return result;
}

// 선택된 부서(DepartmentWithEmployees)를 트리에서 재귀적으로 찾는 함수
function findDeptWithEmployees(
  deptId: string,
  nodes: DepartmentWithEmployees[]
): DepartmentWithEmployees | undefined {
  for (const node of nodes) {
    if (node.department.departmentId === deptId) return node;
    if (node.department.childrenDepartments?.length) {
      const found = findDeptWithEmployees(
        deptId,
        node.department.childrenDepartments
      );
      if (found) return found;
    }
  }
  return undefined;
}

const ApprovalLineDialog: React.FC<ApprovalLineDialogProps> = ({
  isOpen,
  onClose,
  mode,
  onSubmit,
  onDelete,
  approvalLine,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: "COMMON" | "CUSTOM";
    formApprovalSteps: ApprovalStepType[];
  }>({
    name: "",
    description: "",
    type: "COMMON",
    formApprovalSteps: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeSelectorOpen, setEmployeeSelectorOpen] = useState(false);
  const [addingApproverType, setAddingApproverType] =
    useState<ApprovalStepType | null>(null);

  // 부서+직원 데이터
  const [orgData, setOrgData] = useState<DepartmentWithEmployees[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  // 중앙 탭 상태
  const [currentTab, setCurrentTab] = useState<StepType>("APPROVAL");
  // 체크된 직원 ID 목록
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  // 각 탭별 인원 목록
  const [stepMembers, setStepMembers] = useState<Record<StepType, Employee[]>>({
    AGREEMENT: [],
    APPROVAL: [],
    REFERENCE: [],
    IMPLEMENTATION: [],
  });

  // 직원 목록: 선택된 부서의 직원 + 검색
  const employees: Employee[] = React.useMemo(() => {
    if (!selectedDeptId) return [];
    const dept = findDeptWithEmployees(selectedDeptId, orgData);
    if (!dept) return [];
    return collectEmployees(dept, orgData).filter((emp) =>
      emp.name.includes(search)
    );
  }, [orgData, selectedDeptId, search]);

  // childrenMap 생성
  const childrenMap = React.useMemo(() => {
    const map: Record<string, DepartmentWithEmployees[]> = {};
    function traverse(deptWithEmp: DepartmentWithEmployees) {
      const { department } = deptWithEmp;
      if (!map[department.parentDepartmentId])
        map[department.parentDepartmentId] = [];
      map[department.parentDepartmentId].push(deptWithEmp);
      if (department.childrenDepartments) {
        department.childrenDepartments.forEach(traverse);
      }
    }
    orgData.forEach(traverse);
    return map;
  }, [orgData]);

  // 최상위 부서 추출
  const rootDepartments: Department[] = React.useMemo(
    () => orgData.map((d) => d.department),
    [orgData]
  );

  // 수정 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (mode === "edit" && approvalLine) {
      setFormData({
        name: approvalLine.name,
        description: approvalLine.description,
        type: approvalLine.type,
        formApprovalSteps: approvalLine.formApprovalSteps
          .map((step) => step.type)
          .sort((a, b) => a.localeCompare(b)),
      });
    } else {
      // 생성 모드일 때 폼 초기화
      setFormData({
        name: "",
        description: "",
        type: "COMMON",
        formApprovalSteps: [],
      });
    }
  }, [mode, approvalLine, isOpen]);

  // 데이터 로딩
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getMetadataApi()
      .then((data) => {
        console.log(data);
        setOrgData(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("결재라인 이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API 요청용 데이터로 변환
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        formApprovalSteps: formData.formApprovalSteps.map((step) => ({
          type: step,
        })),
      };

      if (mode === "edit" && approvalLine) {
        const updateData: UpdateFormApprovalLineRequest = {
          ...apiData,
          formApprovalLineId: approvalLine.formApprovalLineId,
        };
        await onSubmit?.(updateData);
      } else {
        await onSubmit?.(apiData);
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addApprover = (type: ApprovalStepType) => {
    setAddingApproverType(type);
    setEmployeeSelectorOpen(true);
  };

  const removeApprover = (index: number) => {
    setFormData((prev) => {
      const removedStep = prev.formApprovalSteps[index];
      const remainingSteps = prev.formApprovalSteps.filter(
        (_, i) => i !== index
      );

      // 삭제된 단계와 같은 타입의 단계들만 재정렬
      const reorderedSteps = remainingSteps.map((step) => {
        if (step === removedStep) {
          const sameTypeSteps = remainingSteps.filter((s) => s === step);
          const newOrder = sameTypeSteps.findIndex((s) => s === step) + 1;
          return step;
        }
        return step;
      });

      return {
        ...prev,
        formApprovalSteps: reorderedSteps,
      };
    });
  };

  const handleEmployeeSelect = (selectedEmployees: Employee[]) => {
    if (addingApproverType && selectedEmployees.length > 0) {
      // 새로운 결재자들을 추가
      const newSteps: ApprovalStepType[] = selectedEmployees.map(
        (employee) => employee.type
      );

      setFormData((prev) => ({
        ...prev,
        formApprovalSteps: [...prev.formApprovalSteps, ...newSteps],
      }));
    }
    setEmployeeSelectorOpen(false);
    setAddingApproverType(null);
  };

  // 체크박스 핸들러
  const handleCheck = (id: string, checked: boolean) => {
    setCheckedIds((prev) =>
      checked ? [...prev, id] : prev.filter((v) => v !== id)
    );
  };

  // 직원 추가 핸들러
  const handleAdd = () => {
    const selected = employees.filter((emp) =>
      checkedIds.includes(emp.employeeId)
    );
    setStepMembers((prev) => ({
      ...prev,
      [currentTab]: [
        ...prev[currentTab],
        ...selected.filter(
          (emp) =>
            !prev[currentTab].some((e) => e.employeeId === emp.employeeId)
        ),
      ],
    }));
    setCheckedIds([]);
  };

  // 상세 테이블 삭제 핸들러
  const handleRemove = (empId: string) => {
    setStepMembers((prev) => ({
      ...prev,
      [currentTab]: prev[currentTab].filter((e) => e.employeeId !== empId),
    }));
  };

  // 입력값 상태(예시)
  const [lineName, setLineName] = useState("");
  // 삭제 확인 모달
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 저장 핸들러
  const handleSave = () => {
    if (!lineName.trim()) {
      alert("결재라인명을 입력하세요.");
      return;
    }
    onSubmit?.({
      name: lineName,
      steps: stepMembers,
    });
    onClose();
  };

  // 삭제 승인 핸들러
  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    onDelete?.();
    onClose();
  };

  // 취소 핸들러
  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={mode === "create" ? "결재라인등록" : "결재라인수정"}
      >
        <div className="w-[1200px] max-w-full h-[80vh] flex flex-col">
          {/* 상단 입력 영역 */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">구분</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="type" value="개인" defaultChecked />{" "}
                개인
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="type" value="부서" /> 부서
              </label>
            </div>
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="결재라인명"
              value={lineName}
              onChange={(e) => setLineName(e.target.value)}
            />
            <select className="border rounded px-2 py-1 text-sm">
              <option>결재프로세스</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm">
              <option>결재양식</option>
            </select>
          </div>

          <div className="flex flex-1 gap-4">
            {/* 좌측: 조직도 */}
            <div className="w-1/3 border rounded bg-surface p-2 overflow-auto">
              <div className="font-semibold text-sm mb-2">조직도</div>
              {loading ? (
                <div className="text-secondary text-xs">로딩 중...</div>
              ) : (
                <OrganizationTree
                  departments={rootDepartments}
                  selectedId={selectedDeptId}
                  onSelect={setSelectedDeptId}
                  childrenMap={childrenMap}
                />
              )}
            </div>

            {/* 중앙: 결재라인 선택 */}
            <div className="flex-1 border rounded bg-surface p-2 flex flex-col">
              <div className="font-semibold text-sm mb-2">결재라인선택</div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="사원명"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-primary text-white px-3 py-1 rounded text-sm">
                  검색
                </button>
              </div>
              <div className="flex gap-2 mb-2">
                {stepTabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentTab === tab.key
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border"
                    }`}
                    onClick={() => setCurrentTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* 직원 리스트 */}
              <div className="flex-1 overflow-auto border rounded bg-white p-2 text-xs">
                {selectedDeptId ? (
                  employees.length === 0 ? (
                    <div className="text-secondary">직원이 없습니다.</div>
                  ) : (
                    <table className="w-full text-xs">
                      <tbody>
                        {employees.map((emp) => (
                          <tr key={emp.employeeId}>
                            <td>
                              <input
                                type="checkbox"
                                checked={checkedIds.includes(emp.employeeId)}
                                onChange={(e) =>
                                  handleCheck(emp.employeeId, e.target.checked)
                                }
                              />
                            </td>
                            <td>{emp.name}</td>
                            <td>{emp.position}</td>
                            <td>{emp.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                ) : (
                  <div className="text-secondary">부서를 선택하세요.</div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-1 bg-primary text-white rounded disabled:opacity-50"
                  onClick={handleAdd}
                  disabled={checkedIds.length === 0}
                >
                  추가
                </button>
              </div>
            </div>
          </div>

          {/* 하단: 상세 테이블/버튼 */}
          <div className="mt-4 border-t pt-4 flex flex-col gap-2">
            <div className="flex gap-2 mb-2">
              {stepTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentTab === tab.key
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border"
                  }`}
                  onClick={() => setCurrentTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto border rounded bg-white p-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface">
                    <th className="border border-border px-2 py-1">NO</th>
                    <th className="border border-border px-2 py-1">결재자</th>
                    <th className="border border-border px-2 py-1">부서</th>
                    <th className="border border-border px-2 py-1">직책</th>
                    <th className="border border-border px-2 py-1">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {stepMembers[currentTab].length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-secondary py-4"
                      >
                        추가된 인원이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    stepMembers[currentTab].map((emp, idx) => (
                      <tr key={emp.employeeId}>
                        <td className="border border-border text-center">
                          {idx + 1}
                        </td>
                        <td className="border border-border text-center">
                          {emp.name}
                        </td>
                        <td className="border border-border text-center">
                          {emp.department}
                        </td>
                        <td className="border border-border text-center">
                          {emp.position}
                        </td>
                        <td className="border border-border text-center">
                          <button
                            className="text-danger text-xs underline"
                            onClick={() => handleRemove(emp.employeeId)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-danger text-white rounded"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                삭제
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={handleSave}
              >
                저장
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={handleCancel}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* 삭제 확인 모달 */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="결재라인 삭제 확인"
      >
        <div className="py-6 text-center">
          <div className="mb-4 text-lg">
            정말로 이 결재라인을 삭제하시겠습니까?
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </button>
            <button
              className="px-4 py-2 bg-danger text-white rounded"
              onClick={handleDeleteConfirm}
            >
              삭제 승인
            </button>
          </div>
        </div>
      </Dialog>

      {/* 직원 선택 모달 */}
      <EmployeeSelectorModal
        isOpen={employeeSelectorOpen}
        onClose={() => {
          setEmployeeSelectorOpen(false);
          setAddingApproverType(null);
        }}
        onSelect={handleEmployeeSelect}
        title="결재자 선택"
        multiple={true}
      />
    </>
  );
};

export default ApprovalLineDialog;
