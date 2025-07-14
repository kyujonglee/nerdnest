"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signInWithCredentials(formData: FormData) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return { error: "아이디 또는 비밀번호를 잘못 입력하셨습니다." };
    }
    // 다른 종류의 에러가 발생하면 여기서 처리할 수 있습니다.
    // 예를 들어, 네트워크 에러 등
    // throw error; // 클라이언트에 에러 객체를 반환하도록 변경
    return { error: "알 수 없는 오류가 발생했습니다." };
  }
}
