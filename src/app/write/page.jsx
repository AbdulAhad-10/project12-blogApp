"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Editor } from "@tinymce/tinymce-react";
import { UploadButton } from "@/utils/uploadthing";
import { Modal, notification } from "antd";
import "antd/dist/reset.css";

const WritePage = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      notification.error({
        message: "Authentication Error",
        description: "You must be logged in to create a post",
      });
      return;
    }

    const authorId = session.user.id;
    const postData = {
      title,
      content,
      category,
      authorId,
      coverPhoto: cover,
      isPopular,
      isFeatured,
    };
    console.log(postData);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const data = await response.json();
      console.log("Post created successfully:", data);
      setModalVisible(true);
      setTitle("");
      setCover("");
      setIsPopular(false);
      setIsFeatured(false);
      setCategory("");
      setContent("");
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error creating post:", error);
      notification.error({
        message: "Post Creation Error",
        description: `Failed to create post: ${error.message}`,
      });
    }
  };

  return (
    <div className="min-h-screen px-5 py-10 bg-gray-50 md:px-20">
      <form
        className="flex flex-col max-w-3xl gap-6 p-6 mx-auto bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold text-gray-700">Title</span>
          <input
            type="text"
            className="p-2 text-lg border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-lg">
          <span className="text-xl font-semibold text-gray-700">
            Upload a Photo
          </span>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              notification.success({
                message: "Upload Completed",
                description: "Your image has been uploaded successfully.",
              });
              setCover(res[0].url);
            }}
            onUploadError={(error) => {
              notification.error({
                message: "Upload Error",
                description: `ERROR! ${error.message}`,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold text-gray-700">Options</span>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2 text-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-5 h-5 text-blue-600 form-checkbox"
              />
              <span>Popular</span>
            </label>
            <label className="flex items-center space-x-2 text-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-blue-600 form-checkbox"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xl font-semibold text-gray-700">Category</span>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              "technology",
              "lifestyle",
              "health",
              "food",
              "sports",
              "education",
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 text-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-5 h-5 text-blue-600 form-radio"
                />
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4 border border-gray-300 rounded-lg">
          <span className="text-xl font-semibold text-gray-700">Content</span>
          <Editor
            key={editorKey}
            apiKey="yobz5ehhevdbo6fph07ndgdz3brvmmafdocgrdxe9918mjfx"
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
            }}
            initialValue="Create Your Blog..."
            onEditorChange={handleEditorChange}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full py-4 text-lg font-bold text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105"
        >
          Create Blog
        </button>
      </form>
      <Modal
        title={
          <span className="text-2xl font-bold text-green-600">Success!</span>
        }
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Great!"
        okButtonProps={{ className: "bg-green-500 hover:bg-green-600" }}
      >
        <p className="text-lg text-gray-700">
          Your post has been created successfully!
        </p>
      </Modal>
    </div>
  );
};

export default WritePage;
