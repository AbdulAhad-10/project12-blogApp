"use client";

import { useState } from "react";
import { Avatar, Drawer } from "antd";
import Link from "next/link";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";

const MobileNavbar = () => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <MenuOutlined className="cursor-pointer" onClick={showDrawer} />
      <Drawer onClose={onClose} open={open}>
        <div className="flex flex-col items-center justify-center gap-10">
          <Link href={"/blogs"}>Blogs</Link>
          <Link href={"write"}>Write</Link>
          {session ? (
            <div className="flex flex-col items-center gap-10">
              <button onClick={() => signOut()}>Logout</button>
              <Link href={"/profile"} className="mx-10">
                <Avatar
                  src={session.user.avatar}
                  alt={session.user.name}
                  shape="square"
                  size="large"
                  icon={<UserOutlined />}
                />
              </Link>
            </div>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default MobileNavbar;
