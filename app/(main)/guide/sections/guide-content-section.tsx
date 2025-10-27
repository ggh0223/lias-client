/**
 * Guide Content Section - 가이드 콘텐츠 섹션
 */

interface GuideContentSectionProps {
  activeTab: string;
  OverviewSection: () => JSX.Element;
  GlossarySection?: () => JSX.Element;
  FlowSection: () => JSX.Element;
  EntitiesSection: () => JSX.Element;
  RolesSection: () => JSX.Element;
  StatusSection: () => JSX.Element;
}

export default function GuideContentSection({
  activeTab,
  OverviewSection,
  GlossarySection,
  FlowSection,
  EntitiesSection,
  RolesSection,
  StatusSection,
}: GuideContentSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      {activeTab === "overview" && <OverviewSection />}
      {activeTab === "glossary" && GlossarySection && <GlossarySection />}
      {activeTab === "flow" && <FlowSection />}
      {activeTab === "entities" && <EntitiesSection />}
      {activeTab === "roles" && <RolesSection />}
      {activeTab === "status" && <StatusSection />}
    </div>
  );
}
