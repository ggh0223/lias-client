"use client";

import { useState } from "react";
import { useDocumentFormTypes } from "./_hooks/use-document-form-types";
import { DocumentFormTypeTable } from "./_components/document-form-type-table";
import { DocumentFormTypeDialog } from "./_components/document-form-type-dialog";
import {
  DocumentFormType,
  CreateDocumentFormTypeRequest,
  UpdateDocumentFormTypeRequest,
} from "@/app/(layout)/_lib/api/document-api";

export default function CategoriesPage() {
  const {
    documentFormTypes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createFormType,
    updateFormType,
    deleteFormType,
  } = useDocumentFormTypes();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFormType, setEditingFormType] =
    useState<DocumentFormType | null>(null);

  const handleCreate = () => {
    setEditingFormType(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (formType: DocumentFormType) => {
    setEditingFormType(formType);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 문서양식 분류를 삭제하시겠습니까?")) {
      try {
        await deleteFormType(id);
      } catch {
        // 에러는 훅에서 처리됨
      }
    }
  };

  const handleSubmit = async (
    data: CreateDocumentFormTypeRequest | UpdateDocumentFormTypeRequest
  ) => {
    try {
      if (editingFormType) {
        await updateFormType(
          editingFormType.documentTypeId,
          data as UpdateDocumentFormTypeRequest
        );
      } else {
        await createFormType(data as CreateDocumentFormTypeRequest);
      }
    } catch {
      // 에러는 훅에서 처리됨
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            문서양식 분류 관리
          </h1>
          <p className="text-secondary mt-1">
            문서양식 분류를 생성하고 관리하세요
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          분류 생성
        </button>
      </div>

      {/* 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="분류명 또는 문서 번호 코드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* 문서양식 분류 테이블 */}
      <DocumentFormTypeTable
        documentFormTypes={documentFormTypes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 생성/수정 다이얼로그 */}
      <DocumentFormTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        formType={editingFormType}
        isLoading={isLoading}
      />
    </div>
  );
}
