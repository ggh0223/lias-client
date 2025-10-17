"use client";

import { useState } from "react";
import {
  useAllApprovalDocuments,
  DocumentListType,
  ApprovalResponseDto,
  ApprovalStep,
} from "../../_hooks/use-approval-documents";

export default function TotalPage() {
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const { data, loading, error } = useAllApprovalDocuments();

  const getPriorityDocuments = () => {
    const priorityOrder: DocumentListType[] = [
      "pending_agreement",
      "pending_approval",
      "implementation",
    ];
    const documents: Array<
      ApprovalResponseDto & { _listType: DocumentListType }
    > = [];
    priorityOrder.forEach((listType) => {
      const docs = data[listType]?.items || [];
      docs.forEach((doc) => {
        documents.push({ ...doc, _listType: listType });
      });
    });
    return documents;
  };

  const priorityDocuments = getPriorityDocuments();
  const currentDocument = priorityDocuments[currentDocumentIndex];
  const currentListType = currentDocument?._listType;

  const getDocumentCount = (listType: DocumentListType) => {
    return data[listType]?.meta?.total || 0;
  };

  const getActionButtons = (listType: DocumentListType) => {
    switch (listType) {
      case "pending_agreement":
        return (
          <>
            <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 text-sm">
              협의
            </button>
            <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 text-sm">
              반려
            </button>
          </>
        );
      case "pending_approval":
        return (
          <>
            <button className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-all duration-200 text-sm">
              결재
            </button>
            <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 text-sm">
              반려
            </button>
          </>
        );
      case "implementation":
        return (
          <>
            <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 text-sm">
              시행
            </button>
            <div className="px-3 py-2 bg-gray-100 rounded text-sm text-white opacity-50 cursor-not-allowed">
              -
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pr-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          내가 해야 할 업무
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              const idx = priorityDocuments.findIndex(
                (doc) => doc._listType === "pending_agreement"
              );
              if (idx !== -1) setCurrentDocumentIndex(idx);
            }}
            className={`text-center p-2 rounded-lg transition-colors cursor-pointer ${
              currentListType === "pending_agreement"
                ? "bg-blue-50 border-2 border-blue-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`text-lg font-bold ${
                currentListType === "pending_agreement"
                  ? "text-blue-700"
                  : "text-blue-600"
              }`}
            >
              {getDocumentCount("pending_agreement")}
            </div>
            <div className="text-xs text-gray-600">협의 대기</div>
          </button>
          <button
            onClick={() => {
              const idx = priorityDocuments.findIndex(
                (doc) => doc._listType === "pending_approval"
              );
              if (idx !== -1) setCurrentDocumentIndex(idx);
            }}
            className={`text-center p-2 rounded-lg transition-colors cursor-pointer ${
              currentListType === "pending_approval"
                ? "bg-yellow-50 border-2 border-yellow-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`text-lg font-bold ${
                currentListType === "pending_approval"
                  ? "text-yellow-700"
                  : "text-yellow-600"
              }`}
            >
              {getDocumentCount("pending_approval")}
            </div>
            <div className="text-xs text-gray-600">결재 대기</div>
          </button>
          <button
            onClick={() => {
              const idx = priorityDocuments.findIndex(
                (doc) => doc._listType === "implementation"
              );
              if (idx !== -1) setCurrentDocumentIndex(idx);
            }}
            className={`text-center p-2 rounded-lg transition-colors cursor-pointer ${
              currentListType === "implementation"
                ? "bg-green-50 border-2 border-green-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`text-lg font-bold ${
                currentListType === "implementation"
                  ? "text-green-700"
                  : "text-green-600"
              }`}
            >
              {getDocumentCount("implementation")}
            </div>
            <div className="text-xs text-gray-600">시행 대기</div>
          </button>
        </div>
      </div>
      {priorityDocuments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {currentDocumentIndex + 1} / {priorityDocuments.length}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {currentDocument?.title}
                </p>
                <div className="mt-2">
                  {currentListType === "pending_agreement" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      💬 협의 대기
                    </span>
                  )}
                  {currentListType === "pending_approval" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⏳ 결재 대기
                    </span>
                  )}
                  {currentListType === "implementation" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🚀 시행 대기
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center text-2xl font-bold mb-6">
              {currentDocument?.documentType || "기안서"}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-400 text-sm">
                <tbody>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 w-1/5 p-2">
                      품의번호
                    </td>
                    <td className="border border-gray-400 p-2 w-4/5">
                      {currentDocument?.documentNumber}
                    </td>
                    <td
                      className="border border-gray-400 bg-gray-50 text-center font-bold p-0"
                      rowSpan={4}
                      colSpan={2}
                    >
                      <table
                        className="w-full border border-gray-400 text-xs leading-8"
                        style={{ minHeight: "80px" }}
                      >
                        <tbody>
                          <tr style={{ minHeight: "40px", height: "40px" }}>
                            <td
                              className="border border-gray-400 bg-gray-50 text-center font-bold"
                              rowSpan={2}
                              style={{
                                writingMode: "vertical-rl",
                                verticalAlign: "middle",
                                letterSpacing: "0.1em",
                                height: "10%",
                              }}
                            >
                              결재
                            </td>
                            {(() => {
                              const approvalSteps =
                                currentDocument?.approvalSteps?.filter(
                                  (s: ApprovalStep) => s.type === "APPROVAL"
                                ) ?? [];
                              return [
                                ...approvalSteps.map(
                                  (step: ApprovalStep, idx: number) => (
                                    <td
                                      key={"appr-pos-" + idx}
                                      className="border border-gray-400 p-1 text-center min-w-[70px] h-12 align-bottom"
                                      style={{ height: "0.5rem" }}
                                    >
                                      {step.approver?.position || "-"}
                                    </td>
                                  )
                                ),
                                ...Array.from({
                                  length: 5 - approvalSteps.length,
                                }).map((_, idx) => (
                                  <td
                                    key={"appr-pos-empty-" + idx}
                                    className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                                    style={{ height: "0.5rem" }}
                                  >
                                    &nbsp;
                                  </td>
                                )),
                              ];
                            })()}
                          </tr>
                          <tr style={{ minHeight: "24px", height: "24px" }}>
                            {(() => {
                              const approvalSteps =
                                currentDocument?.approvalSteps?.filter(
                                  (s: ApprovalStep) => s.type === "APPROVAL"
                                ) ?? [];
                              return [
                                ...approvalSteps.map(
                                  (step: ApprovalStep, idx: number) => (
                                    <td
                                      key={"appr-name-" + idx}
                                      className="border border-gray-400 p-1 text-center font-semibold h-6 align-bottom relative"
                                      style={{ height: "6rem" }}
                                    >
                                      <div>
                                        {step.isApproved ? (
                                          <div className="flex items-center justify-center h-full">
                                            <div className="relative">
                                              <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-50 flex items-center justify-center">
                                                <span className="text-red-600 text-xs font-bold">
                                                  {step.approver?.name || "-"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                        <span className="text-gray-600">
                                          {step.approver?.name || "-"}
                                        </span>
                                      </div>
                                    </td>
                                  )
                                ),
                                ...Array.from({
                                  length: 5 - approvalSteps.length,
                                }).map((_, idx) => (
                                  <td
                                    key={"appr-name-empty-" + idx}
                                    className="border border-gray-400 p-1 h-6 align-bottom"
                                    style={{ height: "6rem" }}
                                  >
                                    &nbsp;
                                  </td>
                                )),
                              ];
                            })()}
                          </tr>
                          <tr style={{ minHeight: "40px", height: "40px" }}>
                            <td
                              className="border border-gray-400 bg-gray-50 text-center font-bold"
                              rowSpan={2}
                              style={{
                                writingMode: "vertical-rl",
                                verticalAlign: "middle",
                                letterSpacing: "0.1em",
                                height: "10%",
                              }}
                            >
                              합의
                            </td>
                            {(() => {
                              const agreementSteps =
                                currentDocument?.approvalSteps?.filter(
                                  (s: ApprovalStep) => s.type === "AGREEMENT"
                                ) ?? [];
                              return [
                                ...agreementSteps.map(
                                  (step: ApprovalStep, idx: number) => (
                                    <td
                                      key={"agree-pos-" + idx}
                                      className="border border-gray-400 p-1 text-center min-w-[70px] h-12 align-bottom"
                                      style={{ height: "0.5rem" }}
                                    >
                                      {step.approver?.position || "-"}
                                    </td>
                                  )
                                ),
                                ...Array.from({
                                  length: 5 - agreementSteps.length,
                                }).map((_, idx) => (
                                  <td
                                    key={"agree-pos-empty-" + idx}
                                    className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                                    style={{ height: "0.5rem" }}
                                  >
                                    &nbsp;
                                  </td>
                                )),
                              ];
                            })()}
                          </tr>
                          <tr style={{ minHeight: "24px", height: "24px" }}>
                            {(() => {
                              const agreementSteps =
                                currentDocument?.approvalSteps?.filter(
                                  (s: ApprovalStep) => s.type === "AGREEMENT"
                                ) ?? [];
                              return [
                                ...agreementSteps.map(
                                  (step: ApprovalStep, idx: number) => (
                                    <td
                                      key={"agree-name-" + idx}
                                      className="border border-gray-400 p-1 text-center font-semibold h-6 align-bottom relative"
                                      style={{ height: "6rem" }}
                                    >
                                      <div>
                                        {step.isApproved ? (
                                          <div className="flex items-center justify-center h-full">
                                            <div className="relative">
                                              <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-50 flex items-center justify-center">
                                                <span className="text-red-600 text-xs font-bold">
                                                  {step.approver?.name || "-"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                        <span className="text-gray-600">
                                          {step.approver?.name || "-"}
                                        </span>
                                      </div>
                                    </td>
                                  )
                                ),
                                ...Array.from({
                                  length: 5 - agreementSteps.length,
                                }).map((_, idx) => (
                                  <td
                                    key={"agree-name-empty-" + idx}
                                    className="border border-gray-400 p-1 h-6 align-bottom"
                                    style={{ height: "6rem" }}
                                  >
                                    &nbsp;
                                  </td>
                                )),
                              ];
                            })()}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 w-28 p-2">
                      작성일자
                    </td>
                    <td className="border border-gray-400 p-2 w-48">
                      {currentDocument?.createdAt
                        ? new Date(
                            currentDocument.createdAt
                          ).toLocaleDateString("ko-KR")
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      기안부서
                    </td>
                    <td className="border border-gray-400 p-2">
                      {currentDocument?.drafter?.department}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      기안자
                    </td>
                    <td className="border border-gray-400 p-2">
                      {currentDocument?.drafter?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      수신및참조
                    </td>
                    <td className="border border-gray-400 p-2" colSpan={3}>
                      {(
                        currentDocument?.approvalSteps?.filter(
                          (s: ApprovalStep) => s.type === "REFERENCE"
                        ) ?? []
                      ).length > 0 ? (
                        currentDocument?.approvalSteps
                          ?.filter((s: ApprovalStep) => s.type === "REFERENCE")
                          .map((step: ApprovalStep, idx: number) => (
                            <span key={idx} className="mr-2">
                              {step.approver?.name} ({step.approver?.position})
                            </span>
                          ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      시행자
                    </td>
                    <td className="border border-gray-400 p-2" colSpan={3}>
                      {(
                        currentDocument?.approvalSteps?.filter(
                          (s: ApprovalStep) => s.type === "IMPLEMENTATION"
                        ) ?? []
                      ).length > 0 ? (
                        currentDocument?.approvalSteps
                          ?.filter((s: ApprovalStep) => s.type === "IMPLEMENTATION")
                          .map((step: ApprovalStep, idx: number) => (
                            <span key={idx} className="mr-2">
                              {step.approver?.name} ({step.approver?.position})
                            </span>
                          ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      제목
                    </td>
                    <td className="border border-gray-400 p-2" colSpan={3}>
                      {currentDocument?.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-50 p-2">
                      내용
                    </td>
                    <td className="border border-gray-400 p-2" colSpan={7}>
                      <div
                        className="min-h-[120px]"
                        dangerouslySetInnerHTML={{
                          __html: currentDocument?.content || "",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            처리할 문서가 없습니다!
          </h2>
          <p className="text-gray-600">모든 업무를 완료하셨습니다.</p>
        </div>
      )}

      {/* 플로팅 버튼 */}
      {priorityDocuments.length > 0 && (
        <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 backdrop-blur-sm bg-white/95">
            <div className="flex flex-col space-y-2 h-32">
              {/* 이전/다음 버튼 */}
              <div className="flex space-x-1 ">
                <button
                  onClick={() =>
                    setCurrentDocumentIndex(
                      Math.max(0, currentDocumentIndex - 1)
                    )
                  }
                  disabled={currentDocumentIndex === 0}
                  className="px-2 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 flex-1"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentDocumentIndex(
                      Math.min(
                        priorityDocuments.length - 1,
                        currentDocumentIndex + 1
                      )
                    )
                  }
                  disabled={
                    currentDocumentIndex === priorityDocuments.length - 1
                  }
                  className="px-2 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 flex-1"
                >
                  ›
                </button>
              </div>{" "}
              {/* 액션 버튼 */}
              <div className="flex flex-col space-y-1">
                {getActionButtons(currentListType!)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
