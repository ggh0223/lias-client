import { useState, useEffect } from "react";
import {
  FormApprovalLine,
  CreateFormApprovalLineRequest,
  UpdateFormApprovalLineRequest,
  PaginationMeta,
  PaginatedResponse,
  GetFormApprovalLinesParams,
  getFormApprovalLinesApi,
  getFormApprovalLineApi,
  createFormApprovalLineApi,
  updateFormApprovalLineApi,
  deleteFormApprovalLineApi,
} from "../../../_lib/api/document-api";

export const useApprovalLines = () => {
  const [approvalLines, setApprovalLines] = useState<FormApprovalLine[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentType, setCurrentType] = useState<"COMMON" | "CUSTOM">("CUSTOM");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 결재선 목록 조회 (서버 필터링 지원)
  const fetchApprovalLines = async (
    params: GetFormApprovalLinesParams = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data: PaginatedResponse<FormApprovalLine> =
        await getFormApprovalLinesApi(params);
      console.log("data", data);
      setApprovalLines(data.items);
      setPaginationMeta(data.meta);
      setCurrentPage(data.meta.page);
      setPageSize(data.meta.limit);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 목록 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const params: GetFormApprovalLinesParams = {
      page,
      limit: pageSize,
      type: currentType,
      search: searchTerm || undefined,
    };
    fetchApprovalLines(params);
  };

  // 타입 변경 핸들러
  const handleTypeChange = (type: "COMMON" | "CUSTOM") => {
    setCurrentType(type);
    const params: GetFormApprovalLinesParams = {
      page: 1, // 타입 변경 시 첫 페이지로
      limit: pageSize,
      type,
      search: searchTerm || undefined,
    };
    fetchApprovalLines(params);
  };

  // 검색 핸들러
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    const params: GetFormApprovalLinesParams = {
      page: 1, // 검색 시 첫 페이지로
      limit: pageSize,
      type: currentType,
      search: search || undefined,
    };
    fetchApprovalLines(params);
  };

  // 결재선 상세 조회
  const fetchApprovalLine = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFormApprovalLineApi(id);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 상세 조회에 실패했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 결재선 생성
  const createApprovalLine = async (
    requestData: CreateFormApprovalLineRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newApprovalLine = await createFormApprovalLineApi(requestData);
      // 생성 후 현재 필터 조건으로 다시 로드
      const params: GetFormApprovalLinesParams = {
        page: currentPage,
        limit: pageSize,
        type: currentType,
        search: searchTerm || undefined,
      };
      await fetchApprovalLines(params);
      return newApprovalLine;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 생성에 실패했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 결재선 수정
  const updateApprovalLine = async (
    id: string,
    requestData: UpdateFormApprovalLineRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedApprovalLine = await updateFormApprovalLineApi(
        id,
        requestData
      );
      console.log(updatedApprovalLine);
      // 수정 후 현재 필터 조건으로 다시 로드
      const params: GetFormApprovalLinesParams = {
        page: currentPage,
        limit: pageSize,
        type: currentType,
        search: searchTerm || undefined,
      };
      await fetchApprovalLines(params);
      return updatedApprovalLine;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 수정에 실패했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 결재선 삭제
  const deleteApprovalLine = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteFormApprovalLineApi(id);
      // 삭제 후 현재 필터 조건으로 다시 로드
      const params: GetFormApprovalLinesParams = {
        page: currentPage,
        limit: pageSize,
        type: currentType,
        search: searchTerm || undefined,
      };
      await fetchApprovalLines(params);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 삭제에 실패했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchApprovalLines({ page: 1, limit: 10 });
  }, []);

  return {
    approvalLines,
    paginationMeta,
    currentType,
    searchTerm,
    loading,
    error,
    fetchApprovalLines,
    handlePageChange,
    handleTypeChange,
    handleSearch,
    fetchApprovalLine,
    createApprovalLine,
    updateApprovalLine,
    deleteApprovalLine,
  };
};
