"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Checkbox, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { PasswordInput } from "@/components/auth";
import { SignUpSuccess } from "./components/SignUpSuccess";
import { useJobs } from "@/shared/common.hooks";
import { useSignUp } from "../auth.hooks";

const signUpSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다."),
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    username: z.string().min(3, "아이디는 최소 3글자 이상이어야 합니다."),
    password: z.string().min(8, "비밀번호는 최소 8글자 이상이어야 합니다."),
    confirmPassword: z.string(),
    jobId: z.string().min(1, "직업을 선택해주세요."),
    level: z.string().min(1, "연차를 입력해주세요."),
    privacyAgreement: z.boolean().refine((val) => val === true, {
      message: "개인정보 수집 및 이용동의는 필수입니다.",
    }),
    termsAgreement: z.boolean().refine((val) => val === true, {
      message: "Nerdnest 이용약관 동의는 필수입니다.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useJobs();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [signUpUserInfo, setSignUpUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const router = useRouter();

  const signUpMutation = useSignUp();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      jobId: "",
      level: "",
      privacyAgreement: false,
      termsAgreement: false,
    },
    reValidateMode: "onSubmit",
  });

  const [allAgreement, setAllAgreement] = useState(false);
  const privacyAgreement = watch("privacyAgreement");
  const termsAgreement = watch("termsAgreement");

  // 개별 약관 동의 상태가 변경될 때 "약관에 모두 동의" 상태 업데이트
  useEffect(() => {
    const allChecked = Boolean(privacyAgreement && termsAgreement);
    setAllAgreement(allChecked);
  }, [privacyAgreement, termsAgreement]);

  // "약관에 모두 동의" 체크박스 핸들러
  const handleAllAgreement = (checked: boolean) => {
    setAllAgreement(checked);
    setValue("privacyAgreement", checked, { shouldValidate: true });
    setValue("termsAgreement", checked, { shouldValidate: true });
  };

  const onSubmit = async (data: SignUpFormData) => {
    setError("");
    setSuccess("");

    console.log("🎯 회원가입 폼 데이터:", data);

    const signUpPayload = {
      name: data.name,
      email: data.email,
      username: data.username,
      password: data.password,
      jobId: parseInt(data.jobId),
      level: parseInt(data.level),
      agree: data.privacyAgreement && data.termsAgreement,
    };

    console.log("📤 회원가입 API 요청 데이터:", signUpPayload);

    try {
      await signUpMutation.mutateAsync(signUpPayload);

      console.log("🎉 회원가입 성공!");
      // 성공 시 사용자 정보 저장하고 성공 화면으로 전환
      setSignUpUserInfo({ name: data.name, email: data.email });
      setIsSignUpComplete(true);
    } catch (error: any) {
      console.error("💥 회원가입 실패:", error);
      setError(error?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 완료 시 성공 컴포넌트 렌더링
  if (isSignUpComplete && signUpUserInfo) {
    return <SignUpSuccess userInfo={signUpUserInfo} />;
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-6xl flex w-full px-5 pt-[100px]">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold">{"방문해주셔서 감사합니다 :)"}</h1>
          <h2 className="text-[22px] mt-4 font-normal break-keep">
            저희와 함께 웹&앱에 대한 모든 것을 공부해보시겠어요?
          </h2>
          <div className="mt-10 flex items-center gap-1">
            <span>이미 회원이신가요?</span>
            <Link href="/auth/signin" className="text-[#598ADD]">
              {"로그인 하러 가기 >"}
            </Link>
          </div>
        </div>
        <div className="w-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <div>
              <Input
                {...register("name")}
                label="이름"
                labelPlacement="outside"
                placeholder="이름을 입력해주세요"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            </div>

            <div>
              <Input
                {...register("email")}
                label="이메일"
                labelPlacement="outside"
                placeholder="이메일을 입력해주세요"
                type="email"
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>

            <div>
              <Input
                {...register("username")}
                label="아이디"
                labelPlacement="outside"
                placeholder="아이디를 입력해주세요"
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <PasswordInput
                  {...register("password")}
                  label="비밀번호"
                  labelPlacement="outside"
                  placeholder="비밀번호를 입력해주세요"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              </div>

              <div>
                <PasswordInput
                  {...register("confirmPassword")}
                  placeholder="비밀번호 확인"
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <Controller
              name="jobId"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Select
                  label="직업"
                  labelPlacement="outside"
                  placeholder={
                    jobsLoading ? "직업 데이터 로딩 중..." : "선택하기"
                  }
                  selectedKeys={value ? new Set([value]) : new Set([])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    onChange(selectedKey ? String(selectedKey) : "");
                  }}
                  isLoading={jobsLoading}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  isDisabled={jobsLoading || jobsError}
                  description={
                    jobsError ? "직업 데이터를 불러오지 못했습니다." : undefined
                  }
                >
                  {jobs?.map((job) => (
                    <SelectItem key={job.id.toString()}>{job.name}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Input
              {...register("level")}
              label="연차"
              labelPlacement="outside"
              placeholder="연차"
              type="number"
              isInvalid={!!errors.level}
              errorMessage={errors.level?.message}
            />

            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                <Checkbox
                  isSelected={allAgreement}
                  onValueChange={handleAllAgreement}
                >
                  <span className="text-sm font-medium">
                    <span className="text-[#598ADD]">약관에 모두 동의</span>
                  </span>
                </Checkbox>

                <div className="ml-4 flex flex-col gap-3 border-l-2 border-gray-100 pl-4">
                  <Checkbox
                    isSelected={privacyAgreement}
                    onValueChange={(checked) =>
                      setValue("privacyAgreement", checked, {
                        shouldValidate: true,
                      })
                    }
                    isInvalid={!!errors.privacyAgreement}
                  >
                    <span className="text-sm">
                      <span className="text-[#598ADD]">
                        개인정보 수집 및 이용동의
                      </span>{" "}
                      (필수)
                    </span>
                  </Checkbox>
                  {errors.privacyAgreement && (
                    <p className="text-red-500 text-xs ml-6">
                      {errors.privacyAgreement.message}
                    </p>
                  )}

                  <Checkbox
                    isSelected={termsAgreement}
                    onValueChange={(checked) =>
                      setValue("termsAgreement", checked, {
                        shouldValidate: true,
                      })
                    }
                    isInvalid={!!errors.termsAgreement}
                  >
                    <span className="text-sm">
                      <span className="text-[#598ADD]">
                        Nerdnest 이용약관 동의
                      </span>{" "}
                      (필수)
                    </span>
                  </Checkbox>
                  {errors.termsAgreement && (
                    <p className="text-red-500 text-xs ml-6">
                      {errors.termsAgreement.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={signUpMutation.isPending}
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "회원가입 중..." : "회원가입"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
