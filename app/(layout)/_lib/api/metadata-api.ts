// 메타데이터 관련 API 호출 함수

import { ApiClient } from "./api-client";

// 부서 정보 타입 정의
export interface Department {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  parentDepartmentId: string;
  childrenDepartments: DepartmentWithEmployees[];
}

// 직원 정보 타입 정의
export interface Employee {
  employeeId: string;
  name: string;
  employeeNumber: string;
  email: string;
  department: string;
  position: string;
  rank: string;
}

// 부서별 직원 정보 타입 정의
export interface DepartmentWithEmployees {
  department: Department;
  employees: Employee[];
}

// 부서별 직원 목록 조회
export const getMetadataApi = async (): Promise<DepartmentWithEmployees[]> => {
  try {
    const response = await ApiClient.get<DepartmentWithEmployees>(
      "/api/metadata"
    );
    console.log(response);
    return [response];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("부서별 직원 목록 조회 중 오류가 발생했습니다.");
  }
};
