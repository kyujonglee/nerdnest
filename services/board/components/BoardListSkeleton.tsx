import { Card, CardBody } from "@heroui/react";

export default function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <Card key={i} className="animate-pulse border border-gray-200">
          <CardBody className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}