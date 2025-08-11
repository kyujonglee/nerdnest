// 카테고리 매핑 정보 (서버 메타데이터와 일치)
const CATEGORY_MAP = {
  development: { id: 1, name: "개발", displayName: "개발" },
  planning: { id: 2, name: "기획", displayName: "기획" },
  design: { id: 3, name: "디자인", displayName: "디자인" },
  community: { id: 4, name: "커뮤니티", displayName: "커뮤니티" },
} as const;

export type CategoryKey = keyof typeof CATEGORY_MAP;

/**
 * 카테고리 이름으로 카테고리 ID를 반환
 */
export function getCategoryId(categoryName: string): number | null {
  const category = CATEGORY_MAP[categoryName as CategoryKey];
  return category ? category.id : null;
}

/**
 * 카테고리 이름으로 표시용 이름을 반환
 */
export function getCategoryDisplayName(categoryName: string): string {
  const category = CATEGORY_MAP[categoryName as CategoryKey];
  return category ? category.displayName : categoryName;
}

/**
 * 카테고리 ID로 카테고리 이름을 반환
 */
export function getCategoryName(categoryId: number): string | null {
  const category = Object.entries(CATEGORY_MAP).find(
    ([, value]) => value.id === categoryId
  );
  return category ? category[0] : null;
}

/**
 * 카테고리 ID로 표시용 이름을 반환
 */
export function getCategoryDisplayNameById(categoryId: number): string | null {
  const category = Object.values(CATEGORY_MAP).find(
    (value) => value.id === categoryId
  );
  return category ? category.displayName : null;
}

/**
 * 모든 카테고리 목록을 반환
 */
export function getAllCategories() {
  return Object.entries(CATEGORY_MAP).map(([key, value]) => ({
    key,
    id: value.id,
    name: value.name,
    displayName: value.displayName,
  }));
}

/**
 * 유효한 카테고리 이름인지 확인
 */
export function isValidCategory(categoryName: string): boolean {
  return categoryName in CATEGORY_MAP;
}