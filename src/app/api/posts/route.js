import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";

// GET all posts
export async function GET() {
  await connectMongoDB();

  try {
    const posts = await Post.find()
      .populate("author", "name title avatar")
      .sort({ dateCreated: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new post
export async function POST(request) {
  await connectMongoDB();

  try {
    const data = await request.json();
    const {
      title,
      content,
      category,
      authorId,
      coverPhoto,
      isPopular,
      isFeatured,
    } = data;
    console.log("Request data:", data); // Log the incoming data

    const newPost = new Post({
      title,
      content,
      category,
      author: authorId,
      coverPhoto,
      isPopular,
      isFeatured,
    });

    const savedPost = await newPost.save();
    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
