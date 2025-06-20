"use client";

import {
  memo,
  useState,
  useEffect,
  useActionState,
  useFormStatus,
} from "react";
import { login } from "../_action/auth";

// 로고 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
const Logo = memo(() => (
  <div className="flex items-center justify-center">
    <div className="relative h-10 w-28">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        LIAS
      </div>
    </div>
  </div>
));
Logo.displayName = "Logo";

const SubmitButton = ({
  email,
  password,
  isLoading,
}: {
  email: string;
  password: string;
  isLoading: boolean;
}) => {
  const { pending } = useFormStatus();

  // 외부에서 전달된 isLoading이 true면 항상 로딩 상태 유지
  const buttonIsLoading = pending || isLoading;

  return (
    <button
      role="button"
      aria-label="로그인"
      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-base font-medium transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      type="submit"
      disabled={!email || !password || buttonIsLoading}
    >
      {buttonIsLoading ? "로그인 중..." : "로그인"}
    </button>
  );
};

const LoginForm = () => {
  const [forceLoading, setForceLoading] = useState(false);
  const [formState, formAction] = useActionState(login, {
    errors: {
      email: undefined,
      password: undefined,
      general: undefined,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [hasAtSymbol, setHasAtSymbol] = useState(false);
  const [password, setPassword] = useState("");

  // 폼 상태 변경 감지
  useEffect(() => {
    // 로그인에 성공한 경우 강제로 로딩 상태 유지
    if (formState?.success) {
      setForceLoading(true);
      // 로그인 성공 시 메인 페이지로 리다이렉트
      window.location.href = "/";
    }
    // 로그인에 실패한 경우 로딩 상태 해제
    else if (
      formState?.errors?.email ||
      formState?.errors?.password ||
      formState?.errors?.general
    ) {
      setForceLoading(false);
    }
  }, [formState]);

  // 폼 제출 시 로딩 상태 관리
  const handleFormAction = (formData: FormData) => {
    setForceLoading(true); // 폼 제출 시 바로 로딩 상태 시작

    // email 처리: @가 없으면 @lumir.space 추가
    const currentEmail = formData.get("email") as string;
    if (!hasAtSymbol && currentEmail) {
      formData.set("email", `${currentEmail}@lumir.space`);
    }

    formAction(formData);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setHasAtSymbol(value.includes("@"));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3">
          <Logo />
          <div className="border-l border-gray-200 pl-3">
            <h2 className="text-xl font-semibold text-gray-900">
              루미르 전자결재시스템
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              계정에 로그인해주세요
            </p>
          </div>
        </div>
      </div>

      <form
        action={handleFormAction}
        role="form"
        aria-label="로그인 폼"
        className="space-y-4"
      >
        <div role="group" className="space-y-3">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="아이디"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm transition-all duration-200 ${
                !hasAtSymbol ? "pr-24" : ""
              } ${
                formState?.errors?.email?.[0]
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              autoComplete="email"
            />
            {!hasAtSymbol && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-sm text-gray-500">@lumir.space</span>
              </div>
            )}
            {formState?.errors?.email?.[0] && (
              <p className="mt-1 text-sm text-red-600">
                {formState.errors.email[0]}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm transition-all duration-200 ${
                formState?.errors?.password?.[0] ||
                formState?.errors?.general?.[0]
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label="비밀번호 보기"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-0"
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              )}
            </button>
            {(formState?.errors?.password?.[0] ||
              formState?.errors?.general?.[0]) && (
              <p className="mt-1 text-sm text-red-600">
                {formState.errors.password?.[0] ||
                  formState.errors.general?.[0]}
              </p>
            )}
          </div>
        </div>

        <SubmitButton
          email={email}
          password={password}
          isLoading={forceLoading}
        />
      </form>

      <footer className="mt-12 text-center text-xs text-gray-400">
        Copyright ©{new Date().getFullYear()} 루미르(주) All Rights Reserved.
      </footer>
    </div>
  );
};

export default LoginForm;
