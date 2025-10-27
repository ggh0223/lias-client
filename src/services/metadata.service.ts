/**
 * Metadata Service
 * Context Service - 비즈니스 로직 계층
 */

import { apiClient } from "@/lib/api-client";
import type {
  Department,
  DepartmentWithEmployees,
  Employee,
} from "@/types/metadata";

export class MetadataService {
  /**
   * 부서 목록 조회
   */
  async fetchDepartments(token: string): Promise<Department[]> {
    return await apiClient.getDepartments(token);
  }

  /**
   * 계층구조 부서 및 직원 조회
   */
  async fetchDepartmentHierarchyWithEmployees(
    token: string,
    activeOnly: boolean = true
  ): Promise<DepartmentWithEmployees[]> {
    return await apiClient.getDepartmentHierarchyWithEmployees(
      token,
      activeOnly
    );
  }

  /**
   * 부서별 직원 조회
   */
  async fetchDepartmentEmployees(
    token: string,
    departmentId: string,
    activeOnly: boolean = true
  ): Promise<Employee[]> {
    return await apiClient.getDepartmentEmployees(
      token,
      departmentId,
      activeOnly
    );
  }

  /**
   * 직원 검색
   */
  async searchEmployees(
    token: string,
    params?: { search?: string; departmentId?: string }
  ): Promise<Employee[]> {
    return await apiClient.searchEmployees(token, params);
  }

  /**
   * 직원 상세 조회
   */
  async fetchEmployee(token: string, employeeId: string): Promise<Employee> {
    return await apiClient.getEmployee(token, employeeId);
  }

  /**
   * 직책 목록 조회
   */
  async fetchPositions(
    token: string
  ): Promise<Array<{ id: string; title: string }>> {
    return await apiClient.getPositions(token);
  }
}

export const metadataService = new MetadataService();
