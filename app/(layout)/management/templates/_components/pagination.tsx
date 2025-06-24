"use client";

import { PaginationMeta } from "@/app/(layout)/_lib/api/document-api";

interface PaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  if (!meta) return null;

  const { total, page, limit, hasNext } = meta;
  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (targetPage: number) => {
    if (targetPage !== page) {
      onPageChange(targetPage);
    }
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-secondary">
        총 {total}개 양식 중 {startItem}-{endItem} 표시
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={page <= 1}
          className="px-3 py-1 border border-border rounded text-sm text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() =>
              typeof pageNum === "number" && handlePageClick(pageNum)
            }
            disabled={pageNum === "..."}
            className={`px-3 py-1 border border-border rounded text-sm ${
              pageNum === page
                ? "bg-primary text-white border-primary"
                : pageNum === "..."
                ? "text-secondary cursor-default"
                : "text-secondary hover:bg-surface"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="px-3 py-1 border border-border rounded text-sm text-secondary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
};
