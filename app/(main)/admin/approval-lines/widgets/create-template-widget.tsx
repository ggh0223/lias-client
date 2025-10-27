/**
 * Create Template Widget - 새 템플릿 생성 위젯
 */

import Link from "next/link";

export default function CreateTemplateWidget() {
  return (
    <Link
      href="/admin/approval-lines/new"
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      새 템플릿 생성
    </Link>
  );
}
