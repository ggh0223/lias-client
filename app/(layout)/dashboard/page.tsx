"use client";

import { AuthGuard } from "../_lib/auth/auth-guard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-primary">대시보드</h1>
          <p className="text-secondary mt-1">
            결재 시스템 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">상신 대기</p>
                <p className="text-2xl font-bold text-primary">5</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-warning"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">결재 대기</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">결재 완료</p>
                <p className="text-2xl font-bold text-primary">28</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">수신/참조</p>
                <p className="text-2xl font-bold text-primary">8</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-info"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 문서 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 상신 문서 */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">
                최근 상신 문서
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">휴가 신청서</p>
                    <p className="text-sm text-secondary">2024.01.15</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    대기
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">구매 요청서</p>
                    <p className="text-sm text-secondary">2024.01.14</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    승인
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">출장 신청서</p>
                    <p className="text-sm text-secondary">2024.01.13</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-danger/10 text-danger rounded-full">
                    반려
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 결재 문서 */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">
                최근 결재 문서
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">교육 신청서</p>
                    <p className="text-sm text-secondary">
                      김영희 • 2024.01.15
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    대기
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">장비 대여 신청서</p>
                    <p className="text-sm text-secondary">
                      박민수 • 2024.01.14
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
                    대기
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary">
                      회의실 예약 신청서
                    </p>
                    <p className="text-sm text-secondary">
                      이지은 • 2024.01.13
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                    승인
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
              <svg
                className="w-5 h-5 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              새 문서 작성
            </button>
            <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
              <svg
                className="w-5 h-5 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              결재 대기 문서
            </button>
            <button className="flex items-center justify-center p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
              <svg
                className="w-5 h-5 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              통계 보기
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
