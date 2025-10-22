"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApprovalLineTemplate } from "@/types/api";

interface ApprovalLinesListClientProps {
  initialTemplates: ApprovalLineTemplate[];
  token: string;
}

export default function ApprovalLinesListClient({
  initialTemplates,
}: ApprovalLinesListClientProps) {
  const [templates] = useState(initialTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      COMMON: { label: "공통", className: "bg-blue-100 text-blue-800" },
      CUSTOM: { label: "커스텀", className: "bg-purple-100 text-purple-800" },
    };

    const badge = typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DRAFT: { label: "초안", className: "bg-yellow-100 text-yellow-800" },
      ACTIVE: { label: "활성", className: "bg-green-100 text-green-800" },
      ARCHIVED: { label: "보관", className: "bg-gray-100 text-gray-800" },
    };

    const badge = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            결재선 템플릿 관리
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            결재선 템플릿을 생성하고 관리합니다.
          </p>
        </div>
        <Link
          href="/admin/approval-lines/new"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          새 템플릿 생성
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200 space-y-3">
          <input
            type="text"
            placeholder="템플릿명으로 검색..."
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterType === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterType("COMMON")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterType === "COMMON"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              공용
            </button>
            <button
              onClick={() => setFilterType("CUSTOM")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterType === "CUSTOM"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              커스텀
            </button>
          </div>
        </div>

        {filteredTemplates.length > 0 ? (
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
                {filteredTemplates.map((template) => (
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
                      <div className="text-sm text-gray-900">
                        {template.orgScope}
                      </div>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
