import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">대시보드</h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            환영합니다, {session.user?.name || session.user?.email}님!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">사용자 정보</h3>
              <p className="text-sm text-blue-600">
                이메일: {session.user?.email}
              </p>
              <p className="text-sm text-blue-600">
                이름: {session.user?.name || "설정되지 않음"}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">인증 상태</h3>
              <p className="text-sm text-green-600">✅ 로그인됨</p>
              <p className="text-sm text-green-600">
                세션 만료: {session.expires}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                액세스 토큰
              </h3>
              <p className="text-sm text-purple-600">
                {session.accessToken ? "✅ 토큰 보유" : "❌ 토큰 없음"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">테스트 기능</h3>
            <p className="text-sm text-gray-600">
              이 페이지는 인증된 사용자만 접근할 수 있습니다. 미들웨어에 의해
              보호되고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
