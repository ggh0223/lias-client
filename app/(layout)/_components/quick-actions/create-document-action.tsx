"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateDocumentActionProps {
  variant?: "button" | "quick-action";
  className?: string;
}

export const CreateDocumentAction = ({
  variant = "button",
  className = "",
}: CreateDocumentActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDocument = async () => {
    try {
      setIsLoading(true);
      // 새 문서 작성 페이지로 이동
      router.push("/approval/draft/new");
    } catch (error) {
      console.error("문서 작성 페이지 이동 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "quick-action") {
    return (
      <button
        onClick={handleCreateDocument}
        disabled={isLoading}
        className={`flex items-center gap-3 p-4 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors ${className}`}
      >
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div className="text-left">
          <div className="font-medium text-primary">새 문서 작성</div>
          <div className="text-sm text-secondary">결재 문서를 작성하세요</div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleCreateDocument}
      disabled={isLoading}
      className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? "이동 중..." : "새 문서 작성"}
    </button>
  );
};
