"use client";

export default function ApprovalLinesPage() {
  return (
    <div className="flex flex-col h-full min-h-screen p-6 bg-white">
      {/* 상단: 경로/검색바 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-secondary">
          전자결재 &gt; 결재설정 &gt;{" "}
          <span className="text-primary font-semibold">결재라인설정</span>
        </div>
        <button className="text-xs text-blue-500">도움말</button>
      </div>

      <div className="flex flex-1 gap-4">
        {/* 좌측: 결재라인 목록 */}
        <div className="w-[320px] min-w-[260px] max-w-[400px] flex flex-col border border-border rounded-lg bg-surface"></div>

        {/* 우측: 결재라인 상세/탭 */}
        <div className="flex-1 flex flex-col border border-border rounded-lg bg-white"></div>
      </div>
    </div>
  );
}
