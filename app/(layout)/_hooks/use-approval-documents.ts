import { useState, useEffect, useCallback, useMemo } from "react";
import {
  approvalApi,
  PaginationQueryDto,
  CreateDraftDocumentDto,
  UpdateDraftDocumentDto,
  ApprovalResponseDto,
} from "../_lib/api/approval-api";

// 타입들을 export
export type {
  CreateDraftDocumentDto,
  UpdateDraftDocumentDto,
  ApprovalResponseDto,
};

// 문서 목록 조회 훅
export const useApprovalDocuments = (params?: PaginationQueryDto) => {
  const [documents, setDocuments] = useState<ApprovalResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // params를 문자열로 직렬화하여 안정적인 의존성 생성
  const paramsKey = useMemo(() => {
    if (!params) return "";
    return JSON.stringify(params);
  }, [params]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalApi.getDraftList(params);
      console.log("response", response);
      setDocuments(response.items || []);

      // meta가 있는 경우에만 설정, 없으면 기본값 사용
      if (response.meta) {
        setTotal(response.meta.total || 0);
        setPage(response.meta.page || 1);
        setLimit(response.meta.limit || 10);
      } else {
        // meta가 없는 경우 기본값 설정
        setTotal(response.items?.length || 0);
        setPage(1);
        setLimit(10);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문서 목록 조회에 실패했습니다."
      );
      setDocuments([]);
      setTotal(0);
      setPage(1);
      setLimit(10);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    total,
    page,
    limit,
    loading,
    error,
    mutate: fetchDocuments,
  };
};

// 단일 문서 조회 훅
export const useApprovalDocument = (id: string) => {
  const [document, setDocument] = useState<ApprovalResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await approvalApi.getDraft(id);
      setDocument(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문서 조회에 실패했습니다."
      );
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  return {
    document,
    loading,
    error,
    mutate: fetchDocument,
  };
};

// 문서 생성 훅
export const useCreateApprovalDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDocument = async (data: CreateDraftDocumentDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await approvalApi.createDraft(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "문서 생성에 실패했습니다.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createDocument, loading, error };
};

// 문서 수정 훅
export const useUpdateApprovalDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDocument = async (id: string, data: UpdateDraftDocumentDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await approvalApi.updateDraft(id, data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "문서 수정에 실패했습니다.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateDocument, loading, error };
};

// 문서 삭제 훅
export const useDeleteApprovalDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await approvalApi.deleteDraft(id);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "문서 삭제에 실패했습니다.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDocument, loading, error };
};
