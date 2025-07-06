"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@heroui/react";
import { ArrowRight, ChevronRight } from "lucide-react";

interface SignUpSuccessProps {
  userInfo: {
    name: string;
    email: string;
  };
}

export function SignUpSuccess({ userInfo }: SignUpSuccessProps) {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/auth/signin");
  };

  const handleGoToMyPage = () => {
    // 마이페이지로 이동하는 로직 (구현 예정)
    router.push("/mypage");
  };

  return (
    <div className="flex justify-center pt-6 pb-40">
      <div className="max-w-3xl w-full px-6 text-center">
        {/* 성공 일러스트 이미지 영역 */}
        <div className="flex justify-center">
          <Image
            src="/images/auth/sign_up_complete.png"
            alt="signup-success"
            width={292}
            height={295}
            quality={100}
          />
        </div>

        {/* 성공 메시지 */}
        <h1 className="text-[32px] font-bold text-gray-900 mb-1">
          {userInfo.name}님 환영합니다!
        </h1>
        <h2 className="text-[20px] text-gray-400 mb-6 font-medium">
          1년차 기획자
        </h2>

        {/* 안내 메시지 */}
        <div className="bg-[#598ADD]/10 rounded-lg py-[52px] px-10 mb-8">
          <p className="text-[#121314] text-lg leading-relaxed break-keep text-left">
            Nerd Nest의 소중한 회원이 되신 것을 축하드립니다!
            <br />
            {
              "반가워요, 저희 Nerd Nest가 여러분의 성장의 든든한 파트너가 될 수 있도록 함께 달려볼게요 :)"
            }
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-12 justify-center">
          <NextLink href="/mypage" passHref>
            <Link
              color="primary"
              size="lg"
              underline="hover"
              showAnchorIcon
              anchorIcon={<ChevronRight className="w-5 h-5 ml-2" />}
            >
              마이페이지 바로가기
            </Link>
          </NextLink>
          <NextLink href="/" passHref>
            <Link
              color="primary"
              size="lg"
              underline="hover"
              showAnchorIcon
              anchorIcon={<ChevronRight className="w-5 h-5 ml-2" />}
            >
              홈으로 바로가기
            </Link>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
