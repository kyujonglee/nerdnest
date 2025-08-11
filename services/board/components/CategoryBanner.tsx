import Image from "next/image";
import { CATEGORY_INFO, type CategoryKey } from "../constants/category.constants";

interface CategoryBannerProps {
  title: string;
  categoryKey?: CategoryKey;
}

export default function CategoryBanner({ title, categoryKey }: CategoryBannerProps) {
  // 카테고리 키를 title에서 추출 (한글 -> 영문 매핑)
  const getCategoryKey = (): CategoryKey => {
    if (categoryKey) return categoryKey;
    
    const titleMap: Record<string, CategoryKey> = {
      "기획": "planning",
      "디자인": "design",
      "개발": "development",
      "커뮤니티": "community",
      "Tip": "tip",
    };
    
    return titleMap[title] || "planning";
  };

  const category = CATEGORY_INFO[getCategoryKey()];

  return (
    <div className="w-full bg-white px-6 pt-6 pb-0">
      <div className="max-w-6xl mx-auto">
        <div className={`relative w-full h-[280px] bg-gradient-to-br ${category.gradient} rounded-2xl overflow-hidden shadow-lg`}>
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          </div>

          <div className="relative h-full flex items-center justify-between px-12">
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className="flex-1 text-white">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {category.title}
                </h1>
                <p className="text-xl font-medium opacity-95">
                  {category.subtitle}
                </p>
                <p className="text-base leading-relaxed opacity-90 whitespace-pre-line max-w-md">
                  {category.description}
                </p>
              </div>
            </div>

            {/* 오른쪽: 일러스트 이미지 */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src={category.image}
                  alt={`${category.title} illustration`}
                  width={256}
                  height={256}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
