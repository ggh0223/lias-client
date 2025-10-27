/**
 * Submit Action Widget - 제출 액션 위젯
 */

interface SubmitActionWidgetProps {
  loading: boolean;
  error: string;
  onCancel: () => void;
}

export default function SubmitActionWidget({
  loading,
  error,
  onCancel,
}: SubmitActionWidgetProps) {
  return (
    <>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "생성 중..." : "생성하기"}
        </button>
      </div>
    </>
  );
}
