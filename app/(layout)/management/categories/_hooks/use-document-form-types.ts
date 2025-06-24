"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DocumentFormType,
  CreateDocumentFormTypeRequest,
  UpdateDocumentFormTypeRequest,
  getDocumentFormTypes,
  createDocumentFormType,
  updateDocumentFormType,
  deleteDocumentFormType,
} from "@/app/(layout)/_lib/api/document-api";

export const useDocumentFormTypes = () => {
  const [documentFormTypes, setDocumentFormTypes] = useState<
    DocumentFormType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 문서양식 분류 목록 조회
  const fetchDocumentFormTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDocumentFormTypes();
      setDocumentFormTypes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "문서양식 분류 목록 조회에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 문서양식 분류 생성
  const createFormType = useCallback(
    async (data: CreateDocumentFormTypeRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const newFormType = await createDocumentFormType(data);
        setDocumentFormTypes((prev) => [...prev, newFormType]);
        return newFormType;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "문서양식 분류 생성에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 문서양식 분류 수정
  const updateFormType = useCallback(
    async (id: string, data: UpdateDocumentFormTypeRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const updatedFormType = await updateDocumentFormType(id, data);
        setDocumentFormTypes((prev) =>
          prev.map((formType) =>
            formType.documentTypeId === id ? updatedFormType : formType
          )
        );
        return updatedFormType;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "문서양식 분류 수정에 실패했습니다.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 문서양식 분류 삭제
  const deleteFormType = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteDocumentFormType(id);
      setDocumentFormTypes((prev) =>
        prev.filter((formType) => formType.documentTypeId !== id)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "문서양식 분류 삭제에 실패했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 검색 필터링
  const filteredFormTypes = documentFormTypes.filter(
    (formType) =>
      formType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formType.documentNumberCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchDocumentFormTypes();
  }, [fetchDocumentFormTypes]);

  return {
    documentFormTypes: filteredFormTypes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createFormType,
    updateFormType,
    deleteFormType,
    fetchDocumentFormTypes,
  };
};
