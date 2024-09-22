import Image from "next/image";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="flex justify-center border-t-1 border-[#DDDDDD]">
      <div className="w-full max-w-6xl pt-12 pb-24 px-4">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Image
              src="/images/footer_logo.svg"
              alt="footer_logo"
              width={100}
              height={32}
            />
            <h3 className="mt-12 whitespace-pre-wrap text-3xl font-medium">
              We All Share{"\n"}And Grow
            </h3>
          </div>
          <div className="pl-6 grid grid-cols-2 gap-4 text-lg tex-[#333333]">
            <span>소개</span>
            <span>오류제보</span>
            <span>공지사항</span>
            <span>문의하기</span>
            <span>이용약관</span>
            <span>개인정보처리방침</span>
          </div>
          <div className="flex gap-4 justify-end">
            <span>
              <FaInstagram
                size={32}
                className="cursor-pointer p-1 rounded-full bg-[#EEEEEE]"
                color="#676767"
              />
            </span>
            <span>
              <FaYoutube
                size={32}
                className="cursor-pointer p-1 rounded-full bg-[#EEEEEE]"
                color="#676767"
              />
            </span>
            <span>
              <FaXTwitter
                size={32}
                className="cursor-pointer p-1 rounded-full bg-[#EEEEEE]"
                color="#676767"
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
