"use client";

import { useState, useEffect } from "react";
import { clientAuth } from "@/lib/auth-client";
import { useApprovalProcess } from "@/contexts/approval-process-context";
import type { StepSnapshot } from "@/types/approval-process";
import EmptyStatePanel from "./components/empty-state-panel";
import ApprovalListSection from "./sections/approval-list-section";
import ApprovalActionSection from "./sections/approval-action-section";
import ApprovalStatsWidget from "./widgets/approval-stats-widget";

interface PendingApprovalsClientProps {
  initialApprovals: StepSnapshot[];
  token: string;
}

export default function PendingApprovalsClient({}: PendingApprovalsClientProps) {
  const {
    pendingApprovals,
    loading,
    error,
    fetchPendingApprovals,
    approve,
    reject,
    completeAgreement,
    completeImplementation,
  } = useApprovalProcess();

  const [selectedApproval, setSelectedApproval] = useState<StepSnapshot | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState("");

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      const currentToken = clientAuth.getToken();
      if (currentToken) {
        await fetchPendingApprovals(currentToken);
      }
    };
    loadData();
  }, [fetchPendingApprovals]);

  const getStepTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      AGREEMENT: "협의",
      APPROVAL: "결재",
      IMPLEMENTATION: "시행",
      REFERENCE: "참조",
    };
    return labels[type] || type;
  };

  const getStepTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      AGREEMENT: "bg-purple-100 text-purple-800",
      APPROVAL: "bg-blue-100 text-blue-800",
      IMPLEMENTATION: "bg-green-100 text-green-800",
      REFERENCE: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "대기", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "승인", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      COMPLETED: { label: "완료", className: "bg-blue-100 text-blue-800" },
    };

    const badge = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;

    setLocalError("");

    try {
      const currentToken = clientAuth.getToken();
      if (!currentToken) {
        setLocalError("인증 토큰을 찾을 수 없습니다.");
        return;
      }

      if (selectedApproval.stepType === "AGREEMENT") {
        await completeAgreement(currentToken, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      } else if (selectedApproval.stepType === "APPROVAL") {
        await approve(currentToken, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      } else if (selectedApproval.stepType === "IMPLEMENTATION") {
        await completeImplementation(currentToken, {
          stepSnapshotId: selectedApproval.id,
          comment,
        });
      }

      // 성공 시 목록 새로고침
      setSelectedApproval(null);
      setComment("");
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error ? err.message : "처리 중 오류가 발생했습니다."
      );
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !comment.trim()) {
      setLocalError("반려 사유를 입력해주세요.");
      return;
    }

    setLocalError("");

    try {
      const currentToken = clientAuth.getToken();
      if (!currentToken) {
        setLocalError("인증 토큰을 찾을 수 없습니다.");
        return;
      }

      await reject(currentToken, {
        stepSnapshotId: selectedApproval.id,
        comment,
      });

      // 성공 시 목록 새로고침
      setSelectedApproval(null);
      setComment("");
    } catch (err: unknown) {
      setLocalError(
        err instanceof Error ? err.message : "반려 처리 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">결재 대기 목록</h1>
          <p className="mt-1 text-sm text-gray-500">
            나에게 할당된 결재 대기 건을 확인하고 처리하세요.
          </p>
        </div>
        <ApprovalStatsWidget count={pendingApprovals.length} />
      </div>

      {pendingApprovals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ApprovalListSection
            approvals={pendingApprovals}
            selectedApproval={selectedApproval}
            onSelect={setSelectedApproval}
            getStepTypeLabel={getStepTypeLabel}
            getStepTypeColor={getStepTypeColor}
            getStatusBadge={getStatusBadge}
          />

          <ApprovalActionSection
            selectedApproval={selectedApproval}
            comment={comment}
            onCommentChange={setComment}
            loading={loading}
            error={(localError || error) ?? null}
            getStepTypeLabel={getStepTypeLabel}
            getStepTypeColor={getStepTypeColor}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      ) : (
        <EmptyStatePanel />
      )}
    </div>
  );
}
