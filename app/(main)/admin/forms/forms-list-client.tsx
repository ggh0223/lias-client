"use client";

import { useState } from "react";
import type { Form } from "@/types/approval-flow";
import FormManagementSection from "./sections/form-management-section";
import CreateFormWidget from "./widgets/create-form-widget";

interface FormsListClientProps {
  initialForms: Form[];
  token: string;
}

export default function FormsListClient({
  initialForms,
}: FormsListClientProps) {
  const [forms] = useState(initialForms);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "활성", className: "bg-green-100 text-green-800" },
      INACTIVE: {
        label: "비활성",
        className: "bg-gray-100 text-gray-800",
      },
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
          <h1 className="text-2xl font-bold text-gray-900">문서템플릿 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            문서템플릿을 생성하고 관리합니다.
          </p>
        </div>
        <CreateFormWidget />
      </div>

      <FormManagementSection
        forms={filteredForms}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
