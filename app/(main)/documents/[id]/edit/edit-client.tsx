"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { Document } from "@/types/api";

interface EditDocumentClientProps {
  document: Document;
  token: string;
}

export default function EditDocumentClient({
  document,
  token,
}: EditDocumentClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [metadata, setMetadata] = useState(
    JSON.stringify(document.metadata || {}, null, 2)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 메타데이터 JSON 파싱 검증
      let parsedMetadata = undefined;
      if (metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(metadata);
        } catch {
          setError("메타데이터 JSON 형식이 올바르지 않습니다.");
          setLoading(false);
          return;
        }
      }

      await apiClient.updateDocument(token, document.id, {
        title,
        content,
        metadata: parsedMetadata,
      });

      router.push(`/documents/${document.id}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "문서 수정에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">문서 수정</h1>
        <p className="mt-1 text-sm text-gray-500">
          임시저장된 문서를 수정합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문서양식 버전 ID
          </label>
          <input
            type="text"
            value={document.formVersionId}
            disabled
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            문서양식은 수정할 수 없습니다.
          </p>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            문서 제목 *
          </label>
          <input
            type="text"
            id="title"
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="문서 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            문서 내용 *
          </label>
          <textarea
            id="content"
            rows={10}
            required
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="문서 내용을 입력하세요 (HTML 지원)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="metadata"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            메타데이터 (JSON)
          </label>
          <textarea
            id="metadata"
            rows={5}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono text-xs"
            placeholder='{"key": "value"}'
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            JSON 형식으로 추가 정보를 입력할 수 있습니다.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
