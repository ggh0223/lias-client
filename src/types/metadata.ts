// 부서 정보 타입
export interface Department {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  childrenDepartments: Department[] | null;
}

// 직원 정보 타입
export interface Employee {
  employeeId: string;
  name: string;
  employeeNumber: string;
  email: string;
  department: string;
  position: string;
  rank: string;
}

// 부서별 직원 목록 응답 타입
export interface MetadataResponse {
  department: Department;
  employees: Employee[];
}

// Metadata API 요청 데이터 타입들
export interface CreateDepartmentData {
  departmentName: string;
  departmentCode: string;
  parentDepartmentId?: string;
}

export interface UpdateDepartmentData {
  departmentName?: string;
  departmentCode?: string;
  parentDepartmentId?: string;
}

export interface CreateEmployeeData {
  name: string;
  employeeNumber: string;
  email: string;
  department: string;
  position: string;
  rank: string;
}

export interface UpdateEmployeeData {
  name?: string;
  employeeNumber?: string;
  email?: string;
  department?: string;
  position?: string;
  rank?: string;
}
