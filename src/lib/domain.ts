export type Role = "ADMIN" | "USER";
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string | null;
  status: PostStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  authorId: string;
  categoryId: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, "id" | "name" | "email" | "avatar">;
  category?: Category;
};

export type Media = {
  id: string;
  url: string;
  key: string;
  alt?: string | null;
  uploadedBy: string;
  createdAt: string;
};

export type Menu = {
  id: string;
  label: string;
  path: string;
  order: number;
};

export type DashboardSnapshot = {
  totals: {
    posts: number;
    published: number;
    drafts: number;
    users: number;
    media: number;
    categories: number;
  };
  latestPosts: Post[];
  draftPosts: Post[];
  categoryBreakdown: Array<{ name: string; value: number }>;
};
