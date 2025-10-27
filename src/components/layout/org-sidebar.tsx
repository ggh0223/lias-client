"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { clientAuth } from "@/lib/auth-client";
import { quickLoginAction } from "@/actions/auth-actions";
import type { DepartmentWithEmployees } from "@/types";

interface OrgSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrgSidebar({ isOpen, onClose }: OrgSidebarProps) {
  const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      loadOrgChart();
    }
  }, [isOpen, hasLoaded]);

  const loadOrgChart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = clientAuth.getToken();
      if (!token) {
        setError("토큰이 없습니다.");
        return;
      }
      const data = await apiClient.getDepartmentHierarchyWithEmployees(
        token,
        true
      );
      setDepartments(data);

      // 모든 부서를 자동으로 펼치기
      const allDeptIds = new Set<string>();
      const collectDeptIds = (depts: DepartmentWithEmployees[]) => {
        depts.forEach((dept) => {
          allDeptIds.add(dept.id);
          if (dept.children && dept.children.length > 0) {
            collectDeptIds(dept.children);
          }
        });
      };
      collectDeptIds(data);
      setExpandedDepts(allDeptIds);

      setHasLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "조직도를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const handleEmployeeClick = async (
    employee: DepartmentWithEmployees["employees"][number]
  ) => {
    try {
      setLoading(true);

      // 서버 액션 호출 (쿠키에 토큰 저장)
      const result = await quickLoginAction(employee.employeeNumber);

      if (result.error) {
        alert(result.error);
        return;
      }

      // 클라이언트 사이드에도 저장 (선택적)
      if (result.success && result.accessToken && result.employee) {
        clientAuth.setToken(result.accessToken);
        clientAuth.setUser(result.employee);
      }

      // 페이지 새로고침으로 레이아웃 갱신
      window.location.href = "/dashboard";
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "로그인에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDepartment = (
    dept: DepartmentWithEmployees,
    level: number = 0
  ) => {
    const isExpanded = expandedDepts.has(dept.id);
    const hasChildren = dept.children && dept.children.length > 0;
    const hasEmployees = dept.employees && dept.employees.length > 0;

    return (
      <div key={dept.id} style={{ paddingLeft: `${level * 12}px` }}>
        {/* 부서 헤더 */}
        <div
          className={`flex items-center py-2 px-2 hover:bg-gray-50 cursor-pointer ${
            level === 0 ? "font-semibold" : ""
          }`}
          onClick={() => toggleDepartment(dept.id)}
        >
          {(hasChildren || hasEmployees) && (
            <span className="mr-1 text-gray-500">{isExpanded ? "▼" : "▶"}</span>
          )}
          <span className="text-sm">{dept.departmentName}</span>
          {hasEmployees && (
            <span className="ml-2 text-xs text-gray-500">
              ({dept.employees.length})
            </span>
          )}
        </div>

        {/* 직원 목록 */}
        {isExpanded && hasEmployees && (
          <div className="ml-4">
            {dept.employees.map(
              (employee: DepartmentWithEmployees["employees"][number]) => (
                <div
                  key={employee.id}
                  className="flex items-center py-1.5 px-2 hover:bg-blue-50 cursor-pointer text-sm rounded"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <span className="mr-2">👤</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {employee.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.positionTitle} · {employee.employeeNumber}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 하위 부서 */}
        {isExpanded && hasChildren && (
          <div>
            {dept.children.map((child: DepartmentWithEmployees) =>
              renderDepartment(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col flex-shrink-0">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">조직도</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {/* 설명 */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <p className="text-xs text-blue-800">
          💡 직원을 클릭하면 해당 직원으로 빠르게 로그인할 수 있습니다.
        </p>
      </div>

      {/* 조직도 내용 */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="text-center py-8 text-gray-500">
            조직도를 불러오는 중...
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={loadOrgChart}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && departments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            조직도 데이터가 없습니다.
          </div>
        )}

        {!loading && !error && departments.length > 0 && (
          <div className="space-y-1">
            {departments.map((dept) => renderDepartment(dept, 0))}
          </div>
        )}
      </div>
    </aside>
  );
}
