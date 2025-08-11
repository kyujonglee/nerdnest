import { useRouter } from "next/navigation";
import BoardCard from "./BoardCard";
import BoardListSkeleton from "./BoardListSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import type { Board } from "../types/board.types";

interface BoardListProps {
  boards: Board[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function BoardList({ 
  boards, 
  isLoading, 
  isError, 
  error 
}: BoardListProps) {
  const router = useRouter();

  if (isLoading) {
    return <BoardListSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (boards.length === 0) {
    return <EmptyState />;
  }

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/detail/${boardId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onPress={() => handleBoardClick(board.id)}
        />
      ))}
    </div>
  );
}