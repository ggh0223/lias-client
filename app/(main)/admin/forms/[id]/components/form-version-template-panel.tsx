"use client";

interface FormVersionTemplatePanelProps {
  template: string;
}

export default function FormVersionTemplatePanel({
  template,
}: FormVersionTemplatePanelProps) {
  if (!template) {
    return (
      <div className="py-6 text-center border-t border-gray-200">
        <p className="text-sm text-gray-500">템플릿 내용이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <dt className="text-sm font-medium text-gray-500 mb-3">템플릿 내용</dt>
      <dd className="mt-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: template }}
          />
        </div>
      </dd>
    </div>
  );
}
