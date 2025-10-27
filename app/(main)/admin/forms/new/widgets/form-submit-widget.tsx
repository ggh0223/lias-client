"use client";

interface FormSubmitWidgetProps {
  loading: boolean;
  onCancel: () => void;
}

export default function FormSubmitWidget({
  loading,
  onCancel,
}: FormSubmitWidgetProps) {
  return (
    <div className="flex justify-end space-x-3 bg-white shadow rounded-lg p-6">
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
  );
}
