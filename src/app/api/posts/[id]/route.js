import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";

// GET a single post by ID
export async function GET(request, { params }) {
  await connectMongoDB();

  const { id } = params;

  try {
    const post = await Post.findById(id).populate(
      "author",
      "name title avatar"
    );
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
