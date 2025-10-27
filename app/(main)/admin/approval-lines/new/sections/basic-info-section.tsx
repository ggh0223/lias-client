/**
 * Basic Info Section - 기본 정보 섹션
 */

import type { ApprovalLineType, OrgScope } from "@/types/approval-flow";
import BasicInfoPanel from "../panels/basic-info-panel";

interface BasicInfoSectionProps {
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

export default function BasicInfoSection({
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
}: BasicInfoSectionProps) {
  return (
    <section>
      <BasicInfoPanel
        name={name}
        onNameChange={onNameChange}
        description={description}
        onDescriptionChange={onDescriptionChange}
        type={type}
        onTypeChange={onTypeChange}
        orgScope={orgScope}
        onOrgScopeChange={onOrgScopeChange}
        departmentId={departmentId}
        onDepartmentIdChange={onDepartmentIdChange}
        loading={loading}
      />
    </section>
  );
}
