// app/api/user/[userId].js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(request, { params }) {
  await connectMongoDB();

  const { userId } = params;

  try {
    const posts = await Post.find({ author: userId }).populate(
      "author",
      "name"
    );
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
