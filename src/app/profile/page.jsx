"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, Typography, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (session) {
        const response = await fetch(`/api/user/${session.user.id}`);
        const data = await response.json();
        setPosts(data);
      }
    };

    fetchPosts();
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container px-5 py-10 mx-auto md:px-20">
      <div className="flex flex-col items-center justify-center mb-8 md:flex-row">
        <Avatar size={96} className="mb-4 md:mb-0 md:mr-8">
          <Image
            src={session.user.avatar}
            alt={session.user.name}
            width={96}
            height={96}
            className="rounded-full"
          />
        </Avatar>
        <div>
          <Title level={3}>{session.user.name}</Title>
          <Text>{session.user.title}</Text>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col md:flex-row md:flex-wrap">
        {posts.map((post) => (
          <Link
            href={`/blogs/${post._id}`}
            key={post._id}
            className="w-full p-4 md:w-1/2"
          >
            <Card key={post._id}>
              <div className="flex flex-col md:items-center md:flex-row ">
                <CardHeader>
                  <Image
                    src={post.coverPhoto}
                    alt={post.title}
                    className="object-cover w-screen h-52 md:w-60 md:h-60"
                    width={500}
                    height={500}
                    unoptimized
                  />
                </CardHeader>
                <CardContent className="p-6 md:w-1/2">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-bold text-black">
                        {post.category}
                      </span>{" "}
                      — {new Date(post.dateCreated).toLocaleDateString()}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {post.title}
                    </CardTitle>
                    <CardDescription
                      className={`mt-2 text-gray-700 card-description`}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
