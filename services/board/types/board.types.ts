export interface Board {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  author: {
    name: string;
    job: string;
    level: number;
  };
}

export interface BoardListResponse {
  boards: Board[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export type SortOption = "latest" | "oldest" | "likes" | "views";