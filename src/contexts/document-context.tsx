"use client";

/**
 * Document Context
 * AGENTS.md: 전역 상태 저장소 - 단일 진실의 원천(Single Source of Truth)
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  SubmitDocumentRequest,
} from "@/types/document";
import { documentService } from "@/services/document.service";

interface DocumentContextValue {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  error: string | null;
  fetchDocuments: (token: string) => Promise<void>;
  fetchDocument: (token: string, documentId: string) => Promise<void>;
  createDocument: (
    token: string,
    data: CreateDocumentRequest
  ) => Promise<Document>;
  updateDocument: (
    token: string,
    documentId: string,
    data: UpdateDocumentRequest
  ) => Promise<void>;
  submitDocument: (
    token: string,
    documentId: string,
    data: SubmitDocumentRequest
  ) => Promise<void>;
  deleteDocument: (token: string, documentId: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  clearError: () => void;
}

const DocumentContext = createContext<DocumentContextValue | undefined>(
  undefined
);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const data = await documentService.fetchMyDocuments(token);
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문서 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocument = useCallback(
    async (token: string, documentId: string) => {
      setLoading(true);
      try {
        const data = await documentService.fetchDocumentById(token, documentId);
        setCurrentDocument(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "문서 조회에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createDocument = useCallback(
    async (token: string, data: CreateDocumentRequest) => {
      setLoading(true);
      try {
        const newDoc = await documentService.createDocument(token, data);
        setDocuments((prev) => [newDoc, ...prev]);
        setError(null);
        return newDoc;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "문서 생성에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDocument = useCallback(
    async (token: string, documentId: string, data: UpdateDocumentRequest) => {
      setLoading(true);
      try {
        const updatedDoc = await documentService.updateDocument(
          token,
          documentId,
          data
        );
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === documentId ? updatedDoc : doc))
        );
        setCurrentDocument((prev) =>
          prev?.id === documentId ? updatedDoc : prev
        );
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "문서 수정에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const submitDocument = useCallback(
    async (token: string, documentId: string, data: SubmitDocumentRequest) => {
      setLoading(true);
      try {
        const submittedDoc = await documentService.submitDocument(
          token,
          documentId,
          data
        );
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === documentId ? submittedDoc : doc))
        );
        setCurrentDocument((prev) =>
          prev?.id === documentId ? submittedDoc : prev
        );
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "문서 제출에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteDocument = useCallback(
    async (token: string, documentId: string) => {
      setLoading(true);
      try {
        await documentService.deleteDocument(token, documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        if (currentDocument?.id === documentId) {
          setCurrentDocument(null);
        }
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "문서 삭제에 실패했습니다.";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentDocument]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: DocumentContextValue = {
    documents,
    currentDocument,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    submitDocument,
    deleteDocument,
    setCurrentDocument,
    clearError,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within DocumentProvider");
  }
  return context;
}
