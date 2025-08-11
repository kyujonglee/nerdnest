import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardListResponse,
  BoardListParams,
  BoardDetail,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types/board.types";
import {
  BoardsApiResponse,
  Board as CategoryBoard,
  CategoryBoardsParams,
} from "@/shared/types/board";

// API 호출 함수들
const boardApi = {
  // 게시글 목록 조회
  getBoards: (params: BoardListParams = {}): Promise<BoardListResponse> => {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.categoryId)
      query.append("categoryId", params.categoryId.toString());
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);

    return apiClient.get<BoardListResponse>(`/boards?${query.toString()}`);
  },

  // 특정 게시글 조회
  getBoard: (id: number): Promise<Board> =>
    apiClient.get<Board>(`/api/boards/${id}`),

  // 게시글 상세 조회 (댓글 개수 포함)
  getBoardDetail: (id: number): Promise<BoardDetail> =>
    apiClient.get<BoardDetail>(`/api/boards/${id}/detail`),

  // 게시글 생성
  createBoard: (data: CreateBoardRequest): Promise<Board> =>
    apiClient.post<Board>("/api/boards", data),

  // 게시글 수정
  updateBoard: (id: number, data: UpdateBoardRequest): Promise<Board> =>
    apiClient.put<Board>(`/api/boards/${id}`, data),

  // 게시글 삭제
  deleteBoard: (id: number): Promise<void> =>
    apiClient.delete<void>(`/api/boards/${id}`),
};

// 댓글 API 호출 함수들
const commentApi = {
  // 특정 게시글의 댓글 목록 조회
  getComments: (boardId: number): Promise<Comment[]> =>
    apiClient.get<Comment[]>(`/api/comments/board/${boardId}`),

  // 댓글 생성
  createComment: (data: CreateCommentRequest): Promise<Comment> =>
    apiClient.post<Comment>("/api/comments", data),

  // 댓글 수정
  updateComment: (id: number, data: UpdateCommentRequest): Promise<Comment> =>
    apiClient.put<Comment>(`/api/comments/${id}`, data),

  // 댓글 삭제
  deleteComment: (id: number): Promise<void> =>
    apiClient.delete<void>(`/api/comments/${id}`),
};

// Query Keys
export const boardQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardQueryKeys.all, "list"] as const,
  list: (params: BoardListParams) =>
    [...boardQueryKeys.lists(), params] as const,
  details: () => [...boardQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...boardQueryKeys.details(), id] as const,
} as const;

// 댓글 Query Keys
export const commentQueryKeys = {
  all: ["comments"] as const,
  lists: () => [...commentQueryKeys.all, "list"] as const,
  list: (boardId: number) => [...commentQueryKeys.lists(), boardId] as const,
  details: () => [...commentQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...commentQueryKeys.details(), id] as const,
} as const;

// 게시글 목록 조회 훅
export const useBoards = (params: BoardListParams = {}) => {
  return useQuery({
    queryKey: boardQueryKeys.list(params),
    queryFn: () => boardApi.getBoards(params),
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 특정 게시글 조회 훅
export const useBoard = (id: number) => {
  return useQuery({
    queryKey: boardQueryKeys.detail(id),
    queryFn: () => boardApi.getBoard(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// 게시글 상세 조회 훅 (댓글 개수 포함)
export const useBoardDetail = (id: number) => {
  return useQuery({
    queryKey: [...boardQueryKeys.detail(id), "detail"],
    queryFn: () => boardApi.getBoardDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

// 게시글 생성 훅
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardApi.createBoard,
    onSuccess: () => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: boardQueryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
    },
  });
};

// 게시글 수정 훅
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBoardRequest }) =>
      boardApi.updateBoard(id, data),
    onSuccess: (updatedBoard) => {
      // 특정 게시글 캐시 업데이트
      queryClient.setQueryData(
        boardQueryKeys.detail(updatedBoard.id),
        updatedBoard
      );

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: boardQueryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
    },
  });
};

// 게시글 삭제 훅
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardApi.deleteBoard,
    onSuccess: (_, deletedId) => {
      // 해당 게시글 캐시 제거
      queryClient.removeQueries({
        queryKey: boardQueryKeys.detail(deletedId),
      });

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: boardQueryKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("게시글 삭제 실패:", error);
    },
  });
};

