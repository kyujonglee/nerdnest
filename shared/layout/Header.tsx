"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { User, LogOut, Settings, PenTool } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="flex justify-center border-b border-b-gray-200">
      <nav className="w-full max-w-6xl py-5 px-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                className="mr-20"
                alt="logo"
                width={100}
                height={38}
                quality={100}
              />
            </Link>
            <div className="flex items-center gap-9">
              <Link href="/" className="hover:text-[#598ADD] transition-colors">
                기획
              </Link>
              <Link href="/" className="hover:text-[#598ADD] transition-colors">
                디자인
              </Link>
              <Link href="/" className="hover:text-[#598ADD] transition-colors">
                개발
              </Link>
              <Link href="/" className="hover:text-[#598ADD] transition-colors">
                커뮤니티
              </Link>
              <Link href="/" className="hover:text-[#598ADD] transition-colors">
                Tip
              </Link>
            </div>
          </div>
          <div>
            {status === "loading" ? (
              <div className="flex items-center gap-6">
                <div className="w-12 h-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : session ? (
              // 로그인된 상태
              <div className="flex items-center gap-4">
                <Button
                  as={Link}
                  href="/boards/new"
                  color="primary"
                  startContent={<PenTool size={16} />}
                  className="bg-[#598ADD] hover:bg-[#598ADD]/80"
                >
                  글쓰기
                </Button>
                <span className="text-sm text-gray-600">
                  안녕하세요,{" "}
                  <span className="font-bold text-[#598ADD]">
                    {session.user?.username}
                  </span>
                  님!
                </span>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      as="button"
                      className="transition-transform hover:scale-105"
                      size="sm"
                      name={session.user?.name?.slice(0, 1) || "User"}
                      src={session.user?.image || undefined}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-bold text-[#598ADD]">
                        @{session.user?.username}
                      </p>
                      <p className="text-small text-gray-600">
                        {session.user?.name}
                      </p>
                    </DropdownItem>
                    <DropdownItem
                      key="settings"
                      startContent={<Settings className="w-4 h-4" />}
                    >
                      마이페이지
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={<LogOut className="w-4 h-4" />}
                      onClick={handleSignOut}
                    >
                      로그아웃
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              // 로그인되지 않은 상태
              <div className="flex items-center gap-4">
                <Button
                  as={Link}
                  href="/auth/signin"
                  variant="light"
                  className="text-gray-700 hover:text-[#598ADD]"
                >
                  로그인
                </Button>
                <Button
                  as={Link}
                  href="/auth/signup"
                  className="bg-[#598ADD] hover:bg-[#598ADD]/80 text-white"
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
