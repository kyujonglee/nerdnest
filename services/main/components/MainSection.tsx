import Image from "next/image";

export default function MainSection() {
  return (
    <div className="w-full flex justify-center bg-[#416ABE]">
      <section className="w-full max-w-6xl flex justify-between text-white">
        <div>
          <h1 className="mt-[100px] text-4xl font-extrabold whitespace-pre-wrap leading-[48px]">
            국내 웹 커뮤니티 open!{"\n"}
            모두가 나누고 성장하는, 편안한 학습공간
          </h1>
          <h3 className="mt-6 mb-[152px] font-medium text-lg">
            모두가 나눔으로써 성장하는 공간, 모두가 공부하는 편안한 공간 NERD
            NEST
          </h3>
        </div>
        <Image
          src="/images/main/main_section.png"
          width={450}
          height={450}
          alt="main_section"
        />
      </section>
    </div>
  );
}
