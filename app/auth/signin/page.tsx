"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Checkbox, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PasswordInput } from "@/components/auth";
import Link from "next/link";
import Image from "next/image";

const signInSchema = z.object({
  email: z.string().min(1, "아이디 또는 비밀번호를 잘못 입력하셨습니다."),
  password: z.string().min(1, "아이디 또는 비밀번호를 잘못 입력하셨습니다."),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("아이디 또는 비밀번호를 잘못 입력하셨습니다.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("아이디 또는 비밀번호를 잘못 입력하셨습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 py-32">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={52}
            quality={100}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <Input
              {...register("email")}
              type="text"
              placeholder="아이디를 입력하세요"
              variant="bordered"
              label="아이디"
              labelPlacement="outside"
              className="w-full"
              classNames={{
                input: "text-base",
                inputWrapper:
                  "border-gray-300 focus-within:border-blue-500 h-12",
              }}
              isInvalid={!!errors.email}
            />
          </div>

          <div>
            <PasswordInput
              {...register("password")}
              placeholder="비밀번호를 입력하세요"
              variant="bordered"
              label="비밀번호"
              className="w-full"
              labelPlacement="outside"
              classNames={{
                input: "text-base",
                inputWrapper:
                  "border-gray-300 focus-within:border-blue-500 h-12",
              }}
              isInvalid={!!errors.password}
            />
          </div>

          <div className="flex items-center justify-between py-2 -mt-4">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={(value) => setValue("rememberMe", value)}
              size="md"
              color="primary"
              className="text-sm text-gray-600"
            >
              자동로그인
            </Checkbox>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center py-2">{error}</div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#598ADD] hover:bg-[#598ADD]/80 text-white font-medium h-12 text-base"
            isDisabled={isLoading}
          >
            로그인
          </Button>
        </form>

        <div className="flex justify-center space-x-4 text-sm text-gray-600 py-6">
          <Link href="/auth/signup" className="hover:text-[#598ADD]">
            회원가입
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/auth/find-id" className="hover:text-[#598ADD]">
            아이디 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/auth/reset-password" className="hover:text-[#598ADD]">
            비밀번호 변경
          </Link>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onPress={() => handleSocialLogin("naver")}
            isIconOnly
            className="w-12 h-12 rounded-full p-0 min-w-0"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <Image
              src="/images/naver.png"
              alt="naver"
              width={60}
              height={60}
              quality={100}
            />
          </Button>
          <Button
            onPress={() => handleSocialLogin("kakao")}
            isIconOnly
            className="w-12 h-12 rounded-full p-0 min-w-0"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <Image
              src="/images/kakao.png"
              alt="kakao"
              width={60}
              height={60}
              quality={100}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
