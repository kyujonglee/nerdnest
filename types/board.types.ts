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
  writerName: string;
  writerJob: string;
  writerLevel: number;
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

// 게시글 상세 정보 타입 (댓글 정보 포함)
export interface BoardDetail extends Board {
  commentCount: number;
}

// 댓글 작성자 정보 타입
export interface CommentAuthor {
  name: string;
  job: string;
  level: number;
}

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  boardId: number;
}

// 댓글 생성 요청 타입
export interface CreateCommentRequest {
  content: string;
  boardId: number;
}

// 댓글 수정 요청 타입
export interface UpdateCommentRequest {
  content: string;
}
