"use client";

import React, { useState } from "react";
import Input from "@/components/single/Input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@/components/single/Button";
import Textarea from "@/components/single/Textarea";
import DashboardLayout from "@/layout/dashboard.layout";
import usePostSchema from "@/hooks/usePostSchema";
import BaseUploadImage from "@/components/BaseUploadImage"; // Ensure the path is correct

const ContentManagement = () => {
  const [blog, setBlog] = useState({
    id: String(new Date().getTime()),
    userId: "",
    imageSrc: "",
    imageAlt: "",
    title: "",
    description: "",
    authorName: "",
    authorImage: "/placeholder-user.jpg",
    authorFallback: "",
    date: "",
    content: "",
    IsDeleted: false,
  });

  const { postSchema, response, error, loading } = usePostSchema(
    Number(process.env.NEXT_PUBLIC_WALACOR_BLOG_ETID)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setBlog((prevBlog) => ({ ...prevBlog, content }));
  };

  const handleImageUpload = (url: string) => {
    setBlog((prevBlog) => ({ ...prevBlog, imageSrc: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await postSchema(blog);
    } catch (error) {
      console.error("Error creating schema:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="title"
            placeholder="Title"
            value={blog.title}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Description"
            value={blog.description}
            onChange={handleChange}
            required
          />
          <Input
            name="authorName"
            placeholder="Author Name"
            value={blog.authorName}
            onChange={handleChange}
            required
          />
          <Input
            name="authorFallback"
            placeholder="Author Fallback Initials"
            value={blog.authorFallback}
            onChange={handleChange}
            required
          />
          <Input
            name="date"
            type="date"
            placeholder="Publication Date"
            value={blog.date as unknown as string}
            onChange={handleChange}
            required
          />
          <BaseUploadImage onUpload={handleImageUpload} />
          {blog.imageSrc && (
            <div>
              <p>Image URL: {blog.imageSrc}</p>
              <img
                src={blog.imageSrc}
                alt="Uploaded Image"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}
          <Input
            name="imageAlt"
            placeholder="Image Alt Text"
            value={blog.imageAlt}
            onChange={handleChange}
            required
          />
          <ReactQuill
            value={blog.content}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                ["link", "image"],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "align",
              "color",
              "background",
            ]}
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
          >
            {loading ? "Saving..." : "Save Blog Post"}
          </Button>
          {response && <div>Response: {JSON.stringify(response)}</div>}
          {error && <div>Error: {error.message}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
