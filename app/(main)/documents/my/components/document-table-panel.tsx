/**
 * Document Table Panel - 문서 목록 테이블 패널
 */

import Link from "next/link";
import type { Document } from "@/types/document";

interface DocumentTablePanelProps {
  documents: Document[];
  getStatusBadge: (status: string) => JSX.Element;
}

export default function DocumentTablePanel({
  documents,
  getStatusBadge,
}: DocumentTablePanelProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl">📄</span>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          문서가 없습니다
        </h3>
        <p className="mt-1 text-sm text-gray-500">새 문서를 작성해보세요.</p>
        <div className="mt-6">
          <Link
            href="/documents/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            ✏️ 새 문서 작성
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              문서 제목
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              상태
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              문서번호
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              작성일
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              제출일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => (window.location.href = `/documents/${doc.id}`)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {doc.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(doc.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.documentNumber || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.submittedAt
                  ? new Date(doc.submittedAt).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
