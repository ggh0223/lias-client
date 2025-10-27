"use client";

import type { Form } from "@/types/approval-flow";
import FormBasicInfoPanel from "../components/form-basic-info-panel";

interface FormInfoSectionProps {
  form: Form;
}

export default function FormInfoSection({ form }: FormInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>
      </div>
      <FormBasicInfoPanel form={form} />
    </div>
  );
}
