"use client";

import React, { useEffect, useState } from "react";
import { Layout, Pagination, Row } from "antd";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { categories } from "@/constants/data";

const { Sider, Content } = Layout;

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
};

const siderStyle = {
  textAlign: "left",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1e88e5",
  padding: "16px",
  borderRight: "1px solid #e0e0e0",
};

const BlogsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState({ name: "All" });
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleCategorySelect = (category, event) => {
    event.preventDefault();
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to the first page when changing category
  };

  const filteredPosts =
    selectedCategory.name.toLowerCase() === "all"
      ? posts
      : posts.filter(
          (post) =>
            post.category.toLowerCase() === selectedCategory.name.toLowerCase()
        );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout className="flex flex-col md:flex-row">
      <Sider width="15%" style={siderStyle} className="hidden md:block">
        <div className="flex flex-col gap-5">
          <Link
            href={"/"}
            key={"all"}
            className="text-lg text-white hover:text-gray-300"
            onClick={(event) => handleCategorySelect({ name: "All" }, event)}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              href={"/"}
              key={cat.id}
              className="text-lg text-white hover:text-gray-300"
              onClick={(event) => handleCategorySelect(cat, event)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </Sider>
      <Content style={contentStyle} className="p-5 bg-slate-200">
        <div className="flex flex-wrap gap-4 p-4 mb-5 bg-blue-600 rounded-lg shadow-md md:hidden">
          <button
            key={"all"}
            className={`px-4 py-2 text-lg font-semibold rounded-lg ${
              selectedCategory.name === "All"
                ? "bg-white text-blue-600"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
            onClick={(event) => handleCategorySelect({ name: "All" }, event)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 text-lg font-semibold rounded-lg ${
                selectedCategory.name === cat.name
                  ? "bg-white text-blue-600"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
              onClick={(event) => handleCategorySelect(cat, event)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <Row className="flex flex-wrap gap-5 md:grid md:grid-cols-3">
          {currentPosts.map((post) => (
            <Link href={`blogs/${post._id}`} key={post._id}>
              <Card className="flex flex-col h-full">
                <div className="flex flex-col items-center flex-grow">
                  <CardHeader>
                    <Image
                      src={post.coverPhoto}
                      alt={post.title}
                      className="object-cover w-screen h-52"
                      width={500}
                      height={500}
                      unoptimized
                    />
                  </CardHeader>
                  <CardContent className="flex-grow p-2">
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-bold text-black">
                          {post.category}
                        </span>{" "}
                        — {new Date(post.dateCreated).toLocaleDateString()}
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {post.title}
                      </CardTitle>
                    </div>
                  </CardContent>
                </div>
                <CardFooter className="flex justify-center mt-auto">
                  <Image
                    src={post.author.avatar}
                    alt="Author"
                    className="w-12 h-12 mr-4 rounded-full"
                    width={20}
                    height={20}
                  />
                  <div className="flex flex-col">
                    <div className="self-start text-sm font-medium">
                      {post.author.name}
                    </div>
                    <div className="self-start text-xs text-gray-500">
                      {post.author.title}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </Row>
        <Pagination
          defaultCurrent={1}
          total={filteredPosts.length}
          current={currentPage}
          pageSize={postsPerPage}
          onChange={handlePagination}
          className="my-10"
        />
      </Content>
    </Layout>
  );
};

export default BlogsPage;
