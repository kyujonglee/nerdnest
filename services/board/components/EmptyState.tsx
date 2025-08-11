import { Button } from "@heroui/react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  message?: string;
  description?: string;
  showWriteButton?: boolean;
}

export default function EmptyState({
  message = "아직 게시글이 없습니다",
  description = "첫 번째 게시글을 작성해보세요!",
  showWriteButton = true,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <MessageCircle className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {showWriteButton && (
        <Link href="/boards/new">
          <Button color="primary">글쓰기</Button>
        </Link>
      )}
    </div>
  );
}