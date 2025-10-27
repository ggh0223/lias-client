/**
 * Create Form Widget - 새 양식 생성 위젯
 */

import Link from "next/link";

export default function CreateFormWidget() {
  return (
    <Link
      href="/admin/forms/new"
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      새 템플릿 생성
    </Link>
  );
}
