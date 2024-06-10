"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Form, Button, List, Input, message } from "antd";
import { useSession } from "next-auth/react";

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <div className="mb-4">
    <h3 className="mb-2 text-lg font-bold">
      {comments.length} {comments.length > 1 ? "replies" : "reply"}
    </h3>
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(comment) => (
        <List.Item className="py-2">
          <List.Item.Meta
            avatar={<Avatar src={comment.avatar} className="bg-blue-500" />}
            title={<span className="font-bold">{comment.author}</span>}
            description={<span>{comment.content}</span>}
          />
          <div className="text-sm text-gray-500">{comment.datetime}</div>
        </List.Item>
      )}
    />
  </div>
);

const Editor = ({ onChange, onSubmit, submitting, value, disabled }) => (
  <Form onFinish={onSubmit}>
    <Form.Item>
      <TextArea
        rows={4}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        type="primary"
        className="text-white bg-blue-500 hover:bg-blue-600"
        disabled={disabled}
      >
        Add Comment
      </Button>
    </Form.Item>
  </Form>
);

const formatDateTime = (dateTime) => {
  const now = new Date();
  const time = new Date(dateTime);
  const diff = now.getTime() - time.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const formattedDate = time.toLocaleDateString();
    const formattedTime = time.toLocaleTimeString();
    return `${formattedDate} at ${formattedTime}`;
  }
};

const CommentComponent = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        const formattedComments = data.map((comment) => ({
          author: comment.user.name,
          avatar: comment.user.avatar,
          content: comment.content,
          datetime: formatDateTime(comment.dateCreated),
        }));
        setComments(formattedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!value) return;

    if (!session) {
      message.error("Please log in to add a comment.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: value,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();

      setComments([
        ...comments,
        {
          author: session.user.name,
          avatar: session.user.avatar,
          content: newComment.content,
          datetime: formatDateTime(newComment.dateCreated),
        },
      ]);

      setValue("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      {comments.length > 0 && <CommentList comments={comments} />}
      <Editor
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        value={value}
        disabled={!session}
      />
    </div>
  );
};

export default CommentComponent;
