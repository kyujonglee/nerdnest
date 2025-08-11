import CategoryBoardsPage from "@/services/board/CategoryBoardsPage";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    keyword?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const { page, sort, keyword } = await searchParams;
  return (
    <CategoryBoardsPage
      category={category}
      page={page}
      sort={sort}
      keyword={keyword}
    />
  );
}
