"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-10 bg-white py-7">
      <Link href={"/"} className="text-2xl font-bold">
        BlogSphere
      </Link>
      <div className="items-center hidden gap-10 text-lg md:flex">
        <Link href={"/blogs"}>Blogs</Link>
        <Link href={"/write"}>Write</Link>
        {/* Authentication */}
        <div className="flex items-center">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  src={session.user.avatar}
                  alt={session.user.name}
                  shape="square"
                  size="large"
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <Link href={"/profile"}>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
      <div className="flex md:hidden">
        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
