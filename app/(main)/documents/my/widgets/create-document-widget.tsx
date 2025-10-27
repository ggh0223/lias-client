/**
 * Create Document Widget - 새 문서 작성 위젯
 */

import Link from "next/link";

export default function CreateDocumentWidget() {
  return (
    <Link
      href="/documents/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      ✏️ 새 문서 작성
    </Link>
  );
}
