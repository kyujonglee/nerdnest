import { Button, Select, SelectItem } from "@heroui/react";
import { PenTool } from "lucide-react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { SORT_OPTIONS } from "../constants/board.constants";
import { getCategoryId } from "@/shared/utils/categoryUtils";

interface FilterSectionProps {
  keywordValue: string;
  sortValue: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSortChange: (value: string) => void;
  category?: string;
}

export default function FilterSection({
  keywordValue,
  sortValue,
  onKeywordChange,
  onSearch,
  onSortChange,
  category,
}: FilterSectionProps) {
  // 카테고리 ID 가져오기
  const categoryId = category ? getCategoryId(category) : null;
  return (
    <div className="w-full px-6 py-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {/* 빈 공간 */}
          <div />

          {/* 검색 영역 */}
          <div className="flex items-center flex-1">
            <SearchBar
              value={keywordValue}
              onChange={onKeywordChange}
              onSearch={onSearch}
            />
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center gap-3 justify-end">
            <Button
              as={Link}
              href={categoryId ? `/boards/new?categoryId=${categoryId}` : "/boards/new"}
              color="primary"
              startContent={<PenTool size={16} />}
              className="bg-[#598ADD] hover:bg-[#598ADD]/80"
            >
              글쓰기
            </Button>
            <Select
              selectedKeys={[sortValue]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                onSortChange(selected);
              }}
              className="min-w-[120px] w-[120px]"
              variant="bordered"
              placeholder="최신순"
              classNames={{
                trigger: "border-gray-300 bg-white",
                value: "text-gray-700",
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
