"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signInWithCredentials(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return { error: "아이디 또는 비밀번호를 잘못 입력하셨습니다." };
    }
    // 로그인 성공 시에는 signIn에서 자동으로 리다이렉션 되지만,
    // 다른 종류의 에러가 발생하면 여기서 처리할 수 있습니다.
    // 예를 들어, 네트워크 에러 등
    throw error;
  }
  // signIn이 에러를 던지지 않으면 성공한 것이므로 리다이렉션합니다.
  redirect("/");
}
