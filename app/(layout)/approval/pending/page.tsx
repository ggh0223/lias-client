"use client";

import { DocumentList } from "../_components/document-list";

export default function PendingPage() {
  return <DocumentList listType="pending_approval" title="미결함" />;
}
