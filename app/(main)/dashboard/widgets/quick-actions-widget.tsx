/**
 * Quick Actions Widget - 빠른 작업 위젯
 */

export default function QuickActionsWidget() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <a
          href="/documents/new"
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl mb-2">✏️</span>
          <span className="text-sm font-medium text-gray-900">
            새 문서 작성
          </span>
        </a>
        <a
          href="/approval/pending"
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl mb-2">✅</span>
          <span className="text-sm font-medium text-gray-900">결재 처리</span>
        </a>
        <a
          href="/documents/my"
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl mb-2">📄</span>
          <span className="text-sm font-medium text-gray-900">내 문서</span>
        </a>
        <a
          href="/admin/forms"
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl mb-2">⚙️</span>
          <span className="text-sm font-medium text-gray-900">관리</span>
        </a>
      </div>
    </div>
  );
}
