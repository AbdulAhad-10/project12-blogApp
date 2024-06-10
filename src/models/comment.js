import mongoose, { Schema, models } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Comment = models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
