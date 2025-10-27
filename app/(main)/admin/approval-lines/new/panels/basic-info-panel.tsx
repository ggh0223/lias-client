/**
 * Basic Info Panel - 기본 정보 패널
 */

import type { ApprovalLineType, OrgScope } from "@/types/approval-flow";

interface BasicInfoPanelProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  type: ApprovalLineType;
  onTypeChange: (value: ApprovalLineType) => void;
  orgScope: OrgScope;
  onOrgScopeChange: (value: OrgScope) => void;
  departmentId: string;
  onDepartmentIdChange: (value: string) => void;
  loading: boolean;
}

export default function BasicInfoPanel({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  orgScope,
  onOrgScopeChange,
  departmentId,
  onDepartmentIdChange,
  loading,
}: BasicInfoPanelProps) {
  const templateTypes = [
    { value: "COMMON", label: "공통" },
    { value: "CUSTOM", label: "커스텀" },
  ];

  const orgScopes = [
    { value: "ALL", label: "전사 공통" },
    { value: "SPECIFIC_DEPARTMENT", label: "특정 부서 전용" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            템플릿 이름 *
          </label>
          <input
            type="text"
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="일반 결재선"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            템플릿 유형 *
          </label>
          <select
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as typeof type)}
            disabled={loading}
          >
            {templateTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          템플릿 설명
        </label>
        <textarea
          rows={3}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="결재선 템플릿 설명을 입력하세요"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            조직 범위 *
          </label>
          <select
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={orgScope}
            onChange={(e) =>
              onOrgScopeChange(e.target.value as typeof orgScope)
            }
            disabled={loading}
          >
            {orgScopes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {orgScope === "SPECIFIC_DEPARTMENT" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대상 부서 *
            </label>
            <input
              type="text"
              required
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="부서 ID를 입력하세요"
              value={departmentId}
              onChange={(e) => onDepartmentIdChange(e.target.value)}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
