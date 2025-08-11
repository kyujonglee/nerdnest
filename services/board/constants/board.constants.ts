export const SORT_OPTIONS = [
  { key: "latest", label: "최신순" },
  { key: "oldest", label: "오래된 순" },
  { key: "likes", label: "추천순" },
  { key: "views", label: "조회순" },
] as const;

export const ITEMS_PER_PAGE = 9;

export const DEBOUNCE_DELAY = 500; // ms