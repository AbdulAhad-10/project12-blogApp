"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setRecentPosts(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Recent Posts</h1>
      <div className="flex flex-col gap-3">
        {recentPosts.map((post) => (
          <Link href={`blogs/${post._id}`} key={post._id}>
            <Card>
              <div className="flex flex-col items-center md:flex-row md:max-w-6xl">
                <CardHeader>
                  <Image
                    src={post.coverPhoto}
                    alt={post.title}
                    className="object-cover w-screen md:w-52 h-52"
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
    </section>
  );
};

export default RecentPosts;
