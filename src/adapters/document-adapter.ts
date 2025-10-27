// Document Adapter - 백엔드 데이터를 클라이언트 구조로 변환
export class DocumentAdapter {
  // 백엔드 문서 데이터를 클라이언트 구조로 변환
  static transformDocument(backendDocument: Record<string, unknown>) {
    return {
      id: backendDocument.id,
      title: backendDocument.title,
      content: backendDocument.content,
      status: backendDocument.status,
      createdAt: backendDocument.createdAt,
      updatedAt: backendDocument.updatedAt,
      author: {
        id: (backendDocument.author as Record<string, unknown>)?.id,
        name: (backendDocument.author as Record<string, unknown>)?.name,
        email: (backendDocument.author as Record<string, unknown>)?.email,
        department: (backendDocument.author as Record<string, unknown>)
          ?.department,
        position: (backendDocument.author as Record<string, unknown>)?.position,
      },
      approvalSteps:
        (backendDocument.approvalSteps as Record<string, unknown>[])?.map(
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
            status: step.status,
            comment: step.comment,
            approvedAt: step.approvedAt,
          })
        ) || [],
    };
  }

  // 클라이언트 문서 데이터를 백엔드 구조로 변환
  static transformToBackend(clientDocument: Record<string, unknown>) {
    return {
      title: clientDocument.title,
      content: clientDocument.content,
      customApprovalSteps:
        (clientDocument.approvalSteps as Record<string, unknown>[])?.map(
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

  // 문서 목록 변환
  static transformDocumentList(backendDocuments: Record<string, unknown>[]) {
    return backendDocuments.map((doc) => this.transformDocument(doc));
  }
}
