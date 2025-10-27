// Employee Adapter - 백엔드 데이터를 클라이언트 구조로 변환
export class EmployeeAdapter {
  // 백엔드 직원 데이터를 클라이언트 구조로 변환
  static transformEmployee(backendEmployee: Record<string, unknown>) {
    return {
      id: backendEmployee.id,
      name: backendEmployee.name,
      employeeNumber: backendEmployee.employeeNumber,
      email: backendEmployee.email,
      departments:
        (backendEmployee.departments as Record<string, unknown>[])?.map(
          (dept: Record<string, unknown>) => ({
            department: {
              id: (dept.department as Record<string, unknown>)?.id,
              departmentName: (dept.department as Record<string, unknown>)
                ?.departmentName,
              departmentCode: (dept.department as Record<string, unknown>)
                ?.departmentCode,
              type: (dept.department as Record<string, unknown>)?.type,
              order: (dept.department as Record<string, unknown>)?.order,
              createdAt: (dept.department as Record<string, unknown>)
                ?.createdAt,
              updatedAt: (dept.department as Record<string, unknown>)
                ?.updatedAt,
            },
            position: {
              id: (dept.position as Record<string, unknown>)?.id,
              positionTitle: (dept.position as Record<string, unknown>)
                ?.positionTitle,
              positionCode: (dept.position as Record<string, unknown>)
                ?.positionCode,
              level: (dept.position as Record<string, unknown>)?.level,
              hasManagementAuthority: (dept.position as Record<string, unknown>)
                ?.hasManagementAuthority,
              createdAt: (dept.position as Record<string, unknown>)?.createdAt,
              updatedAt: (dept.position as Record<string, unknown>)?.updatedAt,
            },
          })
        ) || [],
    };
  }

  // 직원 목록 변환
  static transformEmployeeList(backendEmployees: Record<string, unknown>[]) {
    return backendEmployees.map((emp) => this.transformEmployee(emp));
  }

  // 부서 계층 구조 변환
  static transformDepartmentHierarchy(
    backendHierarchy: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      id: backendHierarchy.id,
      departmentName: backendHierarchy.departmentName,
      departmentCode: backendHierarchy.departmentCode,
      type: backendHierarchy.type,
      order: backendHierarchy.order,
      employees:
        (backendHierarchy.employees as Record<string, unknown>[])?.map(
          (emp: Record<string, unknown>) => ({
            id: emp.id,
            name: emp.name,
            employeeNumber: emp.employeeNumber,
            email: emp.email,
            positionTitle: emp.positionTitle,
            departmentId: emp.departmentId,
          })
        ) || [],
      children:
        (backendHierarchy.children as Record<string, unknown>[])?.map(
          (child: Record<string, unknown>) =>
            this.transformDepartmentHierarchy(child)
        ) || [],
    };
  }
}
