/**
 * Dashboard Stats Section
 * 통계 정보를 표시하는 섹션
 */

import StatsPanel from "../panels/stats-panel";

interface DashboardStatsSectionProps {
  stats: {
    pendingApprovals: number;
    myDocuments: number;
    draftDocuments: number;
    pendingDocuments: number;
  };
}

export default function DashboardStatsSection({
  stats,
}: DashboardStatsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">통계</h2>
      <StatsPanel stats={stats} />
    </div>
  );
}
