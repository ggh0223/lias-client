import React from "react";
import { Document, ApprovalStep } from "../../_hooks/use-approval-documents";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
}

export function DocumentDetailModal({ open, onClose, document }: Props) {
  if (!open || !document) return null;
  let contentObj: Record<string, unknown> = {};
  try {
    contentObj =
      typeof document.content === "string"
        ? JSON.parse(document.content)
        : document.content;
  } catch {
    contentObj = {};
  }
  const approvalSteps = document.approvalSteps || [];
  const agreementSteps = approvalSteps.filter(
    (s: ApprovalStep) => s.type === "AGREEMENT"
  );
  const approvalStepsOnly = approvalSteps.filter(
    (s: ApprovalStep) => s.type === "APPROVAL"
  );
  const implementationSteps = approvalSteps.filter(
    (s: ApprovalStep) => s.type === "IMPLEMENTATION"
  );
  const referenceSteps = approvalSteps.filter(
    (s: ApprovalStep) => s.type === "REFERENCE"
  );

  // 결재/합의 표 셀 동적 생성 (최대 5명)
  const maxApproval = Math.max(approvalStepsOnly.length, 5);
  const maxAgreement = Math.max(agreementSteps.length, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <div className="text-center text-3xl font-bold mb-6">
          {document.documentType || "기안서"}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-400 bg-gray-50 w-1/5 p-2">
                  품의번호
                </td>
                <td className="border border-gray-400 p-2 w-4/5">
                  {document.documentNumber}
                </td>

                <td
                  className="border border-gray-400 bg-gray-50 text-center font-bold p-0"
                  rowSpan={4}
                  colSpan={2}
                >
                  {/* 결재/합의 표 - 첨부 이미지 스타일 */}
                  <table
                    className="w-full border border-gray-400 text-xs leading-8"
                    style={{ minHeight: "80px" }}
                  >
                    <tbody>
                      {/* 결재 라인 */}
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
                        {approvalStepsOnly.length === 0 ? (
                          <td
                            className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                            style={{ height: "0.5rem" }}
                          >
                            &nbsp;
                          </td>
                        ) : (
                          approvalStepsOnly.map((step, idx) => (
                            <td
                              key={"appr-pos-" + idx}
                              className="border border-gray-400 p-1 text-center min-w-[70px] h-12 align-bottom"
                              style={{ height: "0.5rem" }}
                            >
                              {step.approver?.position || "-"}
                            </td>
                          ))
                        )}
                        {approvalStepsOnly.length > 0 &&
                          Array.from({
                            length: maxApproval - approvalStepsOnly.length,
                          }).map((_, idx) => (
                            <td
                              key={"appr-pos-empty-" + idx}
                              className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                              style={{ height: "0.5rem" }}
                            >
                              &nbsp;
                            </td>
                          ))}
                      </tr>
                      <tr style={{ minHeight: "24px", height: "24px" }}>
                        {approvalStepsOnly.length === 0 ? (
                          <td
                            className="border border-gray-400 p-1 h-6 align-bottom"
                            style={{ height: "6rem" }}
                          >
                            &nbsp;
                          </td>
                        ) : (
                          approvalStepsOnly.map((step, idx) => (
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
                                ) : (
                                  <></>
                                )}
                                <span className="text-gray-600">
                                  {step.approver?.name || "-"}
                                </span>
                              </div>
                            </td>
                          ))
                        )}
                        {approvalStepsOnly.length > 0 &&
                          Array.from({
                            length: maxApproval - approvalStepsOnly.length,
                          }).map((_, idx) => (
                            <td
                              key={"appr-name-empty-" + idx}
                              className="border border-gray-400 p-1 h-6 align-bottom"
                              style={{ height: "6rem" }}
                            >
                              &nbsp;
                            </td>
                          ))}
                      </tr>
                      {/* 합의 라인 */}
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
                        {agreementSteps.length === 0 ? (
                          <td
                            className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                            style={{ height: "0.5rem" }}
                          >
                            &nbsp;
                          </td>
                        ) : (
                          agreementSteps.map((step, idx) => (
                            <td
                              key={"agree-pos-" + idx}
                              className="border border-gray-400 p-1 text-center min-w-[70px] h-12 align-bottom"
                              style={{ height: "0.5rem" }}
                            >
                              {step.approver?.position || "-"}
                            </td>
                          ))
                        )}
                        {agreementSteps.length > 0 &&
                          Array.from({
                            length: maxAgreement - agreementSteps.length,
                          }).map((_, idx) => (
                            <td
                              key={"agree-pos-empty-" + idx}
                              className="border border-gray-400 p-1 min-w-[70px] h-12 align-bottom"
                              style={{ height: "0.5rem" }}
                            >
                              &nbsp;
                            </td>
                          ))}
                      </tr>
                      <tr style={{ minHeight: "24px", height: "24px" }}>
                        {agreementSteps.length === 0 ? (
                          <td
                            className="border border-gray-400 p-1 h-6 align-bottom"
                            style={{ height: "6rem" }}
                          >
                            &nbsp;
                          </td>
                        ) : (
                          agreementSteps.map((step, idx) => (
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
                                ) : (
                                  <></>
                                )}
                                <span className="text-gray-600">
                                  {step.approver?.name || "-"}
                                </span>
                              </div>
                            </td>
                          ))
                        )}
                        {agreementSteps.length > 0 &&
                          Array.from({
                            length: maxAgreement - agreementSteps.length,
                          }).map((_, idx) => (
                            <td
                              key={"agree-name-empty-" + idx}
                              className="border border-gray-400 p-1 h-6 align-bottom"
                              style={{ height: "6rem" }}
                            >
                              &nbsp;
                            </td>
                          ))}
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
                  {document.createdAt
                    ? new Date(document.createdAt).toLocaleDateString("ko-KR")
                    : ""}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 bg-gray-50 p-2">
                  기안부서
                </td>
                <td className="border border-gray-400 p-2">
                  {document.drafter?.department}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 bg-gray-50 p-2">
                  기안자
                </td>
                <td className="border border-gray-400 p-2">
                  {document.drafter?.name}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 bg-gray-50 p-2">
                  수신및참조
                </td>
                <td className="border border-gray-400 p-2" colSpan={3}>
                  {referenceSteps.length > 0 ? (
                    referenceSteps.map((step, idx) => (
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
                  {implementationSteps.length > 0 ? (
                    implementationSteps.map((step, idx) => (
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
                <td className="border border-gray-400 bg-gray-50 p-2">제목</td>
                <td className="border border-gray-400 p-2" colSpan={3}>
                  {document.title}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 bg-gray-50 p-2">내용</td>
                <td className="border border-gray-400 p-2" colSpan={7}>
                  <div
                    className="min-h-[120px]"
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof contentObj === "string"
                          ? contentObj
                          : typeof document.content === "string"
                          ? document.content
                          : "",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
