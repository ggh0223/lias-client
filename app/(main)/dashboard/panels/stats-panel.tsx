/**
 * Stats Panel - 통계 카드 패널
 */

interface StatsPanelProps {
  stats: {
    pendingApprovals: number;
    myDocuments: number;
    draftDocuments: number;
    pendingDocuments: number;
  };
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* 결재 대기 */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">결재 대기</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.pendingApprovals}
            </p>
          </div>
          <div className="text-yellow-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 내 문서 */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">내 문서</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.myDocuments}
            </p>
          </div>
          <div className="text-blue-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 임시저장 */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">임시저장</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.draftDocuments}
            </p>
          </div>
          <div className="text-gray-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 8v4m-4-4v4m2-8H9.5A2.5 2.5 0 0010 7.5v9A2.5 2.5 0 0012.5 19h3A2.5 2.5 0 0018 16.5v-9A2.5 2.5 0 0016.5 5H12"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 결재 진행 */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">결재 진행</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.pendingDocuments}
            </p>
          </div>
          <div className="text-green-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-5 0v14m5 0V9M5 9h4m0 0H7m2 0v4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
