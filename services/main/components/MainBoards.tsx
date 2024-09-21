import React from "react";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { cn } from "@nextui-org/theme";
import Badge from "@/shared/components/Badge";
import { UserType } from "@/shared/types/user.types";
import { UserTypeMap } from "@/shared/const/user.const";

interface Post {
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  authorType: UserType;
  experience: number;
}

interface BoardColumnProps {
  title: string;
  subtitle: string;
  posts: Post[];
}

interface PostItemProps extends Post {
  number: number;
  authorType: UserType;
}

export default function MainBoards() {
  const boards: BoardColumnProps[] = [
    { title: "NEW", subtitle: "최신글", posts: newPosts },
    { title: "HOT", subtitle: "이번주 인기글", posts: hotPosts },
  ];

  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-6xl pt-[60px] pb-[60px]">
        <div className="w-full mt-8 flex gap-12">
          {boards.map((board) => (
            <BoardColumn key={board.title} {...board} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BoardColumn({ title, subtitle, posts }: BoardColumnProps) {
  return (
    <div className="flex-1">
      <h4 className="text-xl font-bold">
        <span className={title === "NEW" ? "text-blue-500" : "text-red-500"}>
          {title}
        </span>{" "}
        {subtitle}
      </h4>
      <ul className="mt-4">
        {posts.map((post, index) => (
          <PostItem key={index} number={index + 1} {...post} />
        ))}
      </ul>
    </div>
  );
}

function PostItem({
  number,
  title,
  author,
  time,
  likes,
  comments,
  authorType,
  experience,
}: PostItemProps) {
  return (
    <li
      className={cn(
        "bg-gray-50 px-7 pt-6 pb-6 rounded",
        number !== 1 && "border-t-1 border-[#DDDDDD]"
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="font-bold text-[#9AA4B2]">
          {number.toString().padStart(2, "0")}
        </span>
        <h5 className="flex-1 font-medium flex-grow text-ellipsis overflow-hidden whitespace-nowrap max-w-sm">
          {title}
        </h5>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm gap-4">
        <div className="flex items-center gap-3 text-[#121314]">
          <Badge userType={authorType} />
          <span>{author}</span>
          <span className="ml-2">
            {UserTypeMap[authorType]} ・ {experience}년차
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#444444] font-medium">
          <div className="flex items-center gap-1">
            <Clock size={20} />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            {likes > 0 ? <FullHeart /> : <Heart size={20} />}
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={20} />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

const newPosts: Post[] = [
  {
    title: "마케팅 업무를 시작하는데 나아아갈까요?",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "developer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "projectManager",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
  {
    title:
      "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어고민이 있어고민이 있어고민이 있어",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 0,
    experience: 1,
  },
];

const hotPosts: Post[] = [
  {
    title: "마케팅 업무를 시작하는데 나아아갈까요?",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 2,
    comments: 12,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어...",
    author: "홍길동",
    authorType: "developer",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어...",
    author: "홍길동",
    authorType: "projectManager",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
  {
    title: "3년3개월 경력자 퇴사 후 재입사 관련하여 고민이 있어",
    author: "홍길동",
    authorType: "designer",
    time: "3분전",
    likes: 0,
    comments: 3,
    experience: 1,
  },
];

const FullHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    version="1.1"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <defs>
      <clipPath id="master_svg0_0_3824">
        <rect x="0" y="0" width="24" height="24" rx="0" />
      </clipPath>
    </defs>
    <g clip-path="url(#master_svg0_0_3824)">
      <g>
        <path
          d="M12.00566,20.2C12.00566,20.2,4.3669899999999995,12.73812,4.3669899999999995,12.73812C0.21553999999999984,8.26099,6.31817,-0.33509999999999973,12.00566,6.61938C17.6931,-0.33509999999999973,23.7681,8.29084,19.6443,12.73812C19.6443,12.73812,12.00566,20.2,12.00566,20.2Z"
          fill="#E2303F"
          fillOpacity="1"
        />
        <path
          d="M12.35505,20.5577L19.9937,13.09579Q20.0026,13.08715,20.011,13.07808Q21.6333,11.32844,21.4894,8.898340000000001Q21.3569,6.66094,19.8703,5.06257Q18.281100000000002,3.35384,16.1404,3.517569Q13.9632,3.684089,12.00566,5.85201Q10.047930000000001,3.68379,7.86786,3.513437Q5.72328,3.3458579999999998,4.13129,5.05064Q2.64045,6.6471,2.51018,8.88626Q2.368683,11.31841,4.00035,13.07809Q4.0087600000000005,13.08715,4.0176,13.09579L11.65627,20.5577Q11.69097,20.5916,11.73153,20.6182Q11.7721,20.6448,11.81703,20.6631Q11.86195,20.6814,11.90955,20.6907Q11.95715,20.7,12.00566,20.7Q12.05417,20.7,12.10177,20.6907Q12.14937,20.6814,12.19429,20.6631Q12.23922,20.6448,12.27978,20.6182Q12.32035,20.5916,12.35505,20.5577ZM19.2859,12.38929Q20.6095,10.955300000000001,20.4912,8.95745Q20.3799,7.07882,19.1381,5.74361Q17.877000000000002,4.38767,16.2166,4.514657Q14.2498,4.665086,12.39271,6.93591Q12.36098,6.9747,12.32219,7.00642Q12.28407,7.037599999999999,12.2406,7.06074Q12.19713,7.083880000000001,12.14998,7.09809Q12.10283,7.11231,12.05381,7.11705Q12.0048,7.1218,11.9558,7.11689Q11.9068,7.1119699999999995,11.8597,7.0976Q11.81259,7.08322,11.7692,7.05994Q11.72581,7.03665,11.6878,7.00534Q11.64978,6.9740400000000005,11.61861,6.93591Q9.76094,4.664413,7.78996,4.510398Q6.12548,4.380334,4.86216,5.73316Q3.617788,7.06569,3.508492,8.94434Q3.392108,10.944849999999999,4.72541,12.38927L12.00566,19.500999999999998L19.2859,12.38929Z"
          fillRule="evenodd"
          fill="#E2303F"
          fillOpacity="1"
        />
      </g>
    </g>
  </svg>
);
