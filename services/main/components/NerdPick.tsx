import Badge from "@/shared/components/Badge";
import { UserTypeMap } from "@/shared/const/user.const";
import Image from "next/image";

export default function NerdPick() {
  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-6xl pt-24 pb-[60px]">
        <div className="bg-[#416ABE] w-full px-10 pt-9 rounded-xl flex justify-between">
          <h2 className="text-3xl font-bold text-white">Nerd&apos;s kick</h2>
          <div className="">
            <Image
              src="/images/main/pick.png"
              alt="pick"
              width={881}
              height={260}
            />
          </div>
        </div>
        <div className="-mt-[76px] px-7 grid grid-cols-4 gap-5 items-end">
          <div className="border-[#DDDDDD] border-1 rounded-xl p-7 bg-white col-span-2 cursor-pointer">
            <span className="text-[#AAAAAA] text-xl">디자인</span>
            <p className="mt-4 text-2xl font-semibold text-ellipsis line-clamp-2">
              리메인 디자인 시스템 오픈튜토리얼리메인 디자인 시스템
              오픈튜토리얼리메인 디자인 시스템 오픈튜토리얼
            </p>
            <span className="mt-3 text-[#777777] text-ellipsis line-clamp-2">
              리메인에서 만든 UXUI 디자이너가 무료로 참고하기 좋은 디자인 가이드
              지침서 입니다.리메인에서 만든 UXUI 디자이너가 무료로 참고하기 좋은
              디자인 가이드입니다
            </span>
            <div className="mt-7">
              <div className="flex items-center gap-3 text-[#121314]">
                <Badge userType="designer" />
                <span>홍길동</span>
                <span className="ml-2">{UserTypeMap["designer"]} ・ 3년차</span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-[#F8F8F8] border-[#EEEEEE] border-1 rounded-xl px-7 py-6 cursor-pointer">
              <span className="text-[#AAAAAA]">개발</span>
              <p className="mt-3 leading-6 text-lg text-ellipsis line-clamp-2 text-[#121314]">
                리메인 디자인 시스템 오픈튜토리얼리메인 디자인 시스템
                오픈튜토리얼리메인오픈튜토리얼
              </p>
              <div className="mt-7">
                <div className="flex items-center gap-3 text-[#777777] text-sm">
                  <Badge userType="developer" />
                  <span>홍길동</span>
                  <span className="ml-2">
                    {UserTypeMap["developer"]} ・ 5년차
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-[#F8F8F8] border-[#EEEEEE] border-1 rounded-xl px-7 py-6 cursor-pointer">
              <span className="text-[#AAAAAA]">기획</span>
              <p className="mt-3 leading-6 text-lg text-ellipsis line-clamp-2 text-[#121314]">
                리메인 디자인 시스템 오픈튜토리얼리메인 디자인 시스템
                오픈튜토리얼리메인오픈튜토리얼
              </p>
              <div className="mt-7">
                <div className="flex items-center gap-3 text-[#777777] text-sm">
                  <Badge userType="projectManager" />
                  <span>홍길동</span>
                  <span className="ml-2">
                    {UserTypeMap["projectManager"]} ・ 10년차
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
