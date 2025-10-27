"use client";

interface DocumentContentSectionProps {
  content: string;
}

export default function DocumentContentSection({
  content,
}: DocumentContentSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">문서 내용</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
