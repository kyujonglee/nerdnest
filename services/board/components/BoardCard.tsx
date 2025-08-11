import { Card, CardBody, Button } from "@heroui/react";
import { Edit3, Heart } from "lucide-react";
import { formatDate } from "@/shared/utils/dateUtils";

interface BoardCardProps {
  board: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    viewCount: number;
    commentCount: number;
    likeCount: number;
    author: {
      name: string;
      job: string;
      level: number;
    };
  };
  onPress?: () => void;
}

export default function BoardCard({ board, onPress }: BoardCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 bg-white"
      isPressable
      onPress={onPress}
    >
      <CardBody className="p-6">
        {/* 작성자 정보 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">
                {board.author.name}
              </span>
              <span className="mx-1">/</span>
              <span>{board.author.job}</span>
              <span className="mx-1">·</span>
              <span>{board.author.level}년차</span>
            </div>
          </div>
          <Button
            isIconOnly
            variant="light"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* 게시글 내용 */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {board.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {board.content}
          </p>
        </div>

        {/* 날짜 */}
        <div className="flex items-center text-sm text-blue-500 mb-4">
          <span>{formatDate(board.createdAt)}</span>
        </div>

        {/* 통계 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span>조회수</span>
            <span className="font-medium">
              {board.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>댓글수</span>
            <span className="font-medium">{board.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>좋아요</span>
            <span className="font-medium">{board.likeCount}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}