"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
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

const extractLocation = (post: BlogPost) => {
  const contentText = post.content
    .map((section) => {
      if ("content" in section) {
        return section.content;
      }

      return section.items.join(" ");
    })
    .join(" ");
  const sourceText = `${post.title} ${contentText}`;
  const match = sourceText.match(/in ([A-Z][a-zA-Z\s.-]+,\s?[A-Z]{2})/);

  return match?.[1] ?? "Illinois";
};

const getKeyTakeaways = (post: BlogPost) => {
  const firstList = post.content.find((section) => section.type === "list");

  if (firstList?.type === "list" && firstList.items.length > 0) {
    return firstList.items.slice(0, 4);
  }

  return post.content
    .filter((section) => section.type === "heading")
    .slice(0, 3)
    .map((section) => section.content);
};

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const relatedPosts = getRelatedPosts(post);
  const headings = post.content.filter((section) => section.type === "heading");
  const keyTakeaways = getKeyTakeaways(post);
  const locationFocus = extractLocation(post);
  const backToBlogHref = "/blog";
  const relatedServiceHref =
    post.category.toLowerCase() === "seo"
      ? "/services/seo"
      : post.category.toLowerCase() === "web design"
        ? "/services/web-design"
        : post.category.toLowerCase() === "direct mailing"
          ? "/services/direct-mailing"
          : "/services/signage";

  return (
    <main className="bg-primary-light/40 min-h-screen">
      <section className="bg-gradient-to-br mt-24 xl:mt-20 from-white to-primary-light">
        <div className="container">
          <p className="text-primary-dark/70 text-lg flex flex-wrap items-center">
            <Link href="/" className="text-primary">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="text-primary">
              Blog
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-primary-dark font-semibold">Article</span>
          </p>

          <div className="grid mt-5 xl:mt-0 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col justify-center text-center lg:text-left space-y-5">
              <span className="inline-flex bg-primary-light text-primary font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest w-fit mx-auto lg:mx-0">
                {post.category}
              </span>
              <h1 className="font-semibold text-primary-dark leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-primary-dark/70">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {formatBlogDate(post.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light rounded-full opacity-50 blur-2xl" />
              <div className="absolute bottom-20 -left-10 w-60 h-60 bg-primary-light rounded-full opacity-50 blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-primary-dark shadow-2xl">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px] gap-10 xl:gap-12 overflow-visible">
          <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg min-w-0">
            <div className="flex flex-col sm:flex-row justify-between gap-5 pb-8 border-b border-primary-light">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-18 h-18 object-contain bg-white border border-primary-light"
                />
                <div>
                  <p className="font-bold text-primary-dark">{post.author.name}</p>
                  <p className="text-sm text-primary-dark/60">{post.author.role}</p>
                </div>
              </div>
            </div>

            <div className="sm:pt-8 space-y-6">
              {post.content.map((section, index) => {
                if (section.type === "paragraph") {
                  return (
                    <p
                      key={index}
                      className="text-primary-dark/80 text-base sm:text-lg leading-relaxed"
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
                      className={`font-bold text-primary-dark scroll-mt-32 ${
                        section.level === 3
                          ? "text-2xl sm:mt-8"
                          : "text-3xl sm:mt-10 border-b border-primary-light pb-3"
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
                          className="flex items-start gap-3 text-primary-dark/80 leading-relaxed"
                        >
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
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
                    className="border-l-4 border-primary bg-primary-light rounded-r-2xl p-5 text-primary-dark font-medium italic"
                  >
                    {section.content}
                  </blockquote>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-primary-light bg-primary-light/40 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Author Biography
              </p>
              <h2 className="text-xl font-bold text-primary-dark mt-2">
                {post.author.name}
              </h2>
              <p className="text-primary-dark/70 mt-2 leading-relaxed">{post.author.bio}</p>
            </div>

            <div className="mt-8 rounded-2xl bg-primary p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-light">
                Next Step
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Need help applying this to your business?
              </h2>
              <p className="mt-3 text-primary-light leading-relaxed">
                Explore the related service page for a deeper breakdown, then contact our team for a quote or project guidance.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={relatedServiceHref}
                  className="inline-flex text-[12px] sm:text-[16px] items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-primary"
                >
                  Explore More
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex justify-center text-[12px] sm:text-[16px] items-center gap-2 rounded-full border border-primary-light px-5 py-3 font-bold text-white"
                >
                  Contact FBS Prints
                </Link>
              </div>
            </div>

          </article>

          <aside className="min-w-0">
            <div className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-15rem)] lg:overflow-y-auto lg:pr-1 space-y-8">
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-light">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary-dark border-b border-primary-light pb-3">
                    Table of Contents
                  </h2>
                  <nav className="mt-4 space-y-3">
                    {headings.map((section) => (
                      <a
                        key={section.content}
                        href={`#${slugify(section.content)}`}
                        className="flex items-start gap-2 text-sm text-primary-dark/70 hover:text-primary font-semibold transition"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-primary-light" />
                        <span className="leading-relaxed">{section.content}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-light">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary-dark border-b border-primary-light pb-3">
                  Quick Answer
                </h2>
                <p className="mt-4 text-sm leading-7 text-primary-dark/75">
                  {post.excerpt}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-light">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary-dark border-b border-primary-light pb-3">
                  Article Snapshot
                </h2>
                <div className="mt-4 space-y-4 text-sm text-primary-dark/75">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Category
                    </p>
                    <p className="mt-1 font-semibold text-primary-dark">{post.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Location Focus
                    </p>
                    <p className="mt-1 font-semibold text-primary-dark">{locationFocus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Best For
                    </p>
                    <p className="mt-1 font-semibold text-primary-dark">
                      Businesses improving visibility, trust, and local lead generation
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl bg-primary-light/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Published
                      </p>
                      <p className="mt-2 text-sm font-semibold text-primary-dark">
                        {formatBlogDate(post.date)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary-light/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Read Time
                      </p>
                      <p className="mt-2 text-sm font-semibold text-primary-dark">
                        {post.readTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {keyTakeaways.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-light">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary-dark border-b border-primary-light pb-3">
                    Key Takeaways
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {keyTakeaways.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-primary-dark/80"
                      >
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-14 pt-10 border-t border-primary-light">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-end">
            <h2 className="text-3xl font-bold text-primary-dark">
              Related Articles
            </h2>
            <Link href={backToBlogHref} className="text-primary font-bold flex 
            items-center gap-1 hover:gap-2 transition">
              View All Articles 
              <ArrowRight className="w-4 h-4 inline-block ml-1 " />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition grid sm:grid-cols-1"
              >
                <div className="h-52 sm:h-62 bg-primary-dark overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {related.image ? (
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                </div>
                <div className="sm:col-span-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {related.category}
                  </p>
                  <h3 className="text-xl font-bold text-primary-dark group-hover:text-primary transition mt-3">
                    {related.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-primary-dark/70">
                    {related.excerpt}
                  </p>
                  <p className="text-primary-dark/60 text-sm mt-auto pt-4">
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
