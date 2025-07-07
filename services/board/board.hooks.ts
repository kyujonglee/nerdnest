import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardListResponse,
  BoardListParams,
} from "@/types/board.types";

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

// Query Keys
export const boardQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardQueryKeys.all, "list"] as const,
  list: (params: BoardListParams) =>
    [...boardQueryKeys.lists(), params] as const,
  details: () => [...boardQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...boardQueryKeys.details(), id] as const,
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
