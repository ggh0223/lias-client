"use client";

import { useState } from "react";
import type { ApprovalLineTemplate } from "@/types/approval-flow";
import TemplateManagementSection from "./sections/template-management-section";
import CreateTemplateWidget from "./widgets/create-template-widget";

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
        <CreateTemplateWidget />
      </div>

      <TemplateManagementSection
        templates={filteredTemplates}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        getTypeBadge={getTypeBadge}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
