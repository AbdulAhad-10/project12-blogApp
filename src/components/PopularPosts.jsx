"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        // Filter popular posts and take the first 5
        const popular = data.filter((post) => post.isPopular).slice(0, 5);
        setPopularPosts(popular);
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      }
    };
    fetchPopularPosts();
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Most Popular</h1>
      <div className="flex flex-col gap-3">
        {popularPosts.map((post) => (
          <Link
            href={`blogs/${post._id}`}
            key={post._id}
            className="md:min-w-72"
          >
            <Card>
              <CardContent className="px-6 py-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-500">
                    <span className="px-1 font-bold text-black rounded-md bg-sky-200">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold ">
                    {post.title}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    {new Date(post.dateCreated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularPosts;
