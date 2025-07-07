"use client";

import React from "react";
import { Heart, MessageCircle, Clock, PenTool } from "lucide-react";
import { cn } from "@heroui/theme";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Badge from "@/shared/components/Badge";
import { UserType } from "@/shared/types/user.types";
import { UserTypeMap } from "@/shared/const/user.const";
import FullHeart from "@/shared/components/FullHeart";

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

export default function MainBoards() {
  const { data: session } = useSession();
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
            <h2 className="text-3xl font-bold text-[#121314]">커뮤니티 게시판</h2>
            <p className="text-lg text-[#777777] font-medium mt-1">
              IT 지식과 경험을 공유해보세요!
            </p>
          </div>
          {session && (
            <Button
              as={Link}
              href="/boards/new"
              color="primary"
              size="lg"
              startContent={<PenTool size={18} />}
              className="bg-[#598ADD] hover:bg-[#598ADD]/80"
            >
              게시글 작성
            </Button>
          )}
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
        <span className="font-bold text-[#9AA4B2]">
          {number.toString().padStart(2, "0")}
        </span>
        <h5 className="flex-1 font-medium flex-grow text-ellipsis overflow-hidden whitespace-nowrap max-w-sm">
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
          <div className="flex items-center gap-1">
            <Clock size={20} />
            <span>{time}</span>
          </div>
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

const newPosts: Post[] = [
  {
    title: "마케팅 업무를 시작하는데 나아아갈까요?",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "developer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "projectManager",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
];

const hotPosts: Post[] = [
  {
    title: "마케팅 업무를 시작하는데 나아아갈까요?",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 2,
    comments: 12,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어...",
    author: "홍길동",
    authorType: "developer",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어...",
    author: "홍길동",
    authorType: "projectManager",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
];
