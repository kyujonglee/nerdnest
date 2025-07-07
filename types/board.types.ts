// 게시판 관련 타입 정의

// 게시판 게시글 타입
export interface Board {
  id: number;
  title: string;
  content: string;
  view: number;
  likeCount: number;
  createdAt: string;
  categoryName: string;
}

// 게시글 생성 요청 타입
export interface CreateBoardRequest {
  title: string;
  content: string;
  categoryId: number;
}

// 게시글 수정 요청 타입
export interface UpdateBoardRequest {
  title?: string;
  content?: string;
  categoryId?: number;
}

// 게시글 목록 응답 타입
export interface BoardListResponse {
  boards: Board[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 게시글 목록 쿼리 파라미터 타입
export interface BoardListParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sort?: "latest" | "popular" | "views";
}
