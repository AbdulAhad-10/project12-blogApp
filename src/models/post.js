import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverPhoto: { type: String },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  isPopular: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
});

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;
