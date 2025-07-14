"use client";

import Badge from "@/shared/components/Badge";
import { UserTypeMap } from "@/shared/const/user.const";
import Image from "next/image";
import { useKickBoards } from "@/services/board/board.hooks";
import { UserType } from "@/shared/types/user.types";

const jobToUserType = (job: string): UserType => {
  if (job === "개발자") return "developer";
  if (job === "디자이너") return "designer";
  if (job === "기획/PM") return "projectManager";
  return "etc";
};

export default function NerdKick() {
  const { data: kickBoards, isLoading } = useKickBoards();

  if (isLoading) {
    // TODO: 스켈레톤 UI 추가
    return <div>Loading...</div>;
  }

  if (!kickBoards || kickBoards.length === 0) {
    return null;
  }

  const mainBoard = kickBoards[0];
  const subBoards = kickBoards.slice(1, 3);
  const mainBoardUserType = jobToUserType(mainBoard.writerJob);

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
          {mainBoard && (
            <div className="border-[#DDDDDD] border-1 rounded-xl p-7 bg-white col-span-2 cursor-pointer">
              <span className="text-[#AAAAAA] text-xl">
                {mainBoard.categoryName}
              </span>
              <p className="mt-4 text-2xl font-semibold text-ellipsis line-clamp-2">
                {mainBoard.title}
              </p>
              <span className="mt-3 text-[#777777] text-ellipsis line-clamp-2">
                {mainBoard.content}
              </span>
              <div className="mt-7">
                <div className="flex items-center gap-3 text-[#121314]">
                  <Badge userType={mainBoardUserType} />
                  <span>{mainBoard.writerName}</span>
                  <span className="ml-2">
                    {UserTypeMap[mainBoardUserType]} ・ {mainBoard.writerLevel}
                    년차
                  </span>
                </div>
              </div>
            </div>
          )}

          {subBoards.map((board) => {
            const userType = jobToUserType(board.writerJob);
            return (
              <div key={board.id}>
                <div className="bg-[#F8F8F8] border-[#EEEEEE] border-1 rounded-xl px-7 py-6 cursor-pointer">
                  <span className="text-[#AAAAAA]">{board.writerJob}</span>
                  <p className="mt-3 leading-6 text-lg text-ellipsis line-clamp-2 text-[#121314]">
                    {board.title}
                  </p>
                  <div className="mt-7">
                    <div className="flex items-center gap-3 text-[#777777] text-sm">
                      <Badge userType={userType} />
                      <span>{board.writerName}</span>
                      <span className="ml-2">
                        {UserTypeMap[userType]} ・ {board.writerLevel}년차
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
