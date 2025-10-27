"use client";

import type { TemplateVersionDetail } from "@/types/approval-flow";
import VersionHeaderPanel from "../components/version-header-panel";
import StepsPanel from "../components/steps-panel";

interface VersionInfoSectionProps {
  currentVersion: TemplateVersionDetail;
}

export default function VersionInfoSection({
  currentVersion,
}: VersionInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <VersionHeaderPanel currentVersion={currentVersion} />
      <StepsPanel currentVersion={currentVersion} />
    </div>
  );
}