// API Response를 UI에서 사용할 형태로 변환하는 함수
function transformCategoryBoardData(apiData: BoardsApiResponse) {
  const boards: CategoryBoard[] = apiData.content.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    author: {
      name: item.writerName,
      job: item.writerJob,
      level: item.writerLevel,
    },
    createdAt: item.createdAt,
    viewCount: item.view,
    commentCount: item.commentCount,
    likeCount: item.likeCount,
  }));

  return {
    boards,
    totalPages: apiData.totalPages,
    totalElements: apiData.totalElements,
    currentPage: apiData.number,
    isFirst: apiData.first,
    isLast: apiData.last,
  };
}

// 새로운 API 호출 함수들 추가
const specialBoardApi = {
  // Nerd's kick 조회 (킥 게시글)
  getKickBoards: (): Promise<Board[]> =>
    apiClient.get<Board[]>("/api/boards/kick"),

  // 최신글 조회
  getLatestBoards: (): Promise<Board[]> =>
    apiClient.get<Board[]>("/api/boards/latest"),

  // 인기글 조회 (좋아요 많은 글)
  getLikeBoards: (): Promise<Board[]> =>
    apiClient.get<Board[]>("/api/boards/like"),

  // 카테고리별 게시글 목록 조회
  getCategoryBoards: async ({
    categoryId,
    page = 0,
    keyword,
  }: CategoryBoardsParams) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(keyword && { keyword }),
    });

    const response = await fetch(
      `/api/api/boards/category/${categoryId}?${params}`
    );

    if (!response.ok) {
      throw new Error(
        `게시글 목록을 불러오는데 실패했습니다: ${response.status}`
      );
    }

    const data: BoardsApiResponse = await response.json();
    return transformCategoryBoardData(data);
  },
};

// 새로운 Query Keys 추가
export const specialBoardQueryKeys = {
  kick: ["boards", "kick"] as const,
  latest: ["boards", "latest"] as const,
  like: ["boards", "like"] as const,
  categoryBoards: (categoryId: number, page: number, keyword?: string) =>
    ["boards", "category", categoryId, page, keyword] as const,
} as const;

// Nerd's kick 조회 훅
export const useKickBoards = () => {
  return useQuery({
    queryKey: specialBoardQueryKeys.kick,
    queryFn: specialBoardApi.getKickBoards,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};

// 최신글 조회 훅
export const useLatestBoards = () => {
  return useQuery({
    queryKey: specialBoardQueryKeys.latest,
    queryFn: specialBoardApi.getLatestBoards,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 인기글 조회 훅 (좋아요 많은 글)
export const useLikeBoards = () => {
  return useQuery({
    queryKey: specialBoardQueryKeys.like,
    queryFn: specialBoardApi.getLikeBoards,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지 (인기글은 자주 변하지 않으므로)
  });
};

// 카테고리별 게시글 조회 훅
export const useCategoryBoards = ({
  categoryId,
  page = 0,
  keyword,
}: CategoryBoardsParams) => {
  return useQuery({
    queryKey: specialBoardQueryKeys.categoryBoards(categoryId, page, keyword),
    queryFn: () =>
      specialBoardApi.getCategoryBoards({ categoryId, page, keyword }),
    enabled: !!categoryId, // categoryId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// === 댓글 관련 훅들 ===

// 특정 게시글의 댓글 목록 조회 훅
export const useComments = (boardId: number) => {
  return useQuery({
    queryKey: commentQueryKeys.list(boardId),
    queryFn: () => commentApi.getComments(boardId),
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 댓글 생성 훅
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: (newComment) => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.list(newComment.boardId),
      });

      // 게시글 상세 정보 캐시도 무효화 (댓글 개수 업데이트)
      queryClient.invalidateQueries({
        queryKey: [...boardQueryKeys.detail(newComment.boardId), "detail"],
      });
    },
    onError: (error) => {
      console.error("댓글 생성 실패:", error);
    },
  });
};

// 댓글 수정 훅
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentRequest }) =>
      commentApi.updateComment(id, data),
    onSuccess: (updatedComment) => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.list(updatedComment.boardId),
      });
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
    },
  });
};

// 댓글 삭제 훅
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: (_, deletedCommentId, context: any) => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      if (context?.boardId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.list(context.boardId),
        });

        // 게시글 상세 정보 캐시도 무효화 (댓글 개수 업데이트)
        queryClient.invalidateQueries({
          queryKey: [...boardQueryKeys.detail(context.boardId), "detail"],
        });
      }
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
    },
  });
};
