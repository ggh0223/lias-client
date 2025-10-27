"use client";

interface FormTemplateSectionProps {
  template: string;
  onTemplateChange: (value: string) => void;
  loading: boolean;
}

export default function FormTemplateSection({
  template,
  onTemplateChange,
  loading,
}: FormTemplateSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">HTML 템플릿</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          문서템플릿 HTML 코드
        </label>
        <textarea
          rows={8}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="예: <h1>휴가 신청서</h1><p>신청 내용: </p>"
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          문서 작성 시 기본으로 표시될 HTML 템플릿을 입력하세요. 빈 채로 두면 빈
          템플릿으로 생성됩니다.
        </p>
      </div>
    </div>
  );
}
