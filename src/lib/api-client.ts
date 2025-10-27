/**
 * API Client
 * LIAS 결재 시스템 API 통신을 위한 클라이언트
 */

import type {
  ApprovalLineTemplate,
  TemplateVersion,
  TemplateVersionDetail,
  CreateTemplateRequest,
  CloneTemplateRequest,
  CreateTemplateVersionRequest,
  Form,
  FormVersion,
  CreateFormRequest,
  UpdateFormVersionRequest,
  PreviewApprovalLineRequest,
  PreviewApprovalLineResponse,
} from "@/types/approval-flow";
import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SubmitDocumentRequest,
} from "@/types/document";
import type {
  StepSnapshot,
  ApproveRequest,
  RejectRequest,
  CompleteAgreementRequest,
  CompleteImplementationRequest,
  CancelApprovalRequest,
  DocumentStepsResponse,
} from "@/types/approval-process";
import type {
  Department,
  DepartmentWithEmployees,
  Employee,
} from "@/types/metadata";

/**
 * API Client (Browser)
 * 클라이언트 컴포넌트에서 Next.js API Route를 호출
 * AGENTS.md: Client → Next.js API Route
 */

interface RequestConfig extends RequestInit {
  token?: string;
}

class ApiClient {
  constructor() {
    // Next.js API Route로 요청
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { token, ...restConfig } = config;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 서버 사이드에서는 절대 URL 필요
    const isServer = typeof window === "undefined";
    const baseURL = isServer
      ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      : "";
    const url = isServer ? `${baseURL}${endpoint}` : endpoint;
    console.log(`🌐 API 요청: ${config.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers,
      });

      console.log(`📡 API 응답: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        console.error("❌ API 에러:", error);
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes("fetch")) {
        console.error("❌ 네트워크 에러: 백엔드 서버에 연결할 수 없습니다.");
        throw new Error(
          "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요."
        );
      }
      throw error;
    }
  }

  // ============================================
  // Approval Flow API
  // Base URL: /api/approval-flow
  // ============================================

  /**
   * 1. 결재선 템플릿 목록 조회
   * GET /api/approval-flow/templates
   */
  async getApprovalLineTemplates(token: string, type?: string) {
    const query = type ? `?type=${type}` : "";
    return this.request<ApprovalLineTemplate[]>(
      `/api/approval-flow/templates${query}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 2. 결재선 템플릿 상세 조회
   * GET /api/approval-flow/templates/:templateId
   */
  async getApprovalLineTemplate(token: string, templateId: string) {
    return this.request<ApprovalLineTemplate>(
      `/api/approval-flow/templates/${templateId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 3. 결재선 템플릿 버전 상세 조회
   * GET /api/approval-flow/templates/:templateId/versions/:versionId
   */
  async getApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    versionId: string
  ) {
    return this.request<TemplateVersionDetail>(
      `/api/approval-flow/templates/${templateId}/versions/${versionId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 4. 결재선 템플릿 생성
   * POST /api/approval-flow/templates
   */
  async createApprovalLineTemplate(token: string, data: CreateTemplateRequest) {
    return this.request<ApprovalLineTemplate>(`/api/approval-flow/templates`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 5. 결재선 템플릿 복제
   * POST /api/approval-flow/templates/clone
   */
  async cloneApprovalLineTemplate(token: string, data: CloneTemplateRequest) {
    return this.request<TemplateVersion>(`/api/approval-flow/templates/clone`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 6. 결재선 템플릿 새 버전 생성
   * POST /api/approval-flow/templates/:templateId/versions
   */
  async createApprovalLineTemplateVersion(
    token: string,
    templateId: string,
    data: CreateTemplateVersionRequest
  ) {
    return this.request<TemplateVersion>(
      `/api/approval-flow/templates/${templateId}/versions`,
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 7. 문서양식 목록 조회
   * GET /api/approval-flow/forms
   */
  async getForms(token: string) {
    return this.request<Form[]>(`/api/approval-flow/forms`, {
      method: "GET",
      token,
    });
  }

  /**
   * 8. 문서양식 상세 조회
   * GET /api/approval-flow/forms/:formId
   */
  async getFormById(token: string, formId: string) {
    return this.request<Form>(`/api/approval-flow/forms/${formId}`, {
      method: "GET",
      token,
    });
  }

  /**
   * 9. 문서양식 버전 상세 조회
   * GET /api/approval-flow/forms/:formId/versions/:versionId
   */
  async getFormVersion(token: string, formId: string, versionId: string) {
    return this.request<FormVersion>(
      `/api/approval-flow/forms/${formId}/versions/${versionId}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 10. 문서양식 생성
   * POST /api/approval-flow/forms
   */
  async createForm(token: string, data: CreateFormRequest) {
    return this.request<Form>(`/api/approval-flow/forms`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 11. 문서양식 버전 수정 (새 버전 생성)
   * PATCH /api/approval-flow/forms/:formId/versions
   */
  async updateFormVersion(
    token: string,
    formId: string,
    data: UpdateFormVersionRequest
  ) {
    return this.request<FormVersion>(
      `/api/approval-flow/forms/${formId}/versions`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 12. 결재선 미리보기
   * POST /api/approval-flow/forms/:formId/preview-approval-line
   */
  async previewApprovalLine(
    token: string,
    formId: string,
    data: PreviewApprovalLineRequest
  ) {
    return this.request<PreviewApprovalLineResponse>(
      `/api/approval-flow/forms/${formId}/preview-approval-line`,
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      }
    );
  }

  // ============================================
  // Document API (v2)
  // Base URL: /api/document
  // ============================================

  /**
   * 1. 문서 생성
   * POST /api/document
   */
  async createDocument(token: string, data: CreateDocumentRequest) {
    return this.request<Document>("/api/document", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 2. 문서 수정
   * PUT /api/document/:documentId
   */
  async updateDocument(
    token: string,
    documentId: string,
    data: UpdateDocumentRequest
  ) {
    return this.request<Document>(`/api/document/${documentId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 3. 문서 제출
   * POST /api/document/:documentId/submit
   */
  async submitDocument(
    token: string,
    documentId: string,
    data: SubmitDocumentRequest
  ) {
    return this.request<Document>(`/api/document/${documentId}/submit`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 4. 문서 삭제
   * DELETE /api/document/:documentId
   */
  async deleteDocument(token: string, documentId: string) {
    return this.request<{ message: string; documentId: string }>(
      `/api/document/${documentId}`,
      {
        method: "DELETE",
        token,
      }
    );
  }

  /**
   * 5. 문서 조회
   * GET /api/document/:documentId
   */
  async getDocumentById(token: string, documentId: string) {
    return this.request<Document>(`/api/document/${documentId}`, {
      method: "GET",
      token,
    });
  }

  /**
   * 6. 내 문서 목록 조회
   * GET /api/document/my-documents
   */
  async getMyDocuments(token: string) {
    return this.request<Document[]>("/api/document/my-documents", {
      method: "GET",
      token,
    });
  }

  /**
   * 7. 상태별 문서 조회
   * GET /api/document/status/:status
   */
  async getDocumentsByStatus(token: string, status: string) {
    return this.request<Document[]>(`/api/document/status/${status}`, {
      method: "GET",
      token,
    });
  }

  /**
   * @deprecated 이 메서드는 제거되었습니다. createDocument를 사용하세요.
   */
  async createDocumentV2(
    token: string,
    data: { formVersionId: string; title: string; content: string }
  ) {
    return this.createDocument(token, data);
  }

  // ============================================
  // Metadata API
  // ============================================

  /**
   * 부서 목록 조회
   * GET /api/metadata/departments
   */
  async getDepartments(token: string) {
    return this.request<Department[]>("/api/metadata/departments", {
      method: "GET",
      token,
    });
  }

  /**
   * 부서 계층 구조 조회 (직원 포함)
   * GET /api/metadata/departments/hierarchy/with-employees
   */
  async getDepartmentHierarchyWithEmployees(
    token: string,
    activeOnly: boolean = true
  ) {
    return this.request<DepartmentWithEmployees[]>(
      `/api/metadata/departments/hierarchy/with-employees?activeOnly=${activeOnly}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 부서별 직원 조회
   * GET /api/metadata/departments/:departmentId/employees
   */
  async getDepartmentEmployees(
    token: string,
    departmentId: string,
    activeOnly: boolean = true
  ) {
    return this.request<Employee[]>(
      `/api/metadata/departments/${departmentId}/employees?activeOnly=${activeOnly}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 직원 검색
   * GET /api/metadata/employees
   */
  async searchEmployees(
    token: string,
    params?: { search?: string; departmentId?: string }
  ) {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.departmentId) query.append("departmentId", params.departmentId);

    const queryString = query.toString();
    return this.request<Employee[]>(
      `/api/metadata/employees${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        token,
      }
    );
  }

  /**
   * 직원 상세 조회
   * GET /api/metadata/employees/:employeeId
   */
  async getEmployee(token: string, employeeId: string) {
    return this.request<Employee>(`/api/metadata/employees/${employeeId}`, {
      method: "GET",
      token,
    });
  }

  /**
   * 직책 목록 조회
   * GET /api/metadata/positions
   */
  async getPositions(token: string) {
    return this.request<Array<{ id: string; title: string }>>(
      "/api/metadata/positions",
      {
        method: "GET",
        token,
      }
    );
  }

  // ============================================
  // Approval Process API (v2)
  // Base URL: /api/approval-process
  // ============================================

  /**
   * 1. 결재 승인
   * POST /api/approval-process/approve
   */
  async approveStep(token: string, data: ApproveRequest) {
    return this.request<StepSnapshot>("/api/approval-process/approve", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 2. 결재 반려
   * POST /api/approval-process/reject
   */
  async rejectStep(token: string, data: RejectRequest) {
    return this.request<StepSnapshot>("/api/approval-process/reject", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 3. 협의 완료
   * POST /api/approval-process/agreement/complete
   */
  async completeAgreement(token: string, data: CompleteAgreementRequest) {
    return this.request<StepSnapshot>(
      "/api/approval-process/agreement/complete",
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 4. 시행 완료
   * POST /api/approval-process/implementation/complete
   */
  async completeImplementation(
    token: string,
    data: CompleteImplementationRequest
  ) {
    return this.request<StepSnapshot>(
      "/api/approval-process/implementation/complete",
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 5. 결재 취소
   * POST /api/approval-process/cancel
   */
  async cancelDocument(token: string, data: CancelApprovalRequest) {
    return this.request<{
      message: string;
      documentId: string;
      documentStatus: string;
    }>("/api/approval-process/cancel", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 6. 내 결재 대기 목록 조회
   * GET /api/approval-process/my-pending
   */
  async getMyPendingApprovals(token: string) {
    return this.request<StepSnapshot[]>("/api/approval-process/my-pending", {
      method: "GET",
      token,
    });
  }

  /**
   * 7. 문서의 결재 단계 조회
   * GET /api/approval-process/document/:documentId/steps
   */
  async getDocumentSteps(token: string, documentId: string) {
    return this.request<DocumentStepsResponse>(
      `/api/approval-process/document/${documentId}/steps`,
      {
        method: "GET",
        token,
      }
    );
  }

  // ============================================
  // Test Data API (v2)
  // Base URL: /api/test-data
  // ============================================

  /**
   * 토큰 생성 (개발용)
   * POST /api/test-data/token
   */
  async generateToken(data: { employeeNumber?: string; email?: string }) {
    return this.request<{
      success: boolean;
      message: string;
      accessToken: string;
      expiresIn: number;
      employee: {
        id: string;
        employeeNumber: string;
        name: string;
        email: string;
      };
    }>("/api/test-data/token", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 테스트 데이터 생성
   * POST /api/test-data
   */
  async createTestData(
    token: string,
    data: {
      scenario: string;
      documentCount?: number;
      titlePrefix?: string;
      progress?: number;
    }
  ) {
    return this.request<{
      success: boolean;
      message: string;
      data?: {
        forms: string[];
        formVersions: string[];
        documents: string[];
        approvalLineTemplates: string[];
        approvalLineTemplateVersions: string[];
        approvalStepTemplates: string[];
        approvalLineSnapshots: string[];
        approvalStepSnapshots: string[];
      };
    }>("/api/test-data", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  /**
   * 모든 테스트 데이터 삭제
   * DELETE /api/test-data/all
   */
  async deleteAllTestData(token: string) {
    return this.request<{
      success: boolean;
      message: string;
      data?: { deletedCount: number };
    }>("/api/test-data/all", {
      method: "DELETE",
      token,
    });
  }
}

export const apiClient = new ApiClient();
