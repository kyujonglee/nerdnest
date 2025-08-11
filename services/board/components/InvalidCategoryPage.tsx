import { Button } from "@heroui/react";
import Link from "next/link";

export default function InvalidCategoryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-6">존재하지 않는 카테고리입니다.</p>
        <Link href="/">
          <Button color="primary">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}