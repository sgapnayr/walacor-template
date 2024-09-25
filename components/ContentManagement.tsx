"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/single/Input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@/components/single/Button";
import Textarea from "@/components/single/Textarea";
import usePostSchema from "@/hooks/schema/usePostSchema";
import { useUpdateSchema } from "@/hooks/schema/useUpdateSchema";
import BaseUploadImage from "@/components/BaseUploadImage";
import { BlogData } from "@/schemas/blogSchema";
import { useAuth, useUser } from "@clerk/nextjs";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { successToastStyle, errorToastStyle } from "@/styles/toastStyles";
import { useGetUser } from "@/hooks/user/useGetUser";

interface ContentManagementProps {
  initialBlog?: BlogData | null;
  setEditBlog?: React.Dispatch<React.SetStateAction<BlogData | null>>;
}

const ContentManagement: React.FC<ContentManagementProps> = ({
  initialBlog = null,
  setEditBlog,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const { userId } = useAuth();
  const { user: clerkUser } = useUser();
  const { data: userData, getUser } = useGetUser();

  useEffect(() => {
    if (clerkUser) {
      getUser({ UserName: clerkUser.fullName || clerkUser.id });
    }
  }, [clerkUser, getUser]);

  const initialBlogState: BlogData = {
    id: initialBlog?.id || String(new Date().getTime()),
    userId: userId || "",
    imageSrc: initialBlog?.imageSrc || "",
    imageAlt: initialBlog?.imageAlt || "",
    title: initialBlog?.title || "",
    description: initialBlog?.description || "",
    authorName:
      String(clerkUser?.firstName) + " " + String(clerkUser?.lastName) ||
      String(clerkUser?.fullName) ||
      "Anonymous",
    authorImage: String(clerkUser?.imageUrl) || "/placeholder-user.jpg",
    authorFallback:
      String(clerkUser?.firstName).slice(0, 1).toUpperCase() +
        " " +
        String(clerkUser?.lastName).slice(0, 1).toUpperCase() || "",
    date: initialBlog?.date || today,
    content: initialBlog?.content || "",
    IsDeleted: initialBlog?.IsDeleted || false,
    CreatedAt: initialBlog?.CreatedAt || Date.now(),
    UpdatedAt: initialBlog?.UpdatedAt || Date.now(),
    isPublished: initialBlog?.isPublished || false,
    publishedDate: initialBlog?.publishedDate || null,
    liveVersion: initialBlog?.liveVersion ?? true, // Default to true for new posts, keep current value for existing ones
  };

  const [blog, setBlog] = useState<BlogData>(initialBlogState);

  const {
    postSchema,
    response: postResponse,
    error: postError,
    loading: postLoading,
  } = usePostSchema(Number(process.env.NEXT_PUBLIC_WALACOR_BLOG_ETID));

  const {
    updateRecord,
    response: updateResponse,
    error: updateError,
    loading: updateLoading,
  } = useUpdateSchema(Number(process.env.NEXT_PUBLIC_WALACOR_BLOG_ETID));

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
    setBlog((prevBlog) => ({ ...prevBlog, imageSrc: String(url) }));
  };

  const canPerformActions = () => {
    if (userData && userData.length > 0) {
      const walacorUser = userData[0];
      return (
        walacorUser.UserType === "Author" ||
        walacorUser.UserType === "Site_Admin"
      );
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canPerformActions()) {
      toast.error(
        "You do not have permission to create or edit a blog.",
        errorToastStyle
      );
      return;
    }

    // Ensure liveVersion is only true for new posts, and not when editing existing ones
    const newBlog = {
      ...blog,
      liveVersion: !initialBlog, // Set liveVersion to true only if it's a new blog post
    };

    try {
      if (initialBlog) {
        await updateRecord(newBlog);
        if (setEditBlog) setEditBlog(null);
        toast.success("Blog updated successfully!", successToastStyle);
      } else {
        await postSchema(newBlog);
        toast.success("Blog created successfully!", successToastStyle);

        setBlog(initialBlogState);
      }
    } catch (error) {
      toast.error("Error saving blog", errorToastStyle);
      console.error("Error saving blog:", error);
    }
  };

  const handlePublish = async () => {
    if (!canPerformActions()) {
      toast.error(
        "You do not have permission to publish this blog.",
        errorToastStyle
      );
      return;
    }

    const updatedBlog = {
      ...blog,
      isPublished: true,
      publishedDate: new Date().toISOString(),
      liveVersion: true,
    };
    try {
      if (initialBlog) {
        await updateRecord(updatedBlog);
        if (setEditBlog) setEditBlog(null);
        toast.success("Blog published successfully!", successToastStyle);
      } else {
        await postSchema(updatedBlog);
        toast.success(
          "Blog created and published successfully!",
          successToastStyle
        );

        setBlog(initialBlogState);
      }
    } catch (error) {
      toast.error("Error publishing blog", errorToastStyle);
      console.error("Error publishing blog:", error);
    }
  };

  const handleCancelEdit = () => {
    if (setEditBlog) setEditBlog(null);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className={`${initialBlog ? "" : "mb-6"} text-3xl font-semibold`}>
        {initialBlog ? "" : "Create Blog"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2>Title of Blog</h2>
        <Input
          name="title"
          placeholder="Title"
          value={blog.title}
          onChange={handleChange}
          required
        />
        <h2>Brief Description of Blog</h2>
        <Textarea
          name="description"
          placeholder="Description"
          value={blog.description}
          onChange={handleChange}
          required
        />
        <BaseUploadImage onUpload={handleImageUpload} />

        <h2>Blog Content & Structure</h2>
        <p className="text-xs opacity-50 -my-2 -mt-4">
          (Limited to 500 characters for the description.)
        </p>
        <ReactQuill
          className="bg-white"
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

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className={`bg-primary text-white w-full`}
            disabled={!canPerformActions() || postLoading || updateLoading}
          >
            {postLoading || updateLoading
              ? "Saving..."
              : canPerformActions()
              ? "Save Blog Post"
              : "Insufficient Permissions"}
          </Button>
          <Button
            type="button"
            className="w-full bg-secondary text-secondary-foreground border-2 border-black hover:bg-black hover:text-white transition-all"
            onClick={handlePublish}
            disabled={!canPerformActions() || postLoading || updateLoading}
          >
            {postLoading || updateLoading
              ? "Publishing..."
              : canPerformActions()
              ? "Save & Publish"
              : "Insufficient Permissions"}
          </Button>
          {initialBlog && (
            <Button
              type="button"
              className="w-full bg-none text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="flex justify-between gap-2 w-full">
          <span className="text-xs opacity-50">
            Author:{" "}
            {String(clerkUser?.firstName) + " " + String(clerkUser?.lastName) ||
              "Anonymous"}
          </span>
          <span className="text-xs opacity-50">Date: {formatDate(today)}</span>
        </div>
      </form>
    </div>
  );
};

export default ContentManagement;
