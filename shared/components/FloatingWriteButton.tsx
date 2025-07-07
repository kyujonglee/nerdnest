"use client";

import { PenTool } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@heroui/button";

export default function FloatingWriteButton() {
  const { data: session } = useSession();

  // 로그인하지 않은 사용자에게는 표시하지 않음
  if (!session) {
    return null;
  }

  return (
    <Button
      as={Link}
      href="/boards/new"
      isIconOnly
      color="primary"
      size="lg"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#598ADD] hover:bg-[#598ADD]/80 shadow-lg hover:shadow-xl transition-all duration-200 lg:hidden"
      aria-label="게시글 작성"
    >
      <PenTool size={24} />
    </Button>
  );
}
