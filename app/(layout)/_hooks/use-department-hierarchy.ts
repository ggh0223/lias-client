import { useState, useEffect, useCallback } from "react";
import {
  getMetadataApi,
  DepartmentWithEmployees,
  Employee,
  Department,
} from "../_lib/api/metadata-api";

interface DepartmentNode extends DepartmentWithEmployees {
  children: DepartmentNode[];
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
}

interface UseDepartmentHierarchyReturn {
  departments: DepartmentNode[];
  loading: boolean;
  error: string | null;
  selectedDepartment: DepartmentNode | null;
  selectedEmployees: Employee[];
  toggleDepartment: (departmentId: string) => void;
  selectDepartment: (departmentId: string) => void;
  selectEmployee: (employee: Employee) => void;
  deselectEmployee: (employeeId: string) => void;
  clearSelectedEmployees: () => void;
  getDepartmentById: (departmentId: string) => DepartmentNode | null;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getTotalEmployeeCount: (departmentNode: DepartmentNode) => number;
  refreshData: () => Promise<void>;
}

export const useDepartmentHierarchy = (): UseDepartmentHierarchyReturn => {
  const [departments, setDepartments] = useState<DepartmentNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentNode | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  // API 응답을 계층구조로 변환
  const buildHierarchy = useCallback(
    (
      data:
        | DepartmentWithEmployees[]
        | { data: DepartmentWithEmployees[] }
        | DepartmentWithEmployees
    ): DepartmentNode[] => {
      const departmentMap = new Map<string, DepartmentNode>();
      const rootDepartments: DepartmentNode[] = [];

      // 재귀적으로 부서를 처리하는 함수
      const processDepartment = (
        deptData: DepartmentWithEmployees,
        level: number = 0
      ): DepartmentNode => {
        const node: DepartmentNode = {
          department: deptData.department,
          employees: deptData.employees || [],
          children: [],
          level,
          isExpanded: level === 0, // 최상위 부서는 기본적으로 펼침
          isSelected: false,
        };

        departmentMap.set(deptData.department.departmentId, node);
        return node;
      };

      // 재귀적으로 하위 부서를 처리하는 함수
      const processDepartmentWithChildren = (
        deptData: DepartmentWithEmployees,
        level: number = 0
      ): DepartmentNode => {
        const node = processDepartment(deptData, level);

        // childrenDepartments가 있으면 재귀적으로 처리
        if (
          deptData.department.childrenDepartments &&
          Array.isArray(deptData.department.childrenDepartments)
        ) {
          deptData.department.childrenDepartments.forEach(
            (childDept: Department | DepartmentWithEmployees) => {
              // 중첩 방지: 이미 DepartmentWithEmployees면 그대로, 아니면 감싸기
              const childDeptWithEmployees: DepartmentWithEmployees =
                "department" in childDept
                  ? childDept
                  : { department: childDept, employees: [] };
              const childNode = processDepartmentWithChildren(
                childDeptWithEmployees,
                level + 1
              );
              node.children.push(childNode);
            }
          );
        }

        return node;
      };

      // API 응답 처리
      let departmentsData: DepartmentWithEmployees[] = [];
      if (Array.isArray(data)) {
        departmentsData = data;
      } else if (data && typeof data === "object") {
        if ("data" in data && data.data) {
          departmentsData = Array.isArray(data.data) ? data.data : [data.data];
        } else if ("department" in data && "employees" in data) {
          departmentsData = [data as DepartmentWithEmployees];
        }
      }

      // 각 부서를 재귀적으로 처리
      departmentsData.forEach((deptData) => {
        const node = processDepartmentWithChildren(deptData, 0);
        rootDepartments.push(node);
      });

      return rootDepartments;
    },
    []
  );

  // 부서 데이터 가져오기
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMetadataApi();

      const hierarchy = buildHierarchy(response);

      setDepartments(hierarchy);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "부서 목록 조회에 실패했습니다."
      );
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [buildHierarchy]);

  // 부서 펼침/접힘 토글
  const toggleDepartment = useCallback((departmentId: string) => {
    setDepartments((prev) => {
      const updateNode = (nodes: DepartmentNode[]): DepartmentNode[] => {
        return nodes.map((node) => {
          if (node.department.departmentId === departmentId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prev);
    });
  }, []);

  // 부서 선택
  const selectDepartment = useCallback(
    (departmentId: string) => {
      setDepartments((prev) => {
        const updateNode = (nodes: DepartmentNode[]): DepartmentNode[] => {
          return nodes.map((node) => {
            const updatedNode = {
              ...node,
              isSelected: node.department.departmentId === departmentId,
              children: updateNode(node.children),
            };
            return updatedNode;
          });
        };
        return updateNode(prev);
      });

      // 선택된 부서 찾기
      const findDepartment = (
        nodes: DepartmentNode[]
      ): DepartmentNode | null => {
        for (const node of nodes) {
          if (node.department.departmentId === departmentId) {
            return node;
          }
          if (node.children.length > 0) {
            const found = findDepartment(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      const selected = findDepartment(departments);

      // 선택된 부서가 하위 부서이고 직원 정보가 없는 경우, API에서 가져오기
      if (
        selected &&
        selected.employees.length === 0 &&
        selected.department.childrenDepartments?.length === 0
      ) {
        // 실제로는 여기서 해당 부서의 직원 정보를 API로 가져와야 함
        // 현재는 빈 배열로 설정
        setSelectedDepartment(selected);
      } else {
        setSelectedDepartment(selected);
      }
    },
    [departments]
  );

  // 직원 선택
  const selectEmployee = useCallback((employee: Employee) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.some((e) => e.employeeId === employee.employeeId);
      if (isSelected) {
        return prev.filter((e) => e.employeeId !== employee.employeeId);
      } else {
        return [...prev, employee];
      }
    });
  }, []);

  // 직원 선택 해제
  const deselectEmployee = useCallback((employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.filter((e) => e.employeeId !== employeeId)
    );
  }, []);

  // 선택된 직원 초기화
  const clearSelectedEmployees = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  // 부서 ID로 부서 찾기
  const getDepartmentById = useCallback(
    (departmentId: string): DepartmentNode | null => {
      const findDepartment = (
        nodes: DepartmentNode[]
      ): DepartmentNode | null => {
        for (const node of nodes) {
          if (node.department.departmentId === departmentId) {
            return node;
          }
          if (node.children.length > 0) {
            const found = findDepartment(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findDepartment(departments);
    },
    [departments]
  );

  // 부서별 직원 목록 가져오기
  const getEmployeesByDepartment = useCallback(
    (departmentId: string): Employee[] => {
      const department = getDepartmentById(departmentId);
      return department ? department.employees : [];
    },
    [getDepartmentById]
  );

  // 데이터 새로고침
  const refreshData = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // 부서의 총 인원수(하위 부서 포함) 계산
  const getTotalEmployeeCount = useCallback(
    (departmentNode: DepartmentNode): number => {
      let total = departmentNode.employees.length;
      if (departmentNode.children.length > 0) {
        departmentNode.children.forEach((childNode) => {
          total += getTotalEmployeeCount(childNode);
        });
      }
      return total;
    },
    []
  );

  return {
    departments,
    loading,
    error,
    selectedDepartment,
    selectedEmployees,
    toggleDepartment,
    selectDepartment,
    selectEmployee,
    deselectEmployee,
    clearSelectedEmployees,
    getDepartmentById,
    getEmployeesByDepartment,
    getTotalEmployeeCount,
    refreshData,
  };
};
