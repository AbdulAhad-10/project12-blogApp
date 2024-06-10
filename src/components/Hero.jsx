"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel } from "antd";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const Hero = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        const featured = data.filter((post) => post.isFeatured);
        setFeaturedPosts(featured);
      } catch (error) {
        console.error("Error fetching featured posts:", error);
      }
    };
    fetchFeaturedPosts();
  }, []);

  return (
    <header className="flex flex-col items-center gap-5 py-10">
      <h1 className="text-4xl font-bold">Featured</h1>
      <div className="w-full md:px-24">
        <Carousel className="crsl" autoplay>
          {featuredPosts.map((post) => (
            <Link href={`blogs/${post._id}`} key={post._id}>
              <Card>
                <div className="flex flex-col items-center md:flex-row">
                  <CardHeader>
                    <Image
                      src={post.coverPhoto}
                      alt={post.title}
                      className="object-cover w-screen h-80 md:w-96 md:h-96"
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
                    <CardFooter className="flex items-center mt-4">
                      <Image
                        src={post.author.avatar}
                        alt="Author"
                        className="w-12 h-12 mr-4 rounded-full"
                        width={20}
                        height={20}
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {post.author.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {post.author.title}
                        </div>
                      </div>
                    </CardFooter>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </Carousel>
      </div>
    </header>
  );
};

export default Hero;
