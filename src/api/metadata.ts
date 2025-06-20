import { fetchApi } from "./api";
import type {
  MetadataResponse,
  Department,
  Employee,
  CreateDepartmentData,
  UpdateDepartmentData,
  CreateEmployeeData,
  UpdateEmployeeData,
} from "../types/metadata";

// 부서별 직원 목록 조회
export const metadataApi = {
  // 부서별 직원 목록 조회
  getEmployeesByDepartment: () => fetchApi<MetadataResponse[]>("/metadata"),

  // 웹훅 동기화
  syncWebhook: () => fetchApi<null>("/metadata/webhook/sync"),
};

// 부서 관련 API (추가 기능)
export const departmentApi = {
  // 부서 목록 조회
  getList: () => fetchApi<Department[]>("/metadata/departments"),

  // 부서 상세 조회
  getDetail: (id: string) =>
    fetchApi<Department>(`/metadata/departments/${id}`),

  // 부서 생성
  create: (data: CreateDepartmentData) =>
    fetchApi<Department>("/metadata/departments", "POST", data),

  // 부서 수정
  update: (id: string, data: UpdateDepartmentData) =>
    fetchApi<Department>(`/metadata/departments/${id}`, "PATCH", data),

  // 부서 삭제
  delete: (id: string) =>
    fetchApi<null>(`/metadata/departments/${id}`, "DELETE"),
};

// 직원 관련 API (추가 기능)
export const employeeApi = {
  // 직원 목록 조회
  getList: () => fetchApi<Employee[]>("/metadata/employees"),

  // 직원 상세 조회
  getDetail: (id: string) => fetchApi<Employee>(`/metadata/employees/${id}`),

  // 직원 생성
  create: (data: CreateEmployeeData) =>
    fetchApi<Employee>("/metadata/employees", "POST", data),

  // 직원 수정
  update: (id: string, data: UpdateEmployeeData) =>
    fetchApi<Employee>(`/metadata/employees/${id}`, "PATCH", data),

  // 직원 삭제
  delete: (id: string) => fetchApi<null>(`/metadata/employees/${id}`, "DELETE"),
};
