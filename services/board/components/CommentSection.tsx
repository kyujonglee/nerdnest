"use client";

import { useState } from "react";
import { Card, CardBody, Button, Textarea, Divider } from "@heroui/react";
import { MessageCircle, Send, Edit3, Trash2, MoreVertical } from "lucide-react";
import { formatDate } from "@/shared/utils/dateUtils";
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "../board.hooks";
import { Comment } from "@/types/board.types";
import { useSession } from "next-auth/react";

interface CommentSectionProps {
  boardId: number;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
  const { data: session } = useSession();
  const { data: comments = [], isLoading } = useComments(boardId);
  const createCommentMutation = useCreateComment();
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !session) return;

    try {
      await createCommentMutation.mutateAsync({
        content: newComment.trim(),
        boardId,
      });
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    <Card className="border border-gray-200 bg-white">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            댓글 {comments.length}개
          </h2>
        </div>

        {/* 댓글 작성 폼 */}
        {session ? (
          <div className="mb-6">
            <Textarea
              placeholder="댓글을 입력해주세요..."
              value={newComment}
              onValueChange={setNewComment}
              minRows={3}
              maxRows={6}
              classNames={{
                input: "resize-none",
                inputWrapper: "border border-gray-200",
              }}
            />
            <div className="flex justify-end mt-3">
              <Button
                color="primary"
                onPress={handleSubmitComment}
                isLoading={createCommentMutation.isPending}
                isDisabled={!newComment.trim()}
                startContent={<Send className="h-4 w-4" />}
              >
                댓글 달기
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">
              로그인 후 댓글을 작성할 수 있습니다.
            </p>
            <Button color="primary" size="sm">
              로그인하기
            </Button>
          </div>
        )}

        <Divider className="mb-6" />

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>아직 댓글이 없습니다.</p>
              <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.username || session?.user?.name || undefined}
              />
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// 개별 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
}

function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = currentUserId === comment.author.name;

  const handleUpdateComment = async () => {
    if (!editContent.trim()) return;

    try {
      await updateCommentMutation.mutateAsync({
        id: comment.id,
        data: { content: editContent.trim() },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteCommentMutation.mutateAsync(comment.id, {
        context: { boardId: comment.boardId },
      } as any);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <div className="flex gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      {/* 프로필 아바타 */}
      <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-medium text-sm">
          {comment.author.name[0]}
        </span>
      </div>

      <div className="flex-1">
        {/* 작성자 정보 및 날짜 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {comment.author.name}
            </span>
            <span className="text-sm text-gray-500">
              {comment.author.job} · {comment.author.level}년차
            </span>
            <span className="text-sm text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-gray-400">(수정됨)</span>
            )}
          </div>

          {/* 액션 버튼 */}
          {isAuthor && (
            <div className="relative">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                onPress={() => setShowActions(!showActions)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  <Button
                    variant="light"
                    size="sm"
                    className="w-full justify-start text-gray-700 hover:bg-gray-50"
                    startContent={<Edit3 className="h-4 w-4" />}
                    onPress={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onPress={handleDeleteComment}
                    isLoading={deleteCommentMutation.isPending}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 댓글 내용 */}
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onValueChange={setEditContent}
              minRows={2}
              maxRows={4}
              classNames={{
                inputWrapper: "border border-gray-200",
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={handleUpdateComment}
                isLoading={updateCommentMutation.isPending}
                isDisabled={!editContent.trim()}
              >
                수정 완료
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}

// 로딩 상태 컴포넌트
function CommentSkeleton() {
  return (
    <Card className="border border-gray-200">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
