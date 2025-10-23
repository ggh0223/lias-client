"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import type { EmployeeDetail } from "@/types/api";

interface EmployeeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (employee: EmployeeDetail) => void;
  onMultiSelect?: (employees: EmployeeDetail[]) => void;
  currentEmployee?: EmployeeDetail;
  title?: string;
  allowMultiSelect?: boolean;
  selectedEmployees?: EmployeeDetail[];
}

export default function EmployeeSelectorModal({
  isOpen,
  onClose,
  onSelect,
  onMultiSelect,
  currentEmployee,
  title = "직원 선택",
  allowMultiSelect = false,
  selectedEmployees = [],
}: EmployeeSelectorModalProps) {
  const [employees, setEmployees] = useState<EmployeeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [multiSelectedEmployees, setMultiSelectedEmployees] = useState<
    EmployeeDetail[]
  >([]);

  const loadEmployees = useCallback(async () => {
    const token = clientAuth.getToken();
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiClient.searchEmployees(token, {
        search: searchTerm || undefined,
        departmentId: selectedDepartmentId || undefined,
      });
      setEmployees(data);
    } catch (err) {
      console.error("직원 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDepartmentId]);

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      loadDepartments();
      if (allowMultiSelect) {
        setMultiSelectedEmployees(selectedEmployees);
      }
    }
  }, [isOpen, allowMultiSelect, loadEmployees, selectedEmployees]);

  // 직원 목록이 로드된 후 기존 선택된 직원들을 찾아서 체크
  useEffect(() => {
    if (
      isOpen &&
      allowMultiSelect &&
      selectedEmployees.length > 0 &&
      employees.length > 0
    ) {
      const existingEmployeeIds = selectedEmployees.map((emp) => emp.id);
      const foundEmployees = employees.filter((emp) =>
        existingEmployeeIds.includes(emp.id)
      );
      if (foundEmployees.length > 0) {
        setMultiSelectedEmployees(foundEmployees);
      }
    }
  }, [isOpen, allowMultiSelect, selectedEmployees, employees]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        loadEmployees();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, loadEmployees]);

  const loadDepartments = async () => {
    const token = clientAuth.getToken();
    if (!token) return;

    try {
      const data = await apiClient.getDepartments(token);
      setDepartments(
        data.map((dept) => ({ id: dept.id, name: dept.departmentName }))
      );
    } catch (err) {
      console.error("부서 목록 조회 실패:", err);
    }
  };

  const handleSelect = (employee: EmployeeDetail) => {
    onSelect(employee);
    onClose();
  };

  const handleMultiSelectToggle = (employee: EmployeeDetail) => {
    const isSelected = multiSelectedEmployees.some(
      (emp) => emp.id === employee.id
    );
    if (isSelected) {
      setMultiSelectedEmployees((prev) =>
        prev.filter((emp) => emp.id !== employee.id)
      );
    } else {
      setMultiSelectedEmployees((prev) => [...prev, employee]);
    }
  };

  const handleMultiSelectComplete = () => {
    if (onMultiSelect) {
      onMultiSelect(multiSelectedEmployees);
    }
    onClose();
  };

  const isEmployeeSelected = (employee: EmployeeDetail) => {
    return multiSelectedEmployees.some((emp) => emp.id === employee.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              직원 검색
            </label>
            <input
              type="text"
              placeholder="이름 또는 사번으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부서 필터
            </label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">전체 부서</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 현재 선택된 직원 */}
        {currentEmployee && !allowMultiSelect && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">현재 선택:</span>{" "}
              {currentEmployee.name} ({currentEmployee.employeeNumber})
            </p>
          </div>
        )}

        {/* 다중 선택된 직원들 */}
        {allowMultiSelect && multiSelectedEmployees.length > 0 && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-medium">
                선택된 직원 ({multiSelectedEmployees.length}명):
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {multiSelectedEmployees.map((emp) => (
                <span
                  key={emp.id}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {emp.name} ({emp.employeeNumber})
                  <button
                    onClick={() => handleMultiSelectToggle(emp)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 직원 목록 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() =>
                    allowMultiSelect
                      ? handleMultiSelectToggle(employee)
                      : handleSelect(employee)
                  }
                  className={`p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors ${
                    allowMultiSelect && isEmployeeSelected(employee)
                      ? "bg-blue-50 border-blue-300"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {allowMultiSelect && (
                        <input
                          type="checkbox"
                          checked={isEmployeeSelected(employee)}
                          onChange={() => handleMultiSelectToggle(employee)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.employeeNumber}
                          {employee.departments &&
                            employee.departments.length > 0 && (
                              <>
                                {" "}
                                ·{" "}
                                {
                                  employee.departments[0].department
                                    .departmentName
                                }
                                {employee.departments[0].position && (
                                  <>
                                    {" "}
                                    ·{" "}
                                    {
                                      employee.departments[0].position
                                        .positionTitle
                                    }
                                  </>
                                )}
                              </>
                            )}
                        </p>
                      </div>
                    </div>
                    {!allowMultiSelect && (
                      <div className="text-blue-600">선택</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          {allowMultiSelect && (
            <button
              onClick={handleMultiSelectComplete}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              완료 ({multiSelectedEmployees.length}명 선택)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
