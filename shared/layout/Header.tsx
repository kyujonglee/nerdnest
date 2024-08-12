import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-center">
      <nav className="w-full max-w-6xl py-5 px-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              className="mr-20"
              alt="logo"
              width={100}
              height={38}
              quality={100}
            />
            <div className="flex items-center gap-9">
              <Link href="/">기획</Link>
              <Link href="/">디자인</Link>
              <Link href="/">개발</Link>
              <Link href="/">커뮤니티</Link>
              <Link href="/">Tip</Link>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-6">
              <Link href="/">로그인</Link>
              <Link href="/">회원가입</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
