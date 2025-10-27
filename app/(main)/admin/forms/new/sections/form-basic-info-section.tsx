"use client";

interface FormBasicInfoSectionProps {
  formName: string;
  onFormNameChange: (value: string) => void;
  formCode: string;
  onFormCodeChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  loading: boolean;
}

export default function FormBasicInfoSection({
  formName,
  onFormNameChange,
  formCode,
  onFormCodeChange,
  description,
  onDescriptionChange,
  loading,
}: FormBasicInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          템플릿명 *
        </label>
        <input
          type="text"
          required
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="예: 지출결의서"
          value={formName}
          onChange={(e) => onFormNameChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          템플릿 코드 *
        </label>
        <input
          type="text"
          required
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="예: EXPENSE_FORM"
          value={formCode}
          onChange={(e) => onFormCodeChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          rows={3}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="템플릿에 대한 설명을 입력하세요"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
