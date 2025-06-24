"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DocumentForm,
  CreateDocumentFormRequest,
  UpdateDocumentFormRequest,
  GetDocumentFormsParams,
  PaginationMeta,
  getDocumentForms,
  createDocumentForm,
  updateDocumentForm,
  deleteDocumentForm,
} from "@/app/(layout)/_lib/api/document-api";

export const useDocumentForms = () => {
  const [documentForms, setDocumentForms] = useState<DocumentForm[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 문서양식 목록 조회
  const fetchDocumentForms = useCallback(
    async (params: GetDocumentFormsParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDocumentForms(params);
        setDocumentForms(data.items);
        setPaginationMeta(data.meta);
        setCurrentPage(data.meta.page);
        setPageSize(data.meta.limit);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "문서양식 목록 조회에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const params: GetDocumentFormsParams = {
      page,
      limit: pageSize,
      search: searchTerm || undefined,
    };
    fetchDocumentForms(params);
  };

  // 검색 핸들러
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    const params: GetDocumentFormsParams = {
      page: 1, // 검색 시 첫 페이지로
      limit: pageSize,
      search: search || undefined,
    };
    fetchDocumentForms(params);
  };

  // 문서양식 생성
  const createForm = useCallback(
    async (data: CreateDocumentFormRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const newForm = await createDocumentForm(data);
        // 생성 후 현재 필터 조건으로 다시 로드
        const params: GetDocumentFormsParams = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || undefined,
        };
        await fetchDocumentForms(params);
        return newForm;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "문서양식 생성에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, searchTerm, fetchDocumentForms]
  );

  // 문서양식 수정
  const updateForm = useCallback(
    async (id: string, data: UpdateDocumentFormRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const updatedForm = await updateDocumentForm(id, data);
        // 수정 후 현재 필터 조건으로 다시 로드
        const params: GetDocumentFormsParams = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || undefined,
        };
        await fetchDocumentForms(params);
        return updatedForm;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "문서양식 수정에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, searchTerm, fetchDocumentForms]
  );

  // 문서양식 삭제
  const deleteForm = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await deleteDocumentForm(id);
        // 삭제 후 현재 필터 조건으로 다시 로드
        const params: GetDocumentFormsParams = {
          page: currentPage,
          limit: pageSize,
          search: searchTerm || undefined,
        };
        await fetchDocumentForms(params);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "문서양식 삭제에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, pageSize, searchTerm, fetchDocumentForms]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchDocumentForms({ page: 1, limit: 10 });
  }, [fetchDocumentForms]);

  return {
    documentForms,
    paginationMeta,
    searchTerm,
    isLoading,
    error,
    fetchDocumentForms,
    handlePageChange,
    handleSearch,
    createForm,
    updateForm,
    deleteForm,
  };
};
