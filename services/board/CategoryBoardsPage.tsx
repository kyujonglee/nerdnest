"use client";

import { Pagination } from "@heroui/react";
import {
  getCategoryId,
  getCategoryDisplayName,
} from "@/shared/utils/categoryUtils";
import { useCategoryBoards } from "@/services/board/board.hooks";
import { useBoardListParams } from "@/services/board/hooks/useBoardListParams";

// Components
import InvalidCategoryPage from "./components/InvalidCategoryPage";
import CategoryBanner from "./components/CategoryBanner";
import FilterSection from "./components/FilterSection";
import BoardList from "./components/BoardList";

interface CategoryBoardsPageProps {
  category: string;
  page?: string;
  sort?: string;
  keyword?: string;
}

export default function CategoryBoardsPage({
  category,
  page = "1",
  sort = "latest",
  keyword = "",
}: CategoryBoardsPageProps) {
  const categoryId = getCategoryId(category);
  const categoryDisplayName = getCategoryDisplayName(category);

  const {
    keywordValue,
    setKeywordValue,
    debouncedKeyword,
    sortValue,
    handleSearch,
    handleSortChange,
    handlePageChange,
  } = useBoardListParams({ category, page, sort, keyword });

  // React Query로 데이터 가져오기
  const { data, isLoading, isError, error } = useCategoryBoards({
    categoryId: categoryId || 0,
    page: parseInt(page) - 1,
    keyword: debouncedKeyword,
  });

  const boards = data?.boards || [];
  const totalPages = data?.totalPages || 1;

  // 잘못된 카테고리인 경우
  if (!categoryId) {
    return <InvalidCategoryPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <CategoryBanner title={categoryDisplayName} />

      {/* Filters */}
      <FilterSection
        keywordValue={keywordValue}
        sortValue={sortValue}
        onKeywordChange={setKeywordValue}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        category={category}
      />

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <BoardList
          boards={boards}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />

        {/* Pagination */}
        {!isLoading && boards.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              page={parseInt(page)}
              total={Math.max(totalPages, 1)}
              onChange={handlePageChange}
              showControls
              showShadow
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
