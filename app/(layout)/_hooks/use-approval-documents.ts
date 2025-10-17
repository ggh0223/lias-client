import { useState, useEffect, useCallback } from "react";
import {
  approvalApi,
  CreateDraftDocumentDto,
  UpdateDraftDocumentDto,
  ApprovalResponseDto,
  ApprovalDocumentsQueryDto,
  PaginationData,
} from "../_lib/api/approval-api";

// 타입들을 export
export type {
  CreateDraftDocumentDto,
  UpdateDraftDocumentDto,
  ApprovalResponseDto,
};

export type DocumentListType =
  | "drafted" // 내가 상신한 문서
  | "pending_approval" // 결재 진행중 문서 (현재 차례)
  | "pending_agreement" // 협의 진행중 문서 (현재 차례)
  | "approved" // 결재 완료된 문서
  | "rejected" // 결재 반려된 문서
  | "received_reference" // 내가 수신한 문서 (참조)
  | "implementation"; // 내가 시행해야하는 문서 (현재 차례)

// 기존 API 타입들을 재사용
export type Employee = ApprovalResponseDto["drafter"];
export type ApprovalStep = ApprovalResponseDto["approvalSteps"][0];
export type Document = ApprovalResponseDto;
export type PaginationMeta = PaginationData<ApprovalResponseDto>["meta"];
export type ApprovalDocumentsResponse = PaginationData<ApprovalResponseDto>;

export interface UseApprovalDocumentsOptions {
  listType: DocumentListType;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useApprovalDocuments({
  listType,
  page = 1,
  limit = 20,
  enabled = true,
}: UseApprovalDocumentsOptions) {
  const [data, setData] = useState<ApprovalDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: ApprovalDocumentsQueryDto = {
        listType,
        page,
        limit,
      };

      const result = await approvalApi.getApprovalDocuments(params);
      console.log("문서 조회 결과:", result);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("문서 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listType, page, limit, enabled]);

  const refetch = () => {
    fetchDocuments();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}

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

// 전체 문서 조회 훅 (여러 상태의 문서를 동시에 가져옴)
export const useAllApprovalDocuments = (page = 1, limit = 20) => {
  const [data, setData] = useState<{
    [key in DocumentListType]?: ApprovalDocumentsResponse;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const listTypes: DocumentListType[] = [
        "drafted",
        "pending_approval",
        "pending_agreement",
        "approved",
        "rejected",
        "received_reference",
        "implementation",
      ];

      const promises = listTypes.map(async (listType) => {
        try {
          const params: ApprovalDocumentsQueryDto = {
            listType,
            page,
            limit,
          };
          const result = await approvalApi.getApprovalDocuments(params);
          return { listType, result };
        } catch (err) {
          console.error(`${listType} 문서 조회 오류:`, err);
          return { listType, result: null };
        }
      });

      const results = await Promise.all(promises);
      const newData: { [key in DocumentListType]?: ApprovalDocumentsResponse } =
        {};

      results.forEach(({ listType, result }) => {
        if (result) {
          newData[listType] = result;
        }
      });

      setData(newData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문서 조회 중 오류가 발생했습니다."
      );
      console.error("전체 문서 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const refetch = () => {
    fetchAllDocuments();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
