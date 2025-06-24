"use client";

import { useEffect } from "react";
import { Employee, DepartmentWithEmployees } from "../_lib/api/metadata-api";
import { useDepartmentHierarchy } from "../_hooks/use-department-hierarchy";

interface EmployeeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedEmployees: Employee[]) => void;
  selectedEmployees?: Employee[];
  title?: string;
  multiple?: boolean;
}

// 부서 노드 타입 정의
interface DepartmentNode extends DepartmentWithEmployees {
  children: DepartmentNode[];
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
}

// 부서 트리 컴포넌트
const DepartmentTree = ({
  departments,
  level = 0,
  onToggle,
  onSelect,
  selectedDepartmentId,
  getTotalEmployeeCount,
}: {
  departments: DepartmentNode[];
  level?: number;
  onToggle: (departmentId: string) => void;
  onSelect: (departmentId: string) => void;
  selectedDepartmentId?: string;
  getTotalEmployeeCount: (departmentNode: DepartmentNode) => number;
}) => {
  // 부서명 안전 추출 함수
  const getDepartmentName = (dept: DepartmentNode): string => {
    if (dept.department && typeof dept.department === "object") {
      if (
        "departmentName" in dept.department &&
        typeof dept.department.departmentName === "string"
      ) {
        return dept.department.departmentName;
      }
      if (
        "department" in dept.department &&
        dept.department.department &&
        typeof dept.department.department === "object" &&
        "departmentName" in dept.department.department &&
        typeof dept.department.department.departmentName === "string"
      ) {
        return dept.department.department.departmentName;
      }
    }
    return "이름 없음";
  };

  return (
    <div className="space-y-0.5">
      {departments.map((dept: DepartmentNode) => {
        console.log(dept);
        return (
          <div key={dept.department.departmentId} className="space-y-0.5">
            {/* 부서 헤더 */}
            <div
              className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                selectedDepartmentId === dept.department.departmentId
                  ? "bg-primary/10 border border-primary"
                  : "hover:bg-gray-50"
              }`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              <div className="flex items-center space-x-2 flex-1">
                {/* 화살표 아이콘 */}
                {dept.children.length > 0 && (
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      dept.isExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(dept.department.departmentId);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {dept.children.length === 0 && <div className="w-3" />}

                {/* 부서 정보 */}
                <div
                  className="flex-1 flex items-center justify-between"
                  onClick={() => onSelect(dept.department.departmentId)}
                >
                  <div className="font-medium text-primary text-sm truncate flex-1">
                    {getDepartmentName(dept)}
                  </div>
                  <div className="text-xs text-secondary ml-2 flex-shrink-0">
                    ({getTotalEmployeeCount(dept)})
                  </div>
                </div>
              </div>
            </div>

            {/* 하위 부서 */}
            {dept.isExpanded && dept.children.length > 0 && (
              <DepartmentTree
                departments={dept.children}
                level={level + 1}
                onToggle={onToggle}
                onSelect={onSelect}
                selectedDepartmentId={selectedDepartmentId}
                getTotalEmployeeCount={getTotalEmployeeCount}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const EmployeeSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedEmployees = [],
  title = "직원 선택",
  multiple = true,
}: EmployeeSelectorModalProps) => {
  const {
    departments,
    loading,
    error,
    selectedDepartment,
    selectedEmployees: hookSelectedEmployees,
    toggleDepartment,
    selectDepartment,
    selectEmployee,
    deselectEmployee,
    clearSelectedEmployees,
    getTotalEmployeeCount,
  } = useDepartmentHierarchy();

  // 모달이 열릴 때 선택된 직원 초기화
  useEffect(() => {
    if (isOpen) {
      // 선택된 직원을 훅의 상태와 동기화
      selectedEmployees.forEach((employee) => {
        if (
          !hookSelectedEmployees.some(
            (e: Employee) => e.employeeId === employee.employeeId
          )
        ) {
          selectEmployee(employee);
        }
      });
    }
  }, [isOpen, selectedEmployees, hookSelectedEmployees, selectEmployee]);

  const handleConfirm = () => {
    onSelect(hookSelectedEmployees);
    clearSelectedEmployees();
    onClose();
  };

  const handleCancel = () => {
    clearSelectedEmployees();
    onClose();
  };

  const isEmployeeSelected = (employee: Employee) => {
    return hookSelectedEmployees.some(
      (e: Employee) => e.employeeId === employee.employeeId
    );
  };

  // 현재 표시되는 직원 목록
  const currentEmployees = selectedDepartment?.employees || [];

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (currentEmployees.length === 0) return;

    const allSelected = currentEmployees.every(isEmployeeSelected);

    if (allSelected) {
      // 전체 해제
      currentEmployees.forEach((employee) => {
        if (isEmployeeSelected(employee)) {
          deselectEmployee(employee.employeeId);
        }
      });
    } else {
      // 전체 선택
      currentEmployees.forEach((employee) => {
        if (!isEmployeeSelected(employee)) {
          selectEmployee(employee);
        }
      });
    }
  };

  // 전체 선택 여부 확인
  const isAllSelected =
    currentEmployees.length > 0 && currentEmployees.every(isEmployeeSelected);
  const isPartiallySelected =
    currentEmployees.some(isEmployeeSelected) && !isAllSelected;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-surface rounded-lg p-4 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          <button
            onClick={handleCancel}
            className="text-secondary hover:text-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-2 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm mb-3">
            {error}
          </div>
        )}

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* 부서 트리 */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-primary">부서 구조</h3>
            <div className="border border-border rounded-lg p-3 h-80 overflow-y-auto">
              {loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-secondary mt-2 text-sm">
                    부서 목록을 불러오는 중...
                  </p>
                </div>
              ) : departments.length === 0 ? (
                <div className="text-center py-6 text-secondary text-sm">
                  <p>부서가 없습니다.</p>
                </div>
              ) : (
                <DepartmentTree
                  departments={departments}
                  onToggle={toggleDepartment}
                  onSelect={selectDepartment}
                  selectedDepartmentId={
                    selectedDepartment?.department.departmentId
                  }
                  getTotalEmployeeCount={getTotalEmployeeCount}
                />
              )}
            </div>
          </div>

          {/* 직원 목록 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-primary">
                {selectedDepartment
                  ? `${selectedDepartment.department.departmentName} 직원 목록`
                  : "직원 목록"}
              </h3>
              {currentEmployees.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-primary hover:text-primary/80 border border-primary/30 rounded px-2 py-1 transition-colors"
                >
                  {isAllSelected
                    ? "전체 해제"
                    : isPartiallySelected
                    ? "전체 선택"
                    : "전체 선택"}
                </button>
              )}
            </div>
            <div className="border border-border rounded-lg p-3 h-80 overflow-y-auto">
              {loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-secondary mt-2 text-sm">
                    직원 목록을 불러오는 중...
                  </p>
                </div>
              ) : (
                (() => {
                  return currentEmployees.length === 0 ? (
                    <div className="text-center py-6 text-secondary text-sm">
                      <p>
                        {selectedDepartment
                          ? "해당 부서에 직원이 없습니다."
                          : "부서를 선택해주세요."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {currentEmployees.map((employee: Employee) => (
                        <div
                          key={employee.employeeId}
                          onClick={() => selectEmployee(employee)}
                          className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${
                            isEmployeeSelected(employee)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <input
                              type={multiple ? "checkbox" : "radio"}
                              checked={isEmployeeSelected(employee)}
                              onChange={() => selectEmployee(employee)}
                              className="w-3 h-3 text-primary border-border rounded focus:ring-primary focus:ring-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-primary text-sm truncate">
                                  {employee.name}
                                </span>
                                <span className="text-xs text-secondary flex-shrink-0">
                                  ({employee.employeeNumber})
                                </span>
                                <span className="text-xs text-secondary bg-gray-100 px-1 rounded flex-shrink-0">
                                  {employee.position}
                                </span>
                              </div>
                              <div className="text-xs text-secondary truncate">
                                {employee.department} • {employee.rank}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* 선택된 직원 표시 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-primary">
              선택된 직원 ({hookSelectedEmployees.length}명)
            </h3>
            {hookSelectedEmployees.length > 0 && (
              <button
                onClick={clearSelectedEmployees}
                className="text-xs text-danger hover:text-danger/80 border border-danger/30 rounded px-2 py-1 transition-colors"
              >
                전체 비우기
              </button>
            )}
          </div>
          <div className="border border-border rounded-lg p-3 h-20 overflow-y-auto">
            {hookSelectedEmployees.length === 0 ? (
              <div className="flex items-center justify-center h-full text-secondary text-sm">
                <p>선택된 직원이 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {hookSelectedEmployees.map((employee: Employee) => (
                  <div
                    key={employee.employeeId}
                    className="flex items-center space-x-1 bg-primary/10 border border-primary/20 rounded px-2 py-1"
                  >
                    <span className="text-xs text-primary">
                      {employee.name} ({employee.employeeNumber})
                    </span>
                    <button
                      onClick={() => deselectEmployee(employee.employeeId)}
                      className="text-primary hover:text-primary/80"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 text-secondary hover:text-primary transition-colors text-sm"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={hookSelectedEmployees.length === 0}
            className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            선택 완료 ({hookSelectedEmployees.length}명)
          </button>
        </div>
      </div>
    </div>
  );
};
