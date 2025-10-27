"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type { DepartmentWithEmployees } from "@/types/metadata";

export interface SelectableDepartment {
  id: string;
  name: string;
  code: string;
  employeeCount?: number;
}

interface DepartmentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (department: SelectableDepartment) => void;
  selectedDepartmentIds?: string[];
}

export default function DepartmentSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedDepartmentIds = [],
}: DepartmentSelectorModalProps) {
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

  const filterDepartments = (
    depts: DepartmentWithEmployees[]
  ): DepartmentWithEmployees[] => {
    if (!search) return depts;

    return depts
      .map((dept) => {
        const matchesSearch =
          dept.departmentName.includes(search) ||
          dept.departmentCode.includes(search);

        const filteredChildren = dept.children
          ? filterDepartments(dept.children)
          : [];

        if (matchesSearch || filteredChildren.length > 0) {
          return {
            ...dept,
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
    const employeeCount = dept.employees?.length || 0;

    return (
      <div key={dept.id} className="mb-1">
        {/* 부서 헤더 (펼치기 버튼과 부서 정보) */}
        <div
          className="flex items-center justify-between p-2 hover:bg-gray-50"
          style={{ paddingLeft: `${level * 1}rem` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDept(dept.id);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <button
              onClick={() =>
                onSelect({
                  id: dept.id,
                  name: dept.departmentName,
                  code: dept.departmentCode,
                  employeeCount,
                })
              }
              disabled={selectedDepartmentIds.includes(dept.id)}
              className="flex-1 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dept.departmentName}
                </p>
                <p className="text-xs text-gray-500">
                  {dept.departmentCode} • {employeeCount}명
                </p>
              </div>
            </button>
            {selectedDepartmentIds.includes(dept.id) && (
              <span className="text-xs text-green-600">선택됨</span>
            )}
          </div>
        </div>

        {/* 하위 부서 */}
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {dept.children?.map((child) => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredDepartments = filterDepartments(departments);
  // 루트 부서만 필터링 (계층구조의 최상위 부서)
  const rootDepartments = filteredDepartments.filter(
    (d) => !d.parentDepartmentId
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">부서 선택</h2>
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
            placeholder="부서명 또는 코드로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : rootDepartments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {search ? "검색 결과가 없습니다." : "부서를 찾을 수 없습니다."}
            </div>
          ) : (
            <div>{rootDepartments.map((dept) => renderDepartment(dept))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
