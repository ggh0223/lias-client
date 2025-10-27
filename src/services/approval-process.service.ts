/**
 * Approval Process Service
 * Context Service - 비즈니스 로직 계층
 */

import { apiClient } from "@/lib/api-client";
import { apiServer } from "@/lib/api-server";
import type {
  StepSnapshot,
  ApproveRequest,
  RejectRequest,
  CompleteAgreementRequest,
  CompleteImplementationRequest,
  CancelApprovalRequest,
  DocumentStepsResponse,
} from "@/types/approval-process";

export class ApprovalProcessService {
  /**
   * 결재 승인
   */
  async approve(token: string, data: ApproveRequest): Promise<StepSnapshot> {
    return await apiClient.approveStep(token, data);
  }

  /**
   * 결재 반려
   */
  async reject(token: string, data: RejectRequest): Promise<StepSnapshot> {
    return await apiClient.rejectStep(token, data);
  }

  /**
   * 협의 완료
   */
  async completeAgreement(
    token: string,
    data: CompleteAgreementRequest
  ): Promise<StepSnapshot> {
    return await apiClient.completeAgreement(token, data);
  }

  /**
   * 시행 완료
   */
  async completeImplementation(
    token: string,
    data: CompleteImplementationRequest
  ): Promise<StepSnapshot> {
    return await apiClient.completeImplementation(token, data);
  }

  /**
   * 결재 취소
   */
  async cancel(
    token: string,
    data: CancelApprovalRequest
  ): Promise<{
    message: string;
    documentId: string;
    documentStatus: string;
  }> {
    return await apiClient.cancelDocument(token, data);
  }

  /**
   * 내 결재 대기 목록 조회
   * 서버 컴포넌트에서 호출 시 apiServer 사용
   */
  async fetchMyPending(token: string): Promise<StepSnapshot[]> {
    // 서버 사이드에서는 apiServer 사용
    if (typeof window === "undefined") {
      return await apiServer.getMyPendingApprovals(token);
    }
    // 클라이언트 사이드에서는 apiClient 사용
    return await apiClient.getMyPendingApprovals(token);
  }

  /**
   * 문서의 결재 단계 조회
   */
  async fetchDocumentSteps(
    token: string,
    documentId: string
  ): Promise<DocumentStepsResponse> {
    return await apiClient.getDocumentSteps(token, documentId);
  }
}

export const approvalProcessService = new ApprovalProcessService();
