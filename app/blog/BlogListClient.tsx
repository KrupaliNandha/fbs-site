"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Clock, Search, Newspaper } from "lucide-react";
import { BlogPost, formatBlogDate } from "@/app/data/blog";

type BlogListClientProps = {
  posts: BlogPost[];
};

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = new Set(posts.map((post) => post.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const standardPosts = filteredPosts.slice(1);

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-gray-50 to-blue-50">
        <div className="container">
          <p className="text-gray-600 text-lg">
            <Link href="/" className="text-pink-600">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800 font-semibold">Blog</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col justify-center text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest w-fit mx-auto lg:mx-0">
                <Newspaper className="w-4 h-4" />
                FBS Blog
              </div>
              <h1 className="font-semibold text-gray-950 leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Marketing &amp; Design
                <span className="text-pink-700"> Insights</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Practical printing, signage, decor, and branding ideas for
                businesses that want cleaner visuals and stronger customer impact.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-2xl" />
              <div className="absolute bottom-20 -left-10 w-60 h-60 bg-pink-100 rounded-full opacity-50 blur-3xl" />
              <div className="relative grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  "/images/shared/Product-1.jpg",
                  "/images/shared/website-design-showcase.webp",
                  "/images/services/printing/printing-products-service.webp",
                ].map((src, index) => (
                  <div
                    key={src}
                    className={`rounded-2xl aspect-square overflow-hidden relative ${
                      index === 1 ? "sm:mt-28 float-2" : "sm:mt-12 float-1"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="FBS Prints blog visual"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-padding">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center gap-5 justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-pink-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-600 text-sm font-medium text-gray-900"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-950">
              No articles match your search
            </h2>
            <p className="text-gray-600 mt-3">
              Try a broader keyword or reset the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 rounded-full bg-pink-700 px-6 py-3 text-white font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-10 mt-10">
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition"
              >
                <div className="lg:col-span-7 h-64 sm:h-72 lg:h-[420px] relative bg-gray-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-pink-700 text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-700" />
                        {formatBlogDate(featuredPost.date)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-700" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 group-hover:text-pink-700 transition line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-pink-50 text-pink-700 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-pink-700 font-bold">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {standardPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition flex flex-col"
                >
                  <div className="h-56 relative bg-gray-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-white text-pink-700 font-bold text-xs px-3 py-1.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                      <span>{formatBlogDate(post.date)}</span>
                      <span>|</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-gray-950 group-hover:text-pink-700 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3 grow">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-pink-700 font-bold text-sm">
                      Read More
                      <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
