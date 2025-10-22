"use client";

import Link from "next/link";
import type { User } from "@/lib/auth-client";
import type { ApprovalStep, Document } from "@/types/api";

interface DashboardClientProps {
  user: User;
  stats: {
    pendingApprovals: number;
    myDocuments: number;
    draftDocuments: number;
    pendingDocuments: number;
  };
  pendingApprovals: ApprovalStep[];
  recentDocuments: Document[];
}

export default function DashboardClient({
  user,
  stats,
  pendingApprovals,
  recentDocuments,
}: DashboardClientProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DRAFT: { label: "임시저장", className: "bg-gray-100 text-gray-800" },
      PENDING: {
        label: "결재대기",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "승인완료", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "반려", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "취소", className: "bg-gray-100 text-gray-800" },
      IMPLEMENTED: {
        label: "시행완료",
        className: "bg-blue-100 text-blue-800",
      },
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          안녕하세요, {user.name}님!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {user.employeeNumber} | {user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">⏳</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    결재 대기
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.pendingApprovals}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/approval/pending"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              전체 보기 →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">📄</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    내 문서
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.myDocuments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/documents/my"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              전체 보기 →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">📝</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    임시저장
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.draftDocuments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/documents/my?status=DRAFT"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              전체 보기 →
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🕐</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    진행 중
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.pendingDocuments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link
              href="/documents/my?status=PENDING"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              전체 보기 →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              최근 결재 대기
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {pendingApprovals.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {pendingApprovals.map((approval) => (
                  <li key={approval.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {approval.stepType} -{" "}
                          {approval.description || "결재 요청"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(approval.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/approval/pending?step=${approval.id}`}
                        className="ml-4 text-blue-600 hover:text-blue-500 text-sm"
                      >
                        처리 →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                결재 대기 건이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              최근 문서
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {recentDocuments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <li key={doc.id} className="py-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {doc.title}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          {getStatusBadge(doc.status)}
                          <span className="text-xs text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/documents/${doc.id}`}
                        className="ml-4 text-blue-600 hover:text-blue-500 text-sm"
                      >
                        보기 →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">문서가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/documents/new"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl mb-2">✏️</span>
            <span className="text-sm font-medium text-gray-900">
              새 문서 작성
            </span>
          </Link>
          <Link
            href="/approval/pending"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl mb-2">✅</span>
            <span className="text-sm font-medium text-gray-900">결재 처리</span>
          </Link>
          <Link
            href="/documents/my"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl mb-2">📄</span>
            <span className="text-sm font-medium text-gray-900">내 문서</span>
          </Link>
          <Link
            href="/admin/forms"
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl mb-2">⚙️</span>
            <span className="text-sm font-medium text-gray-900">관리</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
