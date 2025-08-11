// API Response 타입 정의
export interface BoardItem {
  id: number;
  title: string;
  content: string;
  view: number;
  likeCount: number;
  createdAt: string;
  writerName: string;
  writerJob: string;
  writerLevel: number;
  categoryName: string;
  commentCount: number;
}

export interface BoardsApiResponse {
  content: BoardItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// 컴포넌트에서 사용할 Board 타입 (UI에 맞게 변환)
export interface Board {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    job: string;
    level: number;
  };
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}

// API 쿼리 파라미터 타입
export interface CategoryBoardsParams {
  categoryId: number;
  page?: number;
  keyword?: string;
}