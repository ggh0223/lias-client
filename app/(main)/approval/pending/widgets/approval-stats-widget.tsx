/**
 * Approval Stats Widget - 결재 통계 위젯
 */

interface ApprovalStatsWidgetProps {
  count: number;
}

export default function ApprovalStatsWidget({
  count,
}: ApprovalStatsWidgetProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">총</span>
      <span className="text-2xl font-bold text-blue-600">{count}</span>
      <span className="text-sm text-gray-500">건</span>
    </div>
  );
}
