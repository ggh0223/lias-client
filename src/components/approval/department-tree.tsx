"use client";

import { useState } from "react";
import type { DepartmentHierarchy } from "@/types/api";

interface DepartmentTreeProps {
  departments: DepartmentHierarchy[];
  selectedDepartmentId?: string;
  onDepartmentSelect: (department: DepartmentHierarchy) => void;
  searchTerm?: string;
}

interface DepartmentNodeProps {
  department: DepartmentHierarchy;
  selectedDepartmentId?: string;
  onDepartmentSelect: (department: DepartmentHierarchy) => void;
  searchTerm?: string;
  level?: number;
}

function DepartmentNode({
  department,
  selectedDepartmentId,
  onDepartmentSelect,
  searchTerm,
  level = 0,
}: DepartmentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0); // 최상위 부서는 기본 펼침
  const hasChildren = department.children && department.children.length > 0;
  const isSelected = selectedDepartmentId === department.id;

  // 검색어가 있으면 일치하는 부서 하이라이트
  const matchesSearch =
    searchTerm &&
    department.departmentName.toLowerCase().includes(searchTerm.toLowerCase());

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = () => {
    onDepartmentSelect(department);
  };

  return (
    <div className="select-none">
      {/* 부서 헤더 */}
      <div
        className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-100 text-blue-700 font-medium"
            : matchesSearch
            ? "bg-yellow-50 hover:bg-gray-100"
            : "hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* 펼치기/접기 아이콘 */}
        <div
          className="w-5 h-5 flex items-center justify-center mr-1"
          onClick={handleToggle}
        >
          {hasChildren && (
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isExpanded ? "transform rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>

        {/* 부서 아이콘 */}
        <svg
          className={`w-4 h-4 mr-2 ${
            isSelected ? "text-blue-600" : "text-gray-600"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>

        {/* 부서명 */}
        <span className="text-sm flex-1">{department.departmentName}</span>

        {/* 직원 수 */}
        {department.employees.length > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            ({department.employees.length}명)
          </span>
        )}
      </div>

      {/* 하위 부서 */}
      {isExpanded &&
        hasChildren &&
        department.children.map((child) => (
          <DepartmentNode
            key={child.id}
            department={child}
            selectedDepartmentId={selectedDepartmentId}
            onDepartmentSelect={onDepartmentSelect}
            searchTerm={searchTerm}
            level={level + 1}
          />
        ))}
    </div>
  );
}

export default function DepartmentTree({
  departments,
  selectedDepartmentId,
  onDepartmentSelect,
  searchTerm,
}: DepartmentTreeProps) {
  if (!departments || departments.length === 0) {
    return (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-500">부서가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {departments.map((dept) => (
        <DepartmentNode
          key={dept.id}
          department={dept}
          selectedDepartmentId={selectedDepartmentId}
          onDepartmentSelect={onDepartmentSelect}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}
