"use client";

import { DocumentFormType } from "@/app/(layout)/_lib/api/document-api";

interface DocumentFormTypeTableProps {
  documentFormTypes: DocumentFormType[];
  isLoading: boolean;
  onEdit: (formType: DocumentFormType) => void;
  onDelete: (id: string) => void;
}

export const DocumentFormTypeTable = ({
  documentFormTypes,
  isLoading,
  onEdit,
  onDelete,
}: DocumentFormTypeTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">
            문서양식 분류 목록
          </h2>
        </div>
        <div className="p-6 text-center text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (documentFormTypes.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">
            문서양식 분류 목록
          </h2>
        </div>
        <div className="p-6 text-center text-secondary">
          등록된 문서양식 분류가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">
          문서양식 분류 목록
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50 border-b border-border">
            <tr>
              <th className="w-1/3 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                분류명
              </th>
              <th className="w-1/3 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                문서 번호 코드
              </th>
              <th className="w-1/3 px-4 py-2 text-left text-xs font-bold text-secondary uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documentFormTypes.map((formType) => (
              <tr key={formType.documentTypeId} className="hover:bg-surface/50">
                <td className="w-1/3 px-4 py-2">
                  <div className="text-sm font-medium text-primary truncate">
                    {formType.name}
                  </div>
                </td>
                <td className="w-1/3 px-4 py-2">
                  <div className="text-sm text-secondary truncate">
                    {formType.documentNumberCode}
                  </div>
                </td>
                <td className="w-1/3 px-4 py-2 text-sm font-medium">
                  <button
                    onClick={() => onEdit(formType)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(formType.documentTypeId)}
                    className="text-danger hover:text-danger/80"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
