import React from "react";
import { useRouter } from "next/navigation";
import { useKickBoards, useLatestBoards, useLikeBoards } from "../board.hooks";

// Nerd's Kick 컴포넌트
export const KickBoardsList = () => {
  const router = useRouter();
  const { data, isLoading, error } = useKickBoards();

  if (isLoading) return <div>Nerd&apos;s kick 로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/detail/${boardId}`);
  };

  return (
    <div>
      <h2>Nerd&apos;s Kick</h2>
      {data?.map((board) => (
        <div 
          key={board.id} 
          className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
          onClick={() => handleBoardClick(board.id)}
        >
          <h3>{board.title}</h3>
          <p>카테고리: {board.categoryName}</p>
          <p>
            조회수: {board.view} | 좋아요: {board.likeCount}
          </p>
        </div>
      ))}
    </div>
  );
};

// 최신글 컴포넌트
export const LatestBoardsList = () => {
  const router = useRouter();
  const { data, isLoading, error } = useLatestBoards();

  if (isLoading) return <div>최신글 로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/detail/${boardId}`);
  };

  return (
    <div>
      <h2>최신글</h2>
      {data?.map((board) => (
        <div 
          key={board.id} 
          className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
          onClick={() => handleBoardClick(board.id)}
        >
          <h3>{board.title}</h3>
          <p>카테고리: {board.categoryName}</p>
          <p>작성일: {new Date(board.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

// 인기글 컴포넌트
export const LikeBoardsList = () => {
  const router = useRouter();
  const { data, isLoading, error } = useLikeBoards();

  if (isLoading) return <div>인기글 로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;

  const handleBoardClick = (boardId: number) => {
    router.push(`/boards/detail/${boardId}`);
  };

  return (
    <div>
      <h2>인기글 (좋아요 많은 글)</h2>
      {data?.map((board) => (
        <div 
          key={board.id} 
          className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-50"
          onClick={() => handleBoardClick(board.id)}
        >
          <h3>{board.title}</h3>
          <p>카테고리: {board.categoryName}</p>
          <p>
            좋아요: {board.likeCount} | 조회수: {board.view}
          </p>
        </div>
      ))}
    </div>
  );
};
