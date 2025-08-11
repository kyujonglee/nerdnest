import { CreateBoardForm } from "@/services/board";
import { requireAuth } from "@/lib/auth";

interface NewBoardPageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function NewBoardPage({ searchParams }: NewBoardPageProps) {
  // 인증 확인 - 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  await requireAuth();
  
  const params = await searchParams;
  const categoryId = params.categoryId;

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateBoardForm initialCategoryId={categoryId} />
    </div>
  );
}
