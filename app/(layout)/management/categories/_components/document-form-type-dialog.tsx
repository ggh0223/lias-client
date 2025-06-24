"use client";

import { useState, useEffect } from "react";
import {
  DocumentFormType,
  CreateDocumentFormTypeRequest,
  UpdateDocumentFormTypeRequest,
} from "@/app/(layout)/_lib/api/document-api";

interface DocumentFormTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateDocumentFormTypeRequest | UpdateDocumentFormTypeRequest
  ) => Promise<void>;
  formType?: DocumentFormType | null;
  isLoading?: boolean;
}

export const DocumentFormTypeDialog = ({
  isOpen,
  onClose,
  onSubmit,
  formType,
  isLoading = false,
}: DocumentFormTypeDialogProps) => {
  const [name, setName] = useState("");
  const [documentNumberCode, setDocumentNumberCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!formType;

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && formType) {
        setName(formType.name);
        setDocumentNumberCode(formType.documentNumberCode);
      } else {
        setName("");
        setDocumentNumberCode("");
      }
      setError(null);
    }
  }, [isOpen, isEditMode, formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("분류명을 입력해주세요.");
      return;
    }

    if (!documentNumberCode.trim()) {
      setError("문서 번호 코드를 입력해주세요.");
      return;
    }

    try {
      if (isEditMode && formType) {
        await onSubmit({
          name: name.trim(),
          documentNumberCode: documentNumberCode.trim(),
          documentTypeId: formType.documentTypeId,
        } as UpdateDocumentFormTypeRequest);
      } else {
        await onSubmit({
          name: name.trim(),
          documentNumberCode: documentNumberCode.trim(),
        } as CreateDocumentFormTypeRequest);
      }
      onClose();
    } catch {
      // 에러는 상위 컴포넌트에서 처리됨
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary">
            {isEditMode ? "문서양식 분류 수정" : "문서양식 분류 생성"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-secondary hover:text-primary disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-primary mb-2"
            >
              분류명 *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              placeholder="예: 휴가, 출장, 구매 등"
            />
          </div>

          <div>
            <label
              htmlFor="documentNumberCode"
              className="block text-sm font-medium text-primary mb-2"
            >
              문서 번호 코드 *
            </label>
            <input
              type="text"
              id="documentNumberCode"
              value={documentNumberCode}
              onChange={(e) => setDocumentNumberCode(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              placeholder="예: VAC-001, TRV-001, PUR-001"
            />
          </div>

          {error && (
            <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-border rounded-lg text-secondary hover:bg-surface disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "처리 중..." : isEditMode ? "수정" : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
