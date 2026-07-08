"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Heart,
  MessageSquare,
} from "lucide-react";
import {
  BlogPost,
  formatBlogDate,
  getRelatedPosts,
} from "@/app/data/blog";

type BlogDetailClientProps = {
  post: BlogPost;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      name: "Local Business Owner",
      date: "Today",
      text: "Helpful direction for planning a cleaner print and branding project.",
    },
  ]);

  const relatedPosts = getRelatedPosts(post);
  const headings = post.content.filter((section) => section.type === "heading");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setComments([
      {
        name: commentName.trim(),
        date: "Just now",
        text: commentText.trim(),
      },
      ...comments,
    ]);
    setCommentName("");
    setCommentText("");
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
        <div className="container">
          <p className="text-gray-600 text-lg flex flex-wrap items-center">
            <Link href="/" className="text-pink-600">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="text-pink-600">
              Blog
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800 font-semibold">Article</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col justify-center text-center lg:text-left space-y-5">
              <span className="inline-flex bg-pink-100 text-pink-700 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest w-fit mx-auto lg:mx-0">
                {post.category}
              </span>
              <h1 className="font-semibold text-gray-950 leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-700" />
                  {formatBlogDate(post.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-700" />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl" />
              <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-padding">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-pink-700 font-bold bg-white px-5 py-3 rounded-full shadow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px] gap-10 xl:gap-12 mt-10 overflow-visible">
          <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg min-w-0">
            <div className="flex flex-col sm:flex-row justify-between gap-5 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-contain bg-white border border-pink-100"
                />
                <div>
                  <p className="font-bold text-gray-950">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                    liked
                      ? "bg-pink-100 text-pink-700"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Share"}
                </button>
              </div>
            </div>

            <div className="pt-8 space-y-6">
              {post.content.map((section, index) => {
                if (section.type === "paragraph") {
                  return (
                    <p
                      key={index}
                      className="text-gray-700 text-base sm:text-lg leading-relaxed"
                    >
                      {section.content}
                    </p>
                  );
                }

                if (section.type === "heading") {
                  const id = slugify(section.content);
                  const Heading = section.level === 3 ? "h3" : "h2";
                  return (
                    <Heading
                      key={index}
                      id={id}
                      className={`font-bold text-gray-950 scroll-mt-32 ${
                        section.level === 3
                          ? "text-2xl mt-8"
                          : "text-3xl mt-10 border-b border-gray-100 pb-3"
                      }`}
                    >
                      {section.content}
                    </Heading>
                  );
                }

                if (section.type === "list") {
                  return (
                    <ul key={index} className="space-y-3">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-gray-700 leading-relaxed"
                        >
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-pink-700 bg-pink-50 rounded-r-2xl p-5 text-gray-800 font-medium italic"
                  >
                    {section.content}
                  </blockquote>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 bg-gray-50 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-700">
                Author Biography
              </p>
              <h2 className="text-xl font-bold text-gray-950 mt-2">
                {post.author.name}
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">{post.author.bio}</p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-pink-700" />
                Discussion ({comments.length})
              </h2>
              <form
                onSubmit={handleComment}
                className="mt-6 bg-gray-50 rounded-2xl p-5 sm:p-6 space-y-4"
              >
                <input
                  required
                  value={commentName}
                  onChange={(event) => setCommentName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-pink-700"
                />
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Write a comment..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-pink-700"
                />
                <button className="rounded-full bg-pink-700 px-6 py-3 text-white font-bold">
                  Post Comment
                </button>
              </form>
              <div className="mt-6 space-y-4">
                {comments.map((comment, index) => (
                  <div key={`${comment.name}-${index}`} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-bold text-gray-950">{comment.name}</span>
                      <span className="text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-600 mt-2 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="min-w-0">
            <div className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-1 space-y-8">
              {headings.length > 0 && (
                <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-3">
                    Table of Contents
                  </h2>
                  <nav className="mt-4 space-y-3">
                    {headings.map((section) => (
                      <a
                        key={section.content}
                        href={`#${slugify(section.content)}`}
                        className="flex items-start gap-2 text-sm text-gray-600 hover:text-pink-700 font-semibold transition"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-pink-200" />
                        <span className="leading-relaxed">{section.content}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-pink-700 rounded-2xl p-7 text-white shadow-lg">
                <p className="text-sm font-bold uppercase tracking-widest text-pink-100">
                  Start a Project
                </p>
                <h2 className="text-2xl font-bold mt-3">
                  Need help with {post.category}?
                </h2>
                <p className="text-pink-50 mt-3 leading-relaxed">
                  Talk with FBS Prints about materials, sizing, timelines, and a
                  clean quote for your next project.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-pink-700 font-bold"
                >
                  Request a Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-end">
            <h2 className="text-3xl font-bold text-gray-950">
              Related Articles
            </h2>
            <Link href="/blog" className="text-pink-700 font-bold">
              View All Articles
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition grid sm:grid-cols-5"
              >
                <div className="sm:col-span-2 h-52 sm:h-auto bg-gray-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:col-span-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-700">
                    {related.category}
                  </p>
                  <h3 className="text-xl font-bold text-gray-950 group-hover:text-pink-700 transition mt-3">
                    {related.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-4">
                    {formatBlogDate(related.date)} | {related.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
