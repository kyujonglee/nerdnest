import { Input } from "@heroui/react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "알고 싶은 내용을 검색하세요.",
}: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      startContent={<Search className="h-5 w-5 text-gray-400" />}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSearch()}
      className="flex-1"
    />
  );
}