import { Button } from "@heroui/react";
import { MessageCircle } from "lucide-react";

interface ErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <MessageCircle className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        데이터를 불러오는데 실패했습니다
      </h3>
      <p className="text-gray-600 mb-6">
        {error?.message || "알 수 없는 오류가 발생했습니다"}
      </p>
      <Button
        color="primary"
        onClick={onRetry || (() => window.location.reload())}
      >
        다시 시도
      </Button>
    </div>
  );
}