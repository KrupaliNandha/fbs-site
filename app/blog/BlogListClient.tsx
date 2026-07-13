"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPost, formatBlogDate } from "@/app/data/blog";

type BlogListClientProps = {
  posts: BlogPost[];
};

const BLOG_PAGE_STORAGE_KEY = "blog-list-current-page";
const SCROLL_OFFSET = 120;

const BlogCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
    <div className="h-56 animate-pulse bg-primary-light" />
    <div className="space-y-4 p-6">
      <div className="flex gap-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-primary-light" />
        <div className="h-3 w-16 animate-pulse rounded-full bg-primary-light" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-full animate-pulse rounded-full bg-primary-light" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-primary-light" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-3 w-full animate-pulse rounded-full bg-primary-light/80" />
        <div className="h-3 w-11/12 animate-pulse rounded-full bg-primary-light/80" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-primary-light/80" />
      </div>
      <div className="h-4 w-24 animate-pulse rounded-full bg-primary-light" />
    </div>
  </div>
);

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pageLoadingTimer = useRef<number | null>(null);
  const isFirstRender = useRef(true);
  const shouldScrollOnUpdate = useRef(false);

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const savedPage = Number(window.sessionStorage.getItem(BLOG_PAGE_STORAGE_KEY));
    return Number.isFinite(savedPage) && savedPage > 0 ? savedPage : 1;
  });
  const POSTS_PER_PAGE = 9;

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
  const standardPosts = useMemo(() => filteredPosts.slice(1), [filteredPosts]);
  const totalPages = Math.ceil(standardPosts.length / POSTS_PER_PAGE);
  const normalizedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (normalizedCurrentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = useMemo(() => {
    return standardPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [standardPosts, startIndex]);

  // Helper: scroll the grid section into view, accounting for sticky header offset
  const scrollToGrid = (behavior: ScrollBehavior) => {
    const element = document.getElementById("blog-posts-grid");

    if (!element) {
      return;
    }

    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - SCROLL_OFFSET;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      BLOG_PAGE_STORAGE_KEY,
      String(normalizedCurrentPage),
    );
  }, [normalizedCurrentPage]);

  // Restore scroll position on initial mount (if a saved page > 1 was restored)
  useEffect(() => {
    if (normalizedCurrentPage <= 1) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      scrollToGrid("auto");
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to the grid AFTER the page content has actually re-rendered.
  // This runs on every currentPage/filter change that goes through handlePageChange,
  // (guarded by shouldScrollOnUpdate) so the measured position reflects the new layout,
  // not the stale one from before the click.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!shouldScrollOnUpdate.current) {
      return;
    }

    shouldScrollOnUpdate.current = false;

    // Wait a frame so the DOM has committed the new page's layout before measuring.
    const raf = requestAnimationFrame(() => {
      scrollToGrid("smooth");
    });

    return () => cancelAnimationFrame(raf);
  }, [normalizedCurrentPage]);

  useEffect(() => {
    return () => {
      if (pageLoadingTimer.current) {
        window.clearTimeout(pageLoadingTimer.current);
      }
    };
  }, []);

  const handlePageChange = (page: number) => {
    if (page === normalizedCurrentPage || page < 1 || page > totalPages) {
      return;
    }

    if (pageLoadingTimer.current) {
      window.clearTimeout(pageLoadingTimer.current);
    }

    shouldScrollOnUpdate.current = true;
    setIsPageLoading(true);
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    pageLoadingTimer.current = window.setTimeout(() => {
      setIsPageLoading(false);
      pageLoadingTimer.current = null;
    }, 350);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, normalizedCurrentPage - 1);
      let end = Math.min(totalPages - 1, normalizedCurrentPage + 1);

      if (normalizedCurrentPage <= 3) {
        end = 4;
      } else if (normalizedCurrentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <main className="bg-primary-light/40 min-h-screen">
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-white to-primary-light">
        <div className="container">
          <p className="text-primary-dark/70 text-lg">
            <Link href="/" className="text-primary">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-primary-dark font-semibold">Blog</span>
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-10 xl:mt-0 items-center">
            <div className="flex flex-col justify-center text-center lg:text-left space-y-5">
              <h1 className="font-semibold text-primary-dark leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Marketing &amp; Design
                <span className="text-primary"> Insights</span>
              </h1>
              <p className="text-primary-dark/70 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Practical printing, signage, decor, and branding ideas for
                businesses that want cleaner visuals and stronger customer impact.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light rounded-full hidden md:block opacity-50 blur-2xl" />
              <div className="absolute bottom-20 -left-10 w-60 h-60 bg-primary-light rounded-full hidden md:block opacity-50 blur-3xl" />
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

      <section className="container section-padding" id="blog-posts-grid">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center gap-5 justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                  setIsPageLoading(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-primary-light/70 text-primary-dark/80 hover:bg-primary-light hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/45" />
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
                setIsPageLoading(false);
              }}
              className="w-full pl-11 pr-4 py-3 bg-primary-light/40 border border-primary-light rounded-full focus:outline-none focus:border-primary text-sm font-medium text-primary-dark"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-primary-dark">
              No articles match your search
            </h2>
            <p className="text-primary-dark/70 mt-3">
              Try a broader keyword or reset the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setCurrentPage(1);
                setIsPageLoading(false);
              }}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-white font-bold"
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
                <div className="lg:col-span-7 h-64 sm:h-72 lg:h-[420px] relative bg-primary-dark overflow-hidden">
                  {featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <span className="absolute top-4 left-4 bg-primary text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-primary-dark/60">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {formatBlogDate(featuredPost.date)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark group-hover:text-primary transition line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    <p className="text-primary-dark/70 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary font-bold">
                    Read Article
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {isPageLoading ? (
                Array.from({ length: POSTS_PER_PAGE }, (_, index) => (
                  <BlogCardSkeleton key={`blog-card-skeleton-${index}`} />
                ))
              ) : (
                paginatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition flex flex-col"
                >
                  <div className="h-56 relative bg-primary-dark overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <span className="absolute top-3 left-3 bg-white text-primary font-bold text-xs px-3 py-1.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-primary-dark/60">
                      <span>{formatBlogDate(post.date)}</span>
                      <span>|</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-primary-dark group-hover:text-primary transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-primary-dark/70 text-sm leading-relaxed line-clamp-3 grow">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-primary font-bold text-sm">
                      Read More
                      <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 border-t border-primary-light pt-8">
                <div className="flex items-center justify-between gap-3 sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(normalizedCurrentPage - 1, 1))}
                    disabled={normalizedCurrentPage === 1}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-light bg-white text-primary-dark/80 transition duration-300 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="min-w-0 rounded-full bg-white px-5 py-2 text-center text-sm font-bold text-primary-dark shadow-sm">
                    Page {normalizedCurrentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(normalizedCurrentPage + 1, totalPages))}
                    disabled={normalizedCurrentPage === totalPages}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-light bg-white text-primary-dark/80 transition duration-300 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="hidden justify-center items-center gap-2 sm:flex">
                  <button
                    onClick={() => handlePageChange(Math.max(normalizedCurrentPage - 1, 1))}
                    disabled={normalizedCurrentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-primary-dark/45">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition duration-300 flex items-center justify-center ${
                          normalizedCurrentPage === page
                            ? "bg-primary text-white shadow-md shadow-primary-light"
                            : "border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(normalizedCurrentPage + 1, totalPages))}
                    disabled={normalizedCurrentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-primary-light bg-white text-primary-dark/80 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}