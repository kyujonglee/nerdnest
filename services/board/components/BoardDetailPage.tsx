"use client";

import { Card, CardBody, Button, Chip } from "@heroui/react";
import { ArrowLeft, Eye, MessageCircle, Heart, Share2 } from "lucide-react";
import { formatDate } from "@/shared/utils/dateUtils";
import { useBoardDetail } from "../board.hooks";
import { useRouter } from "next/navigation";
import { BoardDetail } from "@/types/board.types";
import CommentSection from "./CommentSection";

interface BoardDetailPageProps {
  boardId: number;
}

export default function BoardDetailPage({ boardId }: BoardDetailPageProps) {
  const router = useRouter();
  const { data: board, isLoading, error } = useBoardDetail(boardId);

  if (isLoading) {
    return <BoardDetailSkeleton />;
  }

  if (error || !board) {
    return <BoardDetailError onGoBack={() => router.back()} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Chip
          color="primary"
          variant="flat"
          className="text-sm"
        >
          {board.categoryName}
        </Chip>
      </div>

      {/* 게시글 상세 내용 */}
      <Card className="border border-gray-200 bg-white">
        <CardBody className="p-8">
          {/* 작성자 정보 및 메타데이터 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {board.writerName[0]}
                </span>
              </div>
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {board.writerName}
                </div>
                <div className="text-sm text-gray-500">
                  {board.writerJob} · {board.writerLevel}년차
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(board.createdAt)}
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
            {board.title}
          </h1>

          {/* 본문 내용 */}
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {board.content}
            </div>
          </div>

          {/* 통계 및 액션 버튼 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>조회수 {board.view.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>댓글 {board.commentCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>좋아요 {board.likeCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="light"
                startContent={<Heart className="h-4 w-4" />}
                className="text-gray-600 hover:text-red-500"
              >
                좋아요
              </Button>
              <Button
                variant="light"
                startContent={<Share2 className="h-4 w-4" />}
                className="text-gray-600 hover:text-blue-500"
              >
                공유하기
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 댓글 섹션 */}
      <CommentSection boardId={boardId} />
    </div>
  );
}

// 로딩 상태 컴포넌트
function BoardDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      <Card className="border border-gray-200">
        <CardBody className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
          
          <div className="space-y-3 mb-8">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-14 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// 에러 상태 컴포넌트
function BoardDetailError({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border border-red-200 bg-red-50">
        <CardBody className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <MessageCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            게시글을 불러올 수 없습니다
          </h2>
          <p className="text-red-600 mb-6">
            게시글이 삭제되었거나 접근할 수 없습니다.
          </p>
          <Button
            color="primary"
            onPress={onGoBack}
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            돌아가기
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}