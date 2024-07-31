"use client";

import { useParams } from "next/navigation";
import { blogData } from "../../../data/blogData";
import BaseMoreStories from "@/components/BaseMoreStories";
import BaseBlog from "@/components/BaseBlog";
import BlogLayout from "@/layout/blog.layout";
import Link from "next/link";

const BlogPost = () => {
  const params = useParams();
  const blogId = String(params && params.blogId);

  const blog = blogData.find((blog) => blog.id === blogId);

  if (!blog) {
    return (
      <BlogLayout>
        <div className="w-full text-center flex flex-col justify-center items-center gap-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, the blog post you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Go to Homepage
          </Link>
          <Link
            href="/read-the-blog"
            className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-muted/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mt-4"
            prefetch={false}
          >
            View All Blogs
          </Link>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <BaseBlog
        title={blog.title}
        description={blog.description}
        imageSrc={blog.imageSrc}
        imageAlt={blog.imageAlt}
        content={blog.content}
        authorName={blog.authorName}
        date={blog.date}
      />
      <BaseMoreStories currentBlogId={blogId} />
    </BlogLayout>
  );
};

export default BlogPost;
