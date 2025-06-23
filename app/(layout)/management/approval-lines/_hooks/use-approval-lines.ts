import { useState, useEffect } from "react";
import {
  FormApprovalLine,
  CreateFormApprovalLineRequest,
  UpdateFormApprovalLineRequest,
  getFormApprovalLinesApi,
  getFormApprovalLineApi,
  createFormApprovalLineApi,
  updateFormApprovalLineApi,
  deleteFormApprovalLineApi,
} from "../../../_lib/api/document-api";

export const useApprovalLines = () => {
  const [approvalLines, setApprovalLines] = useState<FormApprovalLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 결재선 목록 조회
  const fetchApprovalLines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFormApprovalLinesApi();
      console.log("data", data);
      setApprovalLines(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 목록 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
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
      setApprovalLines((prev) => [...prev, newApprovalLine]);
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
      setApprovalLines((prev) => {
        console.log("prev", prev);
        return prev.map((line) =>
          line.formApprovalLineId === id ? updatedApprovalLine : line
        );
      });
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
      setApprovalLines((prev) =>
        prev.filter((line) => line.formApprovalLineId !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "결재선 삭제에 실패했습니다."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 공통 결재선 필터링
  const getCommonApprovalLines = () => {
    return approvalLines.filter((line) => line.type === "COMMON");
  };

  // 개인화 결재선 필터링
  const getCustomApprovalLines = () => {
    return approvalLines.filter((line) => line.type === "CUSTOM");
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchApprovalLines();
  }, []);

  return {
    approvalLines,
    loading,
    error,
    fetchApprovalLines,
    fetchApprovalLine,
    createApprovalLine,
    updateApprovalLine,
    deleteApprovalLine,
    getCommonApprovalLines,
    getCustomApprovalLines,
  };
};
