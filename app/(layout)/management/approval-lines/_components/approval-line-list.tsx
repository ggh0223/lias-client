import React from "react";

interface ApprovalLineListProps {
  lines: { id: string; no: number; type: string; name: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ApprovalLineList: React.FC<ApprovalLineListProps> = ({
  lines,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}) => (
  <div className="flex flex-col h-full">
    {/* 상단 타이틀/버튼 */}
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gray-50">
      <span className="font-semibold text-sm text-primary">결재라인 목록</span>
      <div className="flex gap-1">
        <button
          className="bg-primary text-white px-2 py-1 rounded text-xs"
          onClick={onCreate}
        >
          등록
        </button>
        <button
          className="bg-surface text-primary border border-border px-2 py-1 rounded text-xs"
          onClick={onEdit}
        >
          수정
        </button>
        <button
          className="bg-danger text-white px-2 py-1 rounded text-xs"
          onClick={onDelete}
        >
          삭제
        </button>
      </div>
    </div>
    {/* 목록 테이블 */}
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface">
            <th className="w-10 font-medium text-secondary">No</th>
            <th className="font-medium text-secondary">문서분류</th>
            <th className="font-medium text-secondary">결재라인명</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-secondary py-4">
                결재라인이 없습니다.
              </td>
            </tr>
          ) : (
            lines.map((line) => (
              <tr
                key={line.id}
                className={`cursor-pointer ${
                  selectedId === line.id ? "bg-primary/10" : ""
                } hover:bg-primary/5`}
                onClick={() => onSelect(line.id)}
              >
                <td className="text-center">{line.no}</td>
                <td>{line.type}</td>
                <td>{line.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ApprovalLineList;
