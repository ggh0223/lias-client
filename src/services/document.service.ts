/**
 * Document Service
 * Context Service - 비즈니스 로직 계층
 * AGENTS.md: 비즈니스 로직 처리 및 API Route Handler 호출
 */

import { apiClient } from "@/lib/api-client";
import { apiServer } from "@/lib/api-server";
import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SubmitDocumentRequest,
} from "@/types/document";

export class DocumentService {
  /**
   * 내 문서 목록 조회
   */
  async fetchMyDocuments(token: string): Promise<Document[]> {
    // 서버 사이드에서는 apiServer 사용
    if (typeof window === "undefined") {
      return await apiServer.getMyDocuments(token);
    }
    // 클라이언트 사이드에서는 apiClient 사용
    return await apiClient.getMyDocuments(token);
  }

  /**
   * 문서 생성
   */
  async createDocument(
    token: string,
    data: CreateDocumentRequest
  ): Promise<Document> {
    return await apiClient.createDocument(token, data);
  }

  /**
   * 문서 조회
   */
  async fetchDocumentById(
    token: string,
    documentId: string
  ): Promise<Document> {
    return await apiClient.getDocumentById(token, documentId);
  }

  /**
   * 문서 수정
   */
  async updateDocument(
    token: string,
    documentId: string,
    data: UpdateDocumentRequest
  ): Promise<Document> {
    return await apiClient.updateDocument(token, documentId, data);
  }

  /**
   * 문서 제출
   */
  async submitDocument(
    token: string,
    documentId: string,
    data: SubmitDocumentRequest
  ): Promise<Document> {
    return await apiClient.submitDocument(token, documentId, data);
  }

  /**
   * 문서 삭제
   */
  async deleteDocument(
    token: string,
    documentId: string
  ): Promise<{ message: string; documentId: string }> {
    return await apiClient.deleteDocument(token, documentId);
  }

  /**
   * 상태별 문서 조회
   */
  async fetchDocumentsByStatus(
    token: string,
    status: string
  ): Promise<Document[]> {
    return await apiClient.getDocumentsByStatus(token, status);
  }
}

export const documentService = new DocumentService();
