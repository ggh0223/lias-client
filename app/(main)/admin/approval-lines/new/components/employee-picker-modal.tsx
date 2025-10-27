"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type { Employee } from "@/types/metadata";
import type { DepartmentWithEmployees } from "@/types/metadata";

interface EmployeePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (employee: Employee) => void;
  selectedEmployeeIds?: string[];
}

export default function EmployeePickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedEmployeeIds = [],
}: EmployeePickerModalProps) {
  const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedDeptIds, setExpandedDeptIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      const data = await apiClient.getDepartmentHierarchyWithEmployees(token);
      setDepartments(data);
      // 루트 부서들 자동 펼치기
      const rootDepts = data.filter((d) => !d.parentDepartmentId);
      setExpandedDeptIds(new Set(rootDepts.map((d) => d.id)));
    } catch (error) {
      console.error("Error loading departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDept = (deptId: string) => {
    const newExpanded = new Set(expandedDeptIds);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDeptIds(newExpanded);
  };

  // 검색어가 있으면 해당 검색어를 포함하는 부서/직원만 표시
  const filterDepartments = (
    depts: DepartmentWithEmployees[]
  ): DepartmentWithEmployees[] => {
    if (!search) return depts;

    return depts
      .map((dept) => {
        const matchesSearch =
          dept.departmentName.includes(search) ||
          dept.departmentCode.includes(search);

        const filteredEmployees = dept.employees?.filter(
          (emp) =>
            emp.name.includes(search) ||
            emp.employeeNumber?.includes(search) ||
            emp.email?.includes(search)
        );

        const filteredChildren = dept.children
          ? filterDepartments(dept.children)
          : [];

        if (
          matchesSearch ||
          filteredEmployees.length > 0 ||
          filteredChildren.length > 0
        ) {
          return {
            ...dept,
            employees: filteredEmployees,
            children: filteredChildren,
          };
        }
        return null;
      })
      .filter((d): d is DepartmentWithEmployees => d !== null);
  };

  const renderDepartment = (
    dept: DepartmentWithEmployees,
    level = 0
  ): JSX.Element => {
    const isExpanded = expandedDeptIds.has(dept.id);
    const hasChildren = dept.children && dept.children.length > 0;
    const displayEmployees = dept.employees || [];

    return (
      <div key={dept.id} className="mb-1">
        {/* 부서 헤더 */}
        <div
          className="flex items-center justify-between p-2 hover:bg-gray-50"
          style={{ paddingLeft: `${level * 1}rem` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleDept(dept.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {dept.departmentName}
              </p>
              <p className="text-xs text-gray-500">{dept.departmentCode}</p>
            </div>
            {displayEmployees.length > 0 && (
              <span className="text-xs text-gray-500">
                {displayEmployees.length}명
              </span>
            )}
          </div>
        </div>

        {/* 하위 부서 또는 직원 목록 */}
        {(isExpanded || !hasChildren) && (
          <div className="ml-4">
            {/* 하위 부서 */}
            {isExpanded &&
              dept.children?.map((child) => renderDepartment(child, level + 1))}

            {/* 직원 목록 */}
            {displayEmployees.length > 0 && (
              <div className="ml-4">
                {displayEmployees.map((emp) => {
                  // DepartmentWithEmployees의 employees를 Employee 타입으로 변환
                  const employeeData: Employee = {
                    id: emp.id,
                    employeeNumber: emp.employeeNumber,
                    name: emp.name,
                    email: emp.email,
                    phoneNumber: emp.phoneNumber,
                    status: emp.status as "Active" | "Inactive",
                    hireDate: new Date().toISOString(),
                    departments: [
                      {
                        department: {
                          id: dept.id,
                          departmentCode: dept.departmentCode,
                          departmentName: dept.departmentName,
                          type: dept.type,
                          order: dept.order,
                          parentDepartmentId: dept.parentDepartmentId,
                          createdAt: dept.createdAt,
                          updatedAt: dept.updatedAt,
                        },
                        position: {
                          id: emp.id,
                          positionCode: emp.positionTitle,
                          positionTitle: emp.positionTitle,
                          level: emp.positionLevel,
                          hasManagementAuthority: false,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        },
                      },
                    ],
                  };

                  return (
                    <button
                      key={emp.id}
                      onClick={() => onSelect(employeeData)}
                      disabled={selectedEmployeeIds.includes(emp.id)}
                      className="w-full text-left p-2 mb-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {emp.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {emp.employeeNumber}
                            {emp.email && ` • ${emp.email}`}
                            {emp.positionTitle && ` • ${emp.positionTitle}`}
                          </p>
                        </div>
                        {selectedEmployeeIds.includes(emp.id) && (
                          <span className="text-xs text-green-600">선택됨</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredData = filterDepartments(departments);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">직원 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="부서명, 직원명, 직원번호, 이메일로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department & Employee List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {search ? "검색 결과가 없습니다." : "부서를 찾을 수 없습니다."}
            </div>
          ) : (
            <div>{filteredData.map((dept) => renderDepartment(dept))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
