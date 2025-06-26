"use client";

import { useState, useEffect } from "react";
import { useDocumentForms } from "./_hooks/use-document-forms";
import { DocumentFormTable } from "./_components/document-form-table";
import { DocumentFormDialog } from "./_components/document-form-dialog";
import { Pagination } from "./_components/pagination";
import {
  DocumentForm,
  CreateDocumentFormRequest,
  UpdateDocumentFormRequest,
} from "@/app/(layout)/_lib/api/document-api";
import {
  getDocumentFormTypes,
  DocumentFormType,
} from "@/app/(layout)/_lib/api/document-api";

export default function TemplatesPage() {
  const {
    documentForms,
    paginationMeta,
    searchTerm,
    isLoading,
    error,
    handlePageChange,
    handleSearch,
    createForm,
    updateForm,
    deleteForm,
  } = useDocumentForms();
  console.log("documentForms", documentForms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<DocumentForm | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentFormType[]>([]);

  // 문서양식 분류 목록 로드
  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const types = await getDocumentFormTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error("문서양식 분류 로드 실패:", error);
      }
    };
    loadDocumentTypes();
  }, []);

  const handleCreate = () => {
    setEditingForm(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (form: DocumentForm) => {
    setEditingForm(form);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 문서양식을 삭제하시겠습니까?")) {
      try {
        await deleteForm(id);
      } catch {
        // 에러는 훅에서 처리됨
      }
    }
  };

  const handleSubmit = async (
    data: CreateDocumentFormRequest | UpdateDocumentFormRequest
  ) => {
    try {
      if (editingForm) {
        await updateForm(
          editingForm.documentFormId,
          data as UpdateDocumentFormRequest
        );
      } else {
        await createForm(data as CreateDocumentFormRequest);
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
          <h1 className="text-2xl font-bold text-primary">문서양식 관리</h1>
          <p className="text-secondary mt-1">
            문서 템플릿을 생성하고 관리하세요
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          양식 생성
        </button>
      </div>

      {/* 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="양식명으로 검색"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
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

      {/* 문서양식 테이블 */}
      <DocumentFormTable
        forms={documentForms}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* 페이지네이션 */}
      <Pagination meta={paginationMeta} onPageChange={handlePageChange} />

      {/* 생성/수정 다이얼로그 */}
      <DocumentFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        form={editingForm}
        documentTypes={documentTypes}
        isLoading={isLoading}
      />
    </div>
  );
}
