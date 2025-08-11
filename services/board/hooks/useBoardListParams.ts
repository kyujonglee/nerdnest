import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface UseBoardListParamsOptions {
  category: string;
  page?: string;
  sort?: string;
  keyword?: string;
}

export function useBoardListParams({
  category,
  page = "1",
  sort = "latest",
  keyword = "",
}: UseBoardListParamsOptions) {
  const router = useRouter();
  const [keywordValue, setKeywordValue] = useState(keyword);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [sortValue, setSortValue] = useState(sort);

  // URL 업데이트 함수
  const updateURL = useCallback(
    (params: { page?: string; keyword?: string; sort?: string }) => {
      const searchParams = new URLSearchParams();

      if (params.page && params.page !== "1") {
        searchParams.set("page", params.page);
      }
      if (params.keyword && params.keyword.trim()) {
        searchParams.set("keyword", params.keyword.trim());
      }
      if (params.sort && params.sort !== "latest") {
        searchParams.set("sort", params.sort);
      }

      const queryString = searchParams.toString();
      const newURL = `/boards/${category}${
        queryString ? `?${queryString}` : ""
      }`;

      router.push(newURL);
    },
    [category, router]
  );

  // Debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keywordValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [keywordValue]);

  // debouncedKeyword가 변경될 때 URL 업데이트
  useEffect(() => {
    if (debouncedKeyword !== keyword) {
      updateURL({
        page: "1",
        keyword: debouncedKeyword,
        sort: sortValue,
      });
    }
  }, [debouncedKeyword, keyword, sortValue, updateURL]);

  const handleSearch = useCallback(() => {
    setDebouncedKeyword(keywordValue);
    updateURL({
      page: "1",
      keyword: keywordValue,
      sort: sortValue,
    });
  }, [keywordValue, sortValue, updateURL]);

  const handleSortChange = useCallback(
    (value: string) => {
      setSortValue(value);
      updateURL({
        page: "1",
        keyword: keywordValue,
        sort: value,
      });
    },
    [keywordValue, updateURL]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateURL({
        page: newPage.toString(),
        keyword: keywordValue,
        sort: sortValue,
      });
    },
    [keywordValue, sortValue, updateURL]
  );

  return {
    keywordValue,
    setKeywordValue,
    debouncedKeyword,
    sortValue,
    handleSearch,
    handleSortChange,
    handlePageChange,
  };
}