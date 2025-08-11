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
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBoard } from "../board.hooks";
import { useCategories } from "@/shared/common.hooks";
import { CreateBoardRequest } from "@/types/board.types";
import { getCategoryName } from "@/shared/utils/categoryUtils";
import { PenTool, X } from "lucide-react";

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
  initialCategoryId?: string;
}

export default function CreateBoardForm({
  onSuccess,
  onCancel,
  initialCategoryId,
}: CreateBoardFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createBoardMutation = useCreateBoard();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: initialCategoryId || "",
    },
    mode: "onChange",
  });


  const onSubmit = async (data: CreateBoardFormData) => {
    setError("");
    setIsSubmitting(true);

    const boardPayload: CreateBoardRequest = {
      title: data.title,
      content: data.content,
      categoryId: parseInt(data.categoryId),
    };

    try {
      const result = await createBoardMutation.mutateAsync(boardPayload);
      
      // 성공 메시지는 표시하지 않고 바로 이동
      // 명세: "게시글이 성공적으로 등록되었습니다." 메시지 후 카테고리 메인 화면으로 이동
      
      // 폼 리셋
      reset();

      // 카테고리 페이지로 이동
      const categoryName = getCategoryName(parseInt(data.categoryId));
      if (categoryName) {
        router.push(`/boards/${categoryName}`);
      } else if (onSuccess && result.id) {
        onSuccess(result.id);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("게시글 등록 실패:", error);
      setError(error?.message || "게시글 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // 문자 수 계산
  const titleLength = watch("title")?.length || 0;
  const contentLength = watch("content")?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 섹션 - NerdNest 기획 의도 반영 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            게시글 작성
          </h1>
          <p className="text-gray-600">
            궁금한 점을 질문하거나 지식과 경험을 공유해주세요. 
            함께 성장하는 IT 커뮤니티를 만들어갑니다.
          </p>
        </div>

        {/* 메인 폼 카드 */}
        <Card className="shadow-lg">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* 카테고리 선택 - 명세: 드롭다운 (대분류 - 기획/개발/디자인/자유) */}
              <div>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Select
                      label="카테고리"
                      labelPlacement="outside"
                      placeholder="카테고리를 선택해주세요"
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
                      isRequired
                      classNames={{
                        label: "text-gray-700 font-medium mb-1",
                        trigger: "border-gray-300 hover:border-gray-400",
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

              {/* 제목 입력 - 명세: 필수, 최대 100자 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700 font-medium">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {titleLength}/100
                  </span>
                </div>
                <Input
                  {...register("title")}
                  placeholder="질문이나 공유하고 싶은 내용의 제목을 입력해주세요"
                  size="lg"
                  variant="bordered"
                  isInvalid={!!errors.title}
                  errorMessage={errors.title?.message}
                  classNames={{
                    inputWrapper: "border-gray-300 hover:border-gray-400",
                  }}
                />
              </div>

              {/* 내용 입력 - 명세: 텍스트 입력 (이미지 첨부, 파일 첨부 추후 개발 예정) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700 font-medium">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {contentLength}/5000
                  </span>
                </div>
                <Textarea
                  {...register("content")}
                  placeholder={`질문이나 공유하고 싶은 내용을 자세히 작성해주세요.

• 구체적인 상황이나 문제를 설명해주세요
• 시도해본 방법이 있다면 함께 공유해주세요
• 코드나 에러 메시지가 있다면 포함해주세요`}
                  minRows={10}
                  maxRows={20}
                  variant="bordered"
                  isInvalid={!!errors.content}
                  errorMessage={errors.content?.message}
                  classNames={{
                    inputWrapper: "border-gray-300 hover:border-gray-400",
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  * 이미지 및 파일 첨부 기능은 추후 제공 예정입니다.
                </p>
              </div>

              {/* 태그 입력 - 명세: 추후 개발 예정 */}
              {/* 추후 개발 예정이므로 주석 처리
              <div>
                <label className="text-gray-700 font-medium block mb-1">
                  태그 (선택)
                </label>
                <Input
                  placeholder="태그를 입력 후 엔터 또는 쉼표로 구분해주세요 (최대 5개)"
                  size="lg"
                  variant="bordered"
                  disabled
                  classNames={{
                    inputWrapper: "border-gray-300",
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  * 태그 기능은 추후 제공 예정입니다.
                </p>
              </div>
              */}

              {/* 작성 가이드라인 - 간결하게 수정 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  작성 가이드라인
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 명확하고 구체적인 제목을 작성해주세요</li>
                  <li>• 다른 사용자에게 도움이 되는 내용을 공유해주세요</li>
                  <li>• 욕설, 비방, 광고성 게시글은 삭제될 수 있습니다</li>
                </ul>
              </div>

              {/* 버튼 영역 - 명세: '등록', '취소' */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="bordered"
                  size="lg"
                  onPress={handleCancel}
                  disabled={isSubmitting}
                  startContent={<X size={18} />}
                  className="min-w-[100px]"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  startContent={!isSubmitting && <PenTool size={18} />}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? "등록 중..." : "등록"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}