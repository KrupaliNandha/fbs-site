import type { Metadata } from "next";
import BlogListClient from "@/app/blog/BlogListClient";
import { blogPosts } from "@/app/data/blog";

export const metadata: Metadata = {
  title: "Blog | FBS Prints",
  description:
    "Read FBS Prints articles about printing, signage, decor, branding, and marketing ideas.",
};

export default function BlogPage() {
  return <BlogListClient posts={blogPosts} />;
}
