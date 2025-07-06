import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// 예시: 게시글 타입 정의
export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

// 예시: 게시글 생성 요청 타입
export interface CreatePostRequest {
  title: string;
  content: string;
}

// 예시: 게시글 수정 요청 타입
export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

// API 호출 함수들
const postApi = {
  // 게시글 목록 조회
  getPosts: (page: number = 1, limit: number = 10): Promise<Post[]> =>
    apiClient.get<Post[]>(`/posts?page=${page}&limit=${limit}`),

  // 특정 게시글 조회
  getPost: (id: number): Promise<Post> => apiClient.get<Post>(`/posts/${id}`),

  // 게시글 생성
  createPost: (data: CreatePostRequest): Promise<Post> =>
    apiClient.post<Post>("/posts", data),

  // 게시글 수정
  updatePost: (id: number, data: UpdatePostRequest): Promise<Post> =>
    apiClient.put<Post>(`/posts/${id}`, data),

  // 게시글 삭제
  deletePost: (id: number): Promise<void> =>
    apiClient.delete<void>(`/posts/${id}`),
};

// Query Keys
export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...postQueryKeys.lists(), page, limit] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const;

// 게시글 목록 조회 훅
export const usePosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: postQueryKeys.list(page, limit),
    queryFn: () => postApi.getPosts(page, limit),
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 특정 게시글 조회 훅
export const usePost = (id: number) => {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => postApi.getPost(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

// 게시글 생성 훅
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};

// 게시글 수정 훅
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      postApi.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // 특정 게시글 캐시 업데이트
      queryClient.setQueryData(
        postQueryKeys.detail(updatedPost.id),
        updatedPost
      );

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};

// 게시글 삭제 훅
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: (_, deletedId) => {
      // 해당 게시글 캐시 제거
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(deletedId),
      });

      // 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });
};
