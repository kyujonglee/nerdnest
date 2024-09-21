import Badge from "@/shared/components/Badge";
import FullHeart from "@/shared/components/FullHeart";
import { UserTypeMap } from "@/shared/const/user.const";
import { Calendar, Heart, MessageCircle } from "lucide-react";

export default function Recommendation() {
  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-6xl pt-24 pb-[60px]">
        <div className="text-3xl font-semibold">
          <span className="text-[#598ADD]">NERD</span> <span>추천글</span>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-5">
          {new Array(3).fill(undefined).map((_, index) => (
            <div
              key={index}
              className="relative border-[#DDDDDD] border-1 rounded-xl px-7 pt-10 pb-8 bg-[#F8F8F8] cursor-pointer"
            >
              <Badge
                userType="designer"
                size={48}
                iconSize={28}
                className="absolute -top-6 left-5"
              />
              <div className="flex items-center gap-3 text-[#121314]">
                <span>홍길동</span>
                <span className="ml-2">{UserTypeMap["designer"]} ・ 3년차</span>
              </div>
              <p className="mt-6 text-xl font-semibold text-ellipsis line-clamp-2">
                마케팅 업무를 시키는데 나와야할까요?마케팅 업무를 시키는데
                나와야할까요?마케팅 업무를 시키는데 나와야할까요?
              </p>
              <p className="mt-5 text-[#777777] text-ellipsis line-clamp-2">
                리메인에서 만든 UXUI 디자이너가 무료로 참고하기 좋은 디자인
                가이드 지침서 입니다.리메인에서 만든 UXUI 디자이너가 무료로
                참고하기 좋은 디자인 가이드입니다
              </p>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <Calendar size={20} color="#598ADD" />
                  <p className="text-[#777777]">2024.01.01</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FullHeart />
                    <span>12</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={20} />
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
