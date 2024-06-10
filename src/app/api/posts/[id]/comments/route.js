import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Comment from "@/models/comment";
import Post from "@/models/post";
import User from "@/models/user";

// POST a new comment to a specific post
export async function POST(request, { params }) {
  await connectMongoDB();

  const { id } = params;
  const { content, userId } = await request.json();

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newComment = await Comment.create({
      content,
      post: id,
      user: userId,
    });

    post.comments.push(newComment._id);
    await post.save();

    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET comments for a specific post
export async function GET(request, { params }) {
  await connectMongoDB();

  const { id } = params;

  try {
    const comments = await Comment.find({ post: id }).populate(
      "user",
      "name avatar"
    );

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
