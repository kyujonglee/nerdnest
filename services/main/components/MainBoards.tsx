"use client";

import React from "react";
import { Heart, MessageCircle, Clock, PenTool } from "lucide-react";
import { cn } from "@heroui/theme";
import { useSession } from "next-auth/react";
import Badge from "@/shared/components/Badge";
import { UserType } from "@/shared/types/user.types";
import { UserTypeMap } from "@/shared/const/user.const";
import FullHeart from "@/shared/components/FullHeart";
import { useLatestBoards, useLikeBoards } from "@/services/board/board.hooks";
import { Board } from "@/types/board.types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Post {
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  authorType: UserType;
  experience: number;
}

interface BoardColumnProps {
  title: string;
  subtitle: string;
  posts: Post[];
}

interface PostItemProps extends Post {
  number: number;
  authorType: UserType;
}

const jobToUserType = (job: string): UserType => {
  if (job === "개발자") return "developer";
  if (job === "디자이너") return "designer";
  if (job === "기획/PM") return "projectManager";
  return "etc";
};

export default function MainBoards() {
  const { data: session } = useSession();
  const { data: latestBoardsData } = useLatestBoards();
  const { data: likeBoardsData } = useLikeBoards();

  const mapBoardToPost = (board: Board): Post => ({
    title: board.title,
    author: board.writerName,
    time: formatDistanceToNow(new Date(board.createdAt), {
      addSuffix: true,
      locale: ko,
    }),
    likes: board.likeCount,
    comments: 0, // API 응답에 commentCount가 없으므로 0으로 설정
    authorType: jobToUserType(board.writerJob),
    experience: board.writerLevel,
  });

  const newPosts: Post[] = latestBoardsData?.map(mapBoardToPost) ?? [];
  const hotPosts: Post[] = likeBoardsData?.map(mapBoardToPost) ?? [];

  const boards: BoardColumnProps[] = [
    { title: "NEW", subtitle: "최신글", posts: newPosts },
    { title: "HOT", subtitle: "이번주 인기글", posts: hotPosts },
  ];

  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-6xl pt-[60px] pb-[60px]">
        {/* 게시판 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#121314]">
              커뮤니티 게시판
            </h2>
            <p className="text-lg text-[#777777] font-medium mt-1">
              IT 지식과 경험을 공유해보세요!
            </p>
          </div>
        </div>

        <div className="w-full flex gap-12">
          {boards.map((board) => (
            <BoardColumn key={board.title} {...board} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BoardColumn({ title, subtitle, posts }: BoardColumnProps) {
  return (
    <div className="flex-1">
      <h4 className="text-xl font-bold">
        <span className={title === "NEW" ? "text-blue-500" : "text-red-500"}>
          {title}
        </span>{" "}
        {subtitle}
      </h4>
      <ul className="mt-4">
        {posts.map((post, index) => (
          <PostItem key={index} number={index + 1} {...post} />
        ))}
      </ul>
    </div>
  );
}

function PostItem({
  number,
  title,
  author,
  time,
  likes,
  comments,
  authorType,
  experience,
}: PostItemProps) {
  return (
    <li
      className={cn(
        "bg-gray-50 px-7 pt-6 pb-6 rounded",
        number !== 1 && "border-t-1 border-[#DDDDDD]"
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold text-[#9AA4B2]">
          {number.toString().padStart(2, "0")}
        </span>
        <h5 className="flex-1 text-[22px] font-medium flex-grow text-ellipsis overflow-hidden whitespace-nowrap max-w-sm">
          {title}
        </h5>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm gap-4">
        <div className="flex items-center gap-3 text-[#121314]">
          <Badge userType={authorType} />
          <span>{author}</span>
          <span className="ml-2">
            {UserTypeMap[authorType]} ・ {experience}년차
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#444444] font-medium">
          {/* <div className="flex items-center gap-1">
            <Clock size={20} />
            <span>{time}</span>
          </div> */}
          <div className="flex items-center gap-1">
            {likes > 0 ? <FullHeart /> : <Heart size={20} />}
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={20} />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
