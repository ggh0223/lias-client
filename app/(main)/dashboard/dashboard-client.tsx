"use client";

import type { User } from "@/lib/auth-client";
import type { StepSnapshot } from "@/types/approval-process";
import type { Document } from "@/types/document";
import DashboardStatsSection from "./sections/dashboard-stats-section";
import DashboardContentSection from "./sections/dashboard-content-section";
import QuickActionsWidget from "./widgets/quick-actions-widget";

interface DashboardClientProps {
  user: User;
  stats: {
    pendingApprovals: number;
    myDocuments: number;
    draftDocuments: number;
    pendingDocuments: number;
  };
  pendingApprovals: StepSnapshot[];
  recentDocuments: Document[];
}

export default function DashboardClient({
  user,
  stats,
  pendingApprovals,
  recentDocuments,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          안녕하세요, {user.name}님!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {user.employeeNumber} | {user.email}
        </p>
      </div>

      {/* Stats Section */}
      <DashboardStatsSection stats={stats} />

      {/* Content Section */}
      <DashboardContentSection
        pendingApprovals={pendingApprovals}
        recentDocuments={recentDocuments}
      />

      {/* Quick Actions Widget */}
      <QuickActionsWidget />
    </div>
  );
}
