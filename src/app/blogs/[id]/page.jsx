"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import CommentComponent from "@/components/CommentComponent";

const BlogDetailsPage = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the blog post");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-5 md:px-20">
      <Card>
        <div className="flex flex-col">
          <CardHeader>
            <Image
              src={post.coverPhoto}
              alt="Cover"
              className="object-cover w-screen h-80 md:w-screen md:h-96"
              width={1920}
              height={1080}
              unoptimized
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="px-5 mb-4">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-black">{post.category}</span> —{" "}
                {new Date(post.dateCreated).toLocaleDateString()}
              </div>
              <CardTitle className="text-2xl font-bold ">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-2 text-gray-700 ">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardDescription>
            </div>
            <CardFooter className="flex items-center mt-4">
              <Image
                src={post.author.avatar || "/default-profile.png"}
                alt="Author"
                className="w-12 h-12 mr-4 rounded-full"
                width={48}
                height={48}
              />
              <div>
                <div className="text-sm font-medium">{post.author.name}</div>
                <div className="text-xs text-gray-500">{post.author.title}</div>
              </div>
            </CardFooter>
          </CardContent>
        </div>
      </Card>
      <CommentComponent postId={id} />
    </div>
  );
};

export default BlogDetailsPage;
