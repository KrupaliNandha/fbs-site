import blogData from "@/blog_data.json";

export type BlogDataItem = {
  id: number;
  slug: string;
  title: string;
  url?: string;
  date: string;
  category: string;
  image: string;
};

export type BlogPost = BlogDataItem & {
  excerpt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  content: BlogContentSection[];
};

export type BlogContentSection =
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "blockquote"; content: string };

const author = {
  name: "FBS Prints Team",
  role: "Printing & Branding Specialists",
  avatar: "/images/brand/fbs-prints-logo.webp",
  bio: "The FBS Prints team helps businesses plan practical print, signage, direct mail, web design, and SEO projects with a focus on clean execution and dependable service.",
};

const cleanCategory = (category: string) =>
  category
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const createExcerpt = (post: BlogDataItem) =>
  `Explore practical ideas from FBS Prints for ${post.title.toLowerCase()}. Use this guide to plan better print, decor, branding, and marketing decisions with confidence.`;

const createTags = (post: BlogDataItem) => {
  const words = post.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return Array.from(new Set([post.category, ...words])).slice(0, 4);
};

const createContent = (post: BlogDataItem): BlogContentSection[] => [
  {
    type: "paragraph",
    content: createExcerpt(post),
  },
  {
    type: "heading",
    level: 2,
    content: "What this guide covers",
  },
  {
    type: "paragraph",
    content:
      "Good visual marketing starts with a clear goal, the right format, and a finish that fits where the piece will be seen. FBS Prints approaches every project with that same balance of design, production, and business purpose.",
  },
  {
    type: "list",
    items: [
      "Define the audience and the action you want them to take.",
      "Choose materials, sizes, and layouts that match the display environment.",
      "Keep messaging simple enough to scan quickly while still feeling polished.",
      "Plan production timelines before launch dates, events, or seasonal campaigns.",
    ],
  },
  {
    type: "heading",
    level: 2,
    content: "How FBS Prints can help",
  },
  {
    type: "paragraph",
    content:
      "Whether you need printed products, signage, direct mail, web design, or SEO support, our team can help turn inspiration into a finished piece that feels consistent with your brand.",
  },
  {
    type: "blockquote",
    content:
      "A strong design is not only attractive. It is readable, practical, and built for the way customers actually encounter your business.",
  },
  {
    type: "heading",
    level: 2,
    content: "Key planning checklist",
  },
  {
    type: "list",
    items: [
      "Confirm the main focal point before choosing a layout or product size.",
      "Keep spacing consistent so the finished display feels intentional.",
      "Match material choices to the room, storefront, event, or campaign setting.",
      "Review mounting, shipping, and installation needs before production starts.",
    ],
  },
  {
    type: "heading",
    level: 2,
    content: "Professional styling and material selection",
  },
  {
    type: "paragraph",
    content:
      "Different materials create different impressions. Canvas and framed prints can feel warm and personal, while acrylic, metal, rigid signs, and large-format graphics often create a sharper commercial look. The best choice depends on the surrounding space, lighting, viewing distance, and how long the piece needs to last.",
  },
  {
    type: "paragraph",
    content:
      "For business use, think beyond the single item. A strong campaign keeps colors, typography, photo treatment, and finishing details consistent across every touchpoint, from a wall print to a window graphic, direct mail piece, banner, or website visual.",
  },
  {
    type: "heading",
    level: 2,
    content: "Production details that keep projects smooth",
  },
  {
    type: "list",
    items: [
      "Use high-resolution source images whenever the final piece will be viewed up close.",
      "Leave enough margin around important text or faces so trimming and framing feel balanced.",
      "Choose outdoor-rated materials for sun, rain, wind, or storefront exposure.",
      "Ask for a proof when color, placement, or text accuracy is critical.",
    ],
  },
  {
    type: "heading",
    level: 2,
    content: "Next steps",
  },
  {
    type: "paragraph",
    content:
      "If this topic fits a project you are planning, collect your preferred images, rough sizes, brand colors, and target deadline. Those details help the production process move smoothly from concept to quote.",
  },
];

const cleanPostText = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/Posterjack/gi, "FBS Prints")
    .replace(/Canada/g, "USA")
    .replace(/Canadian/g, "American")
    .replace(/Toronto/g, "Chicago")
    .replace(/Toronto's/g, "Chicago's");
};

const cleanSlug = (slug: string): string => {
  if (!slug) return slug;
  return slug
    .replace(/posterjack/gi, "fbs-prints")
    .replace(/canada/g, "usa")
    .replace(/canadian/g, "american")
    .replace(/toronto/g, "chicago");
};

// Filter out off-track posts (contests, internal updates, gift certificates, empty data)
const filteredBlogData = (blogData as BlogDataItem[]).filter((post) => {
  if (!post.title || !post.slug) return false;
  
  const titleLower = post.title.toLowerCase();
  const slugLower = post.slug.toLowerCase();
  const categoryLower = (post.category || "").toLowerCase().trim();
  
  const offTrackKeywords = [
    "contest",
    "giveaway",
    "website update",
    "wrapped",
    "gift certificate",
    "general-contest-rules",
    "rules-and-regulations",
  ];
  
  if (offTrackKeywords.some(keyword => titleLower.includes(keyword) || slugLower.includes(keyword))) {
    return false;
  }
  
  const offTrackCategories = [
    "news",
    "contests & giveaways",
    ""
  ];
  
  if (offTrackCategories.includes(categoryLower)) {
    return false;
  }
  
  return true;
});

export const blogPosts: BlogPost[] = filteredBlogData.map((post) => {
  const cleanedPost: BlogDataItem = {
    ...post,
    title: cleanPostText(post.title),
    slug: cleanSlug(post.slug),
    category: cleanPostText(post.category),
  };
  return {
    ...cleanedPost,
    category: cleanCategory(cleanedPost.category),
    excerpt: createExcerpt(cleanedPost),
    readTime: "4 min read",
    author,
    tags: createTags(cleanedPost),
    content: createContent(cleanedPost),
  };
});

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const getRelatedPosts = (post: BlogPost, limit = 2) =>
  blogPosts
    .filter((item) => item.id !== post.id)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (a.category !== post.category && b.category === post.category) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);

export const formatBlogDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));