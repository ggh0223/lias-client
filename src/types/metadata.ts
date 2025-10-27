/**
 * Metadata Query API 타입 정의
 * METADATA-QUERY-API.md 참조
 */

/**
 * 부서 타입
 */
export type DepartmentType = "DIVISION" | "TEAM" | "DEPARTMENT";

/**
 * 부서 정보
 */
export interface Department {
  id: string;
  departmentCode: string;
  departmentName: string;
  type: DepartmentType;
  order: number;
  parentDepartmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 직급 정보
 */
export interface Position {
  id: string;
  positionCode: string;
  positionTitle: string;
  level: number;
  hasManagementAuthority: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 직원 부서-직급 매핑
 */
export interface EmployeeDepartmentPosition {
  department: Department;
  position: Position;
}

/**
 * 직원 정보
 */
export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: "Active" | "Inactive";
  hireDate: string;
  departments: EmployeeDepartmentPosition[];
}

/**
 * 계층 구조 부서 (직원 포함)
 */
export interface DepartmentWithEmployees {
  id: string;
  departmentCode: string;
  departmentName: string;
  type: DepartmentType;
  order: number;
  parentDepartmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  employees: Array<{
    id: string;
    employeeNumber: string;
    name: string;
    email: string;
    phoneNumber?: string;
    status: string;
    departmentId: string;
    positionTitle: string;
    positionLevel: number;
  }>;
  children: DepartmentWithEmployees[];
}
