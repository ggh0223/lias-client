"use server";

import { cookies } from "next/headers";
import { LoginRequest } from "../../src/types/auth";

interface LoginFormState {
  errors: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  success?: boolean;
}

export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 기본 유효성 검사
  if (!email) {
    return {
      errors: {
        email: ["아이디를 입력해주세요."],
      },
    };
  }

  if (!password) {
    return {
      errors: {
        password: ["비밀번호를 입력해주세요."],
      },
    };
  }

  try {
    const apiUrl = process.env.LIAS_API
      ? `${process.env.LIAS_API}/auth/login`
      : "http://localhost:3070/api/auth/login";

    const loginRequest: LoginRequest = {
      email,
      password,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        errors: {
          general: [errorData.message || "로그인에 실패했습니다."],
        },
      };
    }

    const data = await response.json();

    // 쿠키에 토큰 저장
    const cookieStore = await cookies();

    if (data.data?.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1일
        path: "/",
      });
    }

    return {
      errors: {},
      success: true,
    };
  } catch (error) {
    console.error("로그인 오류:", error);
    return {
      errors: {
        general: ["로그인 중 오류가 발생했습니다."],
      },
    };
  }
}
