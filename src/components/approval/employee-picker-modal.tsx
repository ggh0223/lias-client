"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import DepartmentTree from "./department-tree";
import type { DepartmentHierarchy, DepartmentEmployee } from "@/types/api";

interface EmployeePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (employee: any) => void;
  token: string;
  title?: string;
}

export default function EmployeePickerModal({
  isOpen,
  onClose,
  onSelect,
  token,
  title = "담당자 선택",
}: EmployeePickerModalProps) {
  const [departments, setDepartments] = useState<DepartmentHierarchy[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentHierarchy | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 부서 계층 구조 및 직원 목록 로드
  useEffect(() => {
    if (isOpen) {
      loadDepartmentHierarchy();
    }
  }, [isOpen]);

  const loadDepartmentHierarchy = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getDepartmentHierarchyWithEmployees(
        token,
        true
      );
      setDepartments(data);
      // 첫 번째 부서를 기본 선택
      if (data.length > 0) {
        setSelectedDepartment(data[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "조직도를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSelect = (department: DepartmentHierarchy) => {
    setSelectedDepartment(department);
    setEmployeeSearchTerm(""); // 부서 변경 시 직원 검색어 초기화
  };

  const handleEmployeeSelect = (employee: DepartmentEmployee) => {
    // DepartmentEmployee를 EmployeeDetail 형식으로 변환
    const employeeDetail = {
      id: employee.id,
      employeeNumber: employee.employeeNumber,
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      status: employee.status,
      departments: [
        {
          department: {
            id: employee.departmentId,
            departmentCode: "",
            departmentName: selectedDepartment?.departmentName || "",
          },
          position: employee.positionTitle
            ? {
                id: "",
                positionCode: "",
                positionTitle: employee.positionTitle,
                level: employee.positionLevel || 0,
                hasManagementAuthority: false,
              }
            : null,
        },
      ],
    };
    onSelect(employeeDetail);
    onClose();
    // Reset
    setSearchTerm("");
    setEmployeeSearchTerm("");
    setSelectedDepartment(null);
  };

  // 선택된 부서의 직원 필터링
  const filteredEmployees = selectedDepartment
    ? selectedDepartment.employees.filter(
        (emp) =>
          !employeeSearchTerm ||
          emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
          emp.employeeNumber
            .toLowerCase()
            .includes(employeeSearchTerm.toLowerCase())
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* 왼쪽: 부서 트리 */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="부서명 검색"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <DepartmentTree
                  departments={departments}
                  selectedDepartmentId={selectedDepartment?.id}
                  onDepartmentSelect={handleDepartmentSelect}
                  searchTerm={searchTerm}
                />
              )}
            </div>
          </div>

          {/* 오른쪽: 직원 목록 */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {selectedDepartment
                    ? `${selectedDepartment.departmentName} 직원 목록`
                    : "부서를 선택하세요"}
                </h4>
                {selectedDepartment && (
                  <span className="text-xs text-gray-500">
                    총 {selectedDepartment.employees.length}명
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="직원 이름 또는 사번 검색"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!selectedDepartment ? (
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-gray-500">
                    왼쪽에서 부서를 선택하세요
                  </p>
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="space-y-2">
                  {filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => handleEmployeeSelect(employee)}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </p>
                            {employee.positionTitle && (
                              <span className="ml-2 text-xs text-gray-500">
                                {employee.positionTitle}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {employee.employeeNumber}
                            {employee.email && ` • ${employee.email}`}
                          </p>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-gray-500">
                    {employeeSearchTerm
                      ? "검색 결과가 없습니다"
                      : "직원이 없습니다"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
