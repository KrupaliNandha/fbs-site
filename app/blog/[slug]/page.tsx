import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { blogPosts, getBlogPost } from "@/app/data/blog";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Article | FBS Prints",
    };
  }

  return {
    title: `${post.title} | FBS Prints Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} />;
}
