"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBoard } from "../board.hooks";
import { useCategories } from "@/shared/common.hooks";
import { CreateBoardRequest } from "@/types/board.types";

// 게시글 작성 스키마 정의
const createBoardSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(100, "제목은 100자 이내로 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(5000, "내용은 5000자 이내로 입력해주세요."),
  categoryId: z.string().min(1, "카테고리를 선택해주세요."),
});

type CreateBoardFormData = z.infer<typeof createBoardSchema>;

interface CreateBoardFormProps {
  onSuccess?: (boardId: number) => void;
  onCancel?: () => void;
}

export default function CreateBoardForm({
  onSuccess,
  onCancel,
}: CreateBoardFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createBoardMutation = useCreateBoard();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CreateBoardFormData) => {
    setError("");

    const boardPayload: CreateBoardRequest = {
      title: data.title,
      content: data.content,
      categoryId: parseInt(data.categoryId),
    };

    console.log("📤 게시글 등록 요청:", boardPayload);

    try {
      const result = await createBoardMutation.mutateAsync(boardPayload);
      console.log("✅ 게시글 등록 성공:", result);

      // 폼 리셋
      reset();

      // 성공 콜백 호출
      if (onSuccess && result.id) {
        onSuccess(result.id);
      } else {
        // 기본 동작: 메인 페이지로 이동
        router.push("/");
      }
    } catch (error: any) {
      console.error("❌ 게시글 등록 실패:", error);
      setError(error?.message || "게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✍️ 게시글 작성
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            IT 커뮤니티에서 지식과 경험을 공유해보세요! 다른 개발자들과 소통하며
            함께 성장해요.
          </p>
        </div>

        {/* 메인 폼 카드 */}
        <Card className="shadow-xl border-0">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-red-800 font-medium">
                      오류가 발생했습니다
                    </h4>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* 카테고리 및 제목 섹션 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 카테고리 선택 */}
                <div className="lg:col-span-1">
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Select
                        label="📂 카테고리"
                        labelPlacement="outside"
                        placeholder="카테고리 선택"
                        selectedKeys={value ? new Set([value]) : new Set([])}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey ? String(selectedKey) : "");
                        }}
                        isLoading={categoriesLoading}
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        size="lg"
                        variant="bordered"
                        className="w-full"
                        classNames={{
                          trigger:
                            "border-gray-300 hover:border-blue-400 focus:border-blue-500",
                        }}
                      >
                        {categories?.map((category) => (
                          <SelectItem key={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* 제목 입력 */}
                <div className="lg:col-span-2">
                  <Input
                    {...register("title")}
                    label="📝 제목"
                    labelPlacement="outside"
                    placeholder="게시글 제목을 입력해주세요"
                    size="lg"
                    variant="bordered"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    className="w-full"
                    classNames={{
                      input: "text-lg",
                      inputWrapper:
                        "border-gray-300 hover:border-blue-400 focus-within:border-blue-500",
                    }}
                  />
                </div>
              </div>

              <Divider className="my-6" />

              {/* 내용 입력 */}
              <div>
                <Textarea
                  {...register("content")}
                  label="📄 내용"
                  labelPlacement="outside"
                  placeholder="게시글 내용을 입력해주세요&#10;&#10;• 코드를 공유할 때는 코드 블록을 활용해보세요&#10;• 스크린샷이나 이미지가 있다면 더욱 좋습니다&#10;• 구체적이고 명확한 설명을 부탁드려요"
                  minRows={12}
                  maxRows={25}
                  variant="bordered"
                  isInvalid={!!errors.content}
                  errorMessage={errors.content?.message}
                  className="w-full"
                  classNames={{
                    input: "text-base leading-relaxed",
                    inputWrapper:
                      "border-gray-300 hover:border-blue-400 focus-within:border-blue-500",
                  }}
                />
              </div>

              <Divider className="my-6" />

              {/* 작성 가이드라인 */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <CardHeader className="pb-3">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <span className="text-2xl">💡</span>
                    작성 가이드라인
                  </h3>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <p className="text-sm text-gray-700">
                          명확하고 구체적인 제목을 작성해주세요
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                        <p className="text-sm text-gray-700">
                          다른 사용자에게 도움이 되는 내용을 공유해주세요
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                        <p className="text-sm text-gray-700">
                          코드나 스크린샷을 포함하면 더욱 좋습니다
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <p className="text-sm text-gray-700">
                          욕설, 비방, 광고성 게시글은 삭제될 수 있습니다
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* 버튼 영역 */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t">
                <Button
                  type="button"
                  variant="bordered"
                  size="lg"
                  onPress={handleCancel}
                  disabled={createBoardMutation.isPending}
                  className="sm:w-auto w-full border-gray-300 text-gray-700 hover:border-gray-400"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  취소
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={createBoardMutation.isPending}
                  disabled={!isValid || createBoardMutation.isPending}
                  className="sm:w-auto w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  {createBoardMutation.isPending ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      등록 중...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      게시글 등록
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* 푸터 도움말 */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">
            궁금한 점이 있으시면 언제든지
            <span className="text-blue-600 font-medium mx-1">문의하기</span>를
            통해 연락해주세요! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
