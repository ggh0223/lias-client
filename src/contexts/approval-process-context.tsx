"use client";

/**
 * Approval Process Context
 * AGENTS.md: 전역 상태 저장소
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  StepSnapshot,
  ApproveRequest,
  RejectRequest,
  CompleteAgreementRequest,
  CompleteImplementationRequest,
  CancelApprovalRequest,
  DocumentStepsResponse,
} from "@/types/approval-process";
import { approvalProcessService } from "@/services/approval-process.service";

interface ApprovalProcessContextValue {
  pendingApprovals: StepSnapshot[];
  documentSteps: DocumentStepsResponse | null;
  loading: boolean;
  error: string | null;
  fetchPendingApprovals: (token: string) => Promise<void>;
  fetchDocumentSteps: (token: string, documentId: string) => Promise<void>;
  approve: (token: string, data: ApproveRequest) => Promise<void>;
  reject: (token: string, data: RejectRequest) => Promise<void>;
  completeAgreement: (
    token: string,
    data: CompleteAgreementRequest
  ) => Promise<void>;
  completeImplementation: (
    token: string,
    data: CompleteImplementationRequest
  ) => Promise<void>;
  cancel: (token: string, data: CancelApprovalRequest) => Promise<void>;
  clearError: () => void;
}

const ApprovalProcessContext = createContext<
  ApprovalProcessContextValue | undefined
>(undefined);

export function ApprovalProcessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingApprovals, setPendingApprovals] = useState<StepSnapshot[]>([]);
  const [documentSteps, setDocumentSteps] =
    useState<DocumentStepsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingApprovals = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const data = await approvalProcessService.fetchMyPending(token);
      setPendingApprovals(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "결재 대기 목록 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentSteps = useCallback(
    async (token: string, documentId: string) => {
      setLoading(true);
      try {
        const data = await approvalProcessService.fetchDocumentSteps(
          token,
          documentId
        );
        setDocumentSteps(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "결재 단계 조회에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approve = useCallback(
    async (token: string, data: ApproveRequest) => {
      setLoading(true);
      try {
        await approvalProcessService.approve(token, data);
        // 결재 대기 목록 새로고침
        await fetchPendingApprovals(token);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "승인에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingApprovals]
  );

  const reject = useCallback(
    async (token: string, data: RejectRequest) => {
      setLoading(true);
      try {
        await approvalProcessService.reject(token, data);
        await fetchPendingApprovals(token);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "반려에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingApprovals]
  );

  const completeAgreement = useCallback(
    async (token: string, data: CompleteAgreementRequest) => {
      setLoading(true);
      try {
        await approvalProcessService.completeAgreement(token, data);
        await fetchPendingApprovals(token);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "협의 완료에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingApprovals]
  );

  const completeImplementation = useCallback(
    async (token: string, data: CompleteImplementationRequest) => {
      setLoading(true);
      try {
        await approvalProcessService.completeImplementation(token, data);
        await fetchPendingApprovals(token);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "시행 완료에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPendingApprovals]
  );

  const cancel = useCallback(
    async (token: string, data: CancelApprovalRequest) => {
      setLoading(true);
      try {
        await approvalProcessService.cancel(token, data);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "취소에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ApprovalProcessContextValue = {
    pendingApprovals,
    documentSteps,
    loading,
    error,
    fetchPendingApprovals,
    fetchDocumentSteps,
    approve,
    reject,
    completeAgreement,
    completeImplementation,
    cancel,
    clearError,
  };

  return (
    <ApprovalProcessContext.Provider value={value}>
      {children}
    </ApprovalProcessContext.Provider>
  );
}

export function useApprovalProcess() {
  const context = useContext(ApprovalProcessContext);
  if (!context) {
    throw new Error(
      "useApprovalProcess must be used within ApprovalProcessProvider"
    );
  }
  return context;
}
