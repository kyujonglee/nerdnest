import BoardDetailPage from "@/services/board/components/BoardDetailPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BoardDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const boardId = parseInt(id, 10);

  // ID가 유효하지 않은 경우 404 처리
  if (isNaN(boardId) || boardId <= 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            잘못된 게시글 ID입니다
          </h1>
          <p className="text-gray-600">올바른 게시글 ID를 확인해주세요.</p>
        </div>
      </div>
    );
  }

  return <BoardDetailPage boardId={boardId} />;
}

// 메타데이터 생성 (SEO를 위한)
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const boardId = parseInt(id, 10);

  if (isNaN(boardId) || boardId <= 0) {
    return {
      title: "잘못된 게시글 - NerdNest",
      description: "요청한 게시글을 찾을 수 없습니다.",
    };
  }

  // TODO: 실제 프로덕션에서는 서버에서 게시글 정보를 미리 가져와서 메타데이터를 생성
  return {
    title: `게시글 #${boardId} - NerdNest`,
    description: "NerdNest 커뮤니티의 게시글입니다.",
  };
}