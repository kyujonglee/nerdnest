import { cn } from "@nextui-org/theme";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties } from "react";

export default function Categories() {
  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-6xl pt-32 pb-[60px]">
        <h2 className="text-3xl font-bold text-[#121314]">NN 카테고리</h2>
        <h3 className="mt-1.5 text-lg text-[#777777] font-medium">
          카테고리별 질문과 답변을 확인해보세요!
        </h3>

        <div className="mt-12 flex items-center justify-around flex-wrap">
          {CATEGORIES.map((category) => (
            <Link
              key={category.text}
              href="/"
              className={cn(
                "relative group p-6 rounded-3xl h-[290px] w-[200px]",
                `bg-gradient-to-b from-[${category.gradientFrom}] to-[${category.gradientTo}]`
              )}
            >
              <span className="text-2xl text-white font-bold">
                {category.text}
              </span>
              <Image
                src={`/images/main/${category.imageFileName}.png`}
                alt={category.text}
                className="absolute right-0 bottom-0 rounded-br-3xl"
                width={140}
                height={140}
              />
              <div className="hidden group-hover:block absolute bottom-6 left-6 text-white text-lg">
                <span className="underline font-extrabold">보러가기</span>
                {" >"}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const CATEGORIES: {
  href: string;
  gradientFrom: CSSProperties["color"];
  gradientTo: CSSProperties["color"];
  text: string;
  imageFileName: string;
}[] = [
  {
    href: "/",
    gradientFrom: "#6886F8",
    gradientTo: "#6455EC",
    text: "기획",
    imageFileName: "planning",
  },
  {
    href: "/",
    gradientFrom: "#FBAB3C",
    gradientTo: "#FB8B66",
    text: "디자인",
    imageFileName: "design",
  },
  {
    href: "/",
    gradientFrom: "#0BBC86",
    gradientTo: "#0AA9AC",
    text: "개발",
    imageFileName: "development",
  },
  {
    href: "/",
    gradientFrom: "#ED5F6B",
    gradientTo: "#D23B47",
    text: "커뮤니티",
    imageFileName: "community",
  },
  {
    href: "/",
    gradientFrom: "#1497F2",
    gradientTo: "#515AE0",
    text: "Tip",
    imageFileName: "tip",
  },
];
