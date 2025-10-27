/**
 * Empty State Panel - 결재 대기 건이 없을 때 표시
 */

import Link from "next/link";

export default function EmptyStatePanel() {
  return (
    <div className="bg-white shadow rounded-lg p-12">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          결재 대기 건이 없습니다
        </h3>
        <p className="text-sm text-gray-500 mb-6">모든 결재를 완료했습니다!</p>
        <Link
          href="/documents/my"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          내 문서 보기
        </Link>
      </div>
    </div>
  );
}
