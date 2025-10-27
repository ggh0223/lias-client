/**
 * Template List Panel - 결재선 템플릿 목록 패널
 */

import Link from "next/link";
import type { ApprovalLineTemplate } from "@/types/approval-flow";

interface TemplateListPanelProps {
  templates: ApprovalLineTemplate[];
  getTypeBadge: (type: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

export default function TemplateListPanel({
  templates,
  getTypeBadge,
  getStatusBadge,
}: TemplateListPanelProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
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
              템플릿명
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              유형
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              조직 범위
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
              생성일
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {templates.map((template) => (
            <tr key={template.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {template.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTypeBadge(template.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{template.orgScope}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(template.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(template.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <Link
                  href={`/admin/approval-lines/${template.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  상세
                </Link>
                <Link
                  href={`/admin/approval-lines/${template.id}/versions/new`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  새 버전
                </Link>
                <Link
                  href={`/admin/approval-lines/${template.id}/clone`}
                  className="text-green-600 hover:text-green-900"
                >
                  복제
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
