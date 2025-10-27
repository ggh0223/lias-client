// Approval Line Adapter - 백엔드 데이터를 클라이언트 구조로 변환
export class ApprovalLineAdapter {
  // 백엔드 결재선 데이터를 클라이언트 구조로 변환
  static transformApprovalLine(backendApprovalLine: Record<string, unknown>) {
    return {
      id: backendApprovalLine.id,
      name: backendApprovalLine.name,
      description: backendApprovalLine.description,
      isActive: backendApprovalLine.isActive,
      createdAt: backendApprovalLine.createdAt,
      updatedAt: backendApprovalLine.updatedAt,
      steps:
        (backendApprovalLine.steps as Record<string, unknown>[])?.map(
          (step: Record<string, unknown>) => ({
            id: step.id,
            stepOrder: step.stepOrder,
            stepType: step.stepType,
            assigneeRule: step.assigneeRule,
            employeeId: step.employeeId,
            employeeName: step.employeeName,
            departmentId: step.departmentId,
            departmentName: step.departmentName,
            positionTitle: step.positionTitle,
            isRequired: step.isRequired,
          })
        ) || [],
    };
  }

  // 클라이언트 결재선 데이터를 백엔드 구조로 변환
  static transformToBackend(clientApprovalLine: Record<string, unknown>) {
    return {
      name: clientApprovalLine.name,
      description: clientApprovalLine.description,
      steps:
        (clientApprovalLine.steps as Record<string, unknown>[])?.map(
          (step: Record<string, unknown>) => ({
            stepOrder: step.stepOrder,
            stepType: step.stepType,
            assigneeRule: step.assigneeRule,
            employeeId: step.employeeId,
            departmentId: step.departmentId,
            isRequired: step.isRequired,
          })
        ) || [],
    };
  }

  // 결재선 목록 변환
  static transformApprovalLineList(
    backendApprovalLines: Record<string, unknown>[]
  ) {
    return backendApprovalLines.map((line) => this.transformApprovalLine(line));
  }
}
