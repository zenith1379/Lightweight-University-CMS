import type { Prisma } from "@prisma/client";
import type { Category, DashboardSnapshot, Menu, Post, PostStatus, Role, User } from "./domain";
import { categories, enrichPost, getDashboardSnapshot, media, menus, posts, users } from "./sample-data";

const hasDatabase = () => Boolean(process.env.DATABASE_URL);

async function getPrisma() {
  const mod = await import("./prisma");
  return mod.prisma;
}

function serializePost(post: unknown): Post {
  const value = post as Post & {
    createdAt: Date | string;
    updatedAt: Date | string;
    publishedAt?: Date | string | null;
  };

  return {
    ...value,
    createdAt: new Date(value.createdAt).toISOString(),
    updatedAt: new Date(value.updatedAt).toISOString(),
    publishedAt: value.publishedAt ? new Date(value.publishedAt).toISOString() : null,
  };
}

function serializeUser(user: unknown): User {
  const value = user as User & { createdAt: Date | string; updatedAt: Date | string };
  return {
    ...value,
    createdAt: new Date(value.createdAt).toISOString(),
    updatedAt: new Date(value.updatedAt).toISOString(),
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function getUserByEmail(email: string) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.user.findUnique({ where: { email } });
  }

  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUsers() {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rows.map(serializeUser);
  }

  return users;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar?: string | null;
  active?: boolean;
}) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.user.create({ data: input });
  }

  const now = new Date().toISOString();
  const user = {
    id: `usr_${Date.now()}`,
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    role: input.role,
    avatar: input.avatar,
    active: input.active ?? true,
    createdAt: now,
    updatedAt: now,
  };
  users.unshift(user);
  return user;
}

export async function updateUser(
  id: string,
  input: Partial<Pick<User, "name" | "email" | "role" | "avatar" | "active">> & { passwordHash?: string },
) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.user.update({ where: { id }, data: input });
  }

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error("User not found");
  users[index] = { ...users[index], ...input, updatedAt: new Date().toISOString() };
  return users[index];
}

export async function getCategories() {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  return categories;
}

export async function createCategory(input: { name: string; slug?: string }) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.category.create({ data: { name: input.name, slug } });
  }

  const now = new Date().toISOString();
  const category: Category = { id: `cat_${Date.now()}`, name: input.name, slug, createdAt: now, updatedAt: now };
  categories.push(category);
  return category;
}

export async function deleteCategory(id: string) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.category.delete({ where: { id } });
  }

  const index = categories.findIndex((category) => category.id === id);
  if (index >= 0) categories.splice(index, 1);
  return { id };
}

export async function getPostsPage(input: {
  page: number;
  pageSize: number;
  q?: string;
  category?: string;
  status?: PostStatus;
  publicOnly?: boolean;
}) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const where: Prisma.PostWhereInput = {
      status: input.publicOnly ? "PUBLISHED" : input.status,
      category: input.category ? { slug: input.category } : undefined,
      OR: input.q
        ? [
            { title: { contains: input.q, mode: "insensitive" } },
            { excerpt: { contains: input.q, mode: "insensitive" } },
            { content: { contains: input.q, mode: "insensitive" } },
          ]
        : undefined,
    };
    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true, avatar: true } },
          category: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      prisma.post.count({ where }),
    ]);

    return { data: data.map(serializePost), total };
  }

  const query = input.q?.toLowerCase();
  const filtered = posts.filter((post) => {
    const category = categories.find((item) => item.id === post.categoryId);
    const matchesStatus = input.publicOnly ? post.status === "PUBLISHED" : input.status ? post.status === input.status : true;
    const matchesCategory = input.category ? category?.slug === input.category : true;
    const matchesQuery = query
      ? `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(query)
      : true;
    return matchesStatus && matchesCategory && matchesQuery;
  });
  const start = (input.page - 1) * input.pageSize;
  return { data: filtered.slice(start, start + input.pageSize).map(enrichPost), total: filtered.length };
}

export async function getPostBySlug(slug: string, publicOnly = true) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const post = await prisma.post.findFirst({
      where: { slug, status: publicOnly ? "PUBLISHED" : undefined },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        category: true,
      },
    });
    return post ? serializePost(post) : null;
  }

  const post = posts.find((item) => item.slug === slug && (!publicOnly || item.status === "PUBLISHED"));
  return post ? enrichPost(post) : null;
}

export async function getPostById(id: string) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        category: true,
      },
    });
    return post ? serializePost(post) : null;
  }

  const post = posts.find((item) => item.id === id);
  return post ? enrichPost(post) : null;
}

export async function createPost(input: {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  thumbnail?: string | null;
  status: PostStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  authorId: string;
  categoryId: string;
}) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const publishedAt = input.status === "PUBLISHED" ? new Date() : null;
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.post.create({ data: { ...input, slug, publishedAt } });
  }

  const now = new Date().toISOString();
  const post: Post = {
    id: `post_${Date.now()}`,
    ...input,
    slug,
    publishedAt: publishedAt?.toISOString() ?? null,
    createdAt: now,
    updatedAt: now,
  };
  posts.unshift(post);
  return post;
}

export async function updatePost(
  id: string,
  input: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    thumbnail: string | null;
    status: PostStatus;
    seoTitle: string | null;
    seoDescription: string | null;
    categoryId: string;
  }>,
) {
  const slug = input.slug ? slugify(input.slug) : undefined;
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const current = await prisma.post.findUnique({ where: { id } });
    const publishedAt =
      input.status === "PUBLISHED" && !current?.publishedAt ? new Date() : input.status === "DRAFT" ? null : undefined;
    return prisma.post.update({ where: { id }, data: { ...input, slug, publishedAt } });
  }

  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) throw new Error("Post not found");
  posts[index] = {
    ...posts[index],
    ...input,
    slug: slug ?? posts[index].slug,
    publishedAt:
      input.status === "PUBLISHED" && !posts[index].publishedAt
        ? new Date().toISOString()
        : input.status === "DRAFT"
          ? null
          : posts[index].publishedAt,
    updatedAt: new Date().toISOString(),
  };
  return posts[index];
}

export async function deletePost(id: string) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.post.delete({ where: { id } });
  }

  const index = posts.findIndex((post) => post.id === id);
  if (index >= 0) posts.splice(index, 1);
  return { id };
}

export async function getMedia() {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  }

  return media;
}

export async function createMedia(input: { url: string; key: string; alt?: string | null; uploadedBy: string }) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.media.create({ data: input });
  }

  const asset = { id: `media_${Date.now()}`, ...input, createdAt: new Date().toISOString() };
  media.unshift(asset);
  return asset;
}

export async function updateMedia(id: string, input: Partial<Pick<(typeof media)[number], "url" | "key" | "alt">>) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.media.update({ where: { id }, data: input });
  }

  const index = media.findIndex((asset) => asset.id === id);
  if (index === -1) throw new Error("Media not found");
  media[index] = { ...media[index], ...input };
  return media[index];
}

export async function deleteMedia(id: string) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.media.delete({ where: { id } });
  }

  const index = media.findIndex((asset) => asset.id === id);
  if (index >= 0) media.splice(index, 1);
  return { id };
}

export async function getMenus() {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    return prisma.menu.findMany({ orderBy: { order: "asc" } });
  }

  return menus.sort((a, b) => a.order - b.order);
}

export async function replaceMenus(input: Array<Omit<Menu, "id"> & { id?: string }>) {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    await prisma.$transaction([
      prisma.menu.deleteMany(),
      ...input.map((item) => prisma.menu.create({ data: { label: item.label, path: item.path, order: item.order } })),
    ]);
    return prisma.menu.findMany({ orderBy: { order: "asc" } });
  }

  menus.splice(0, menus.length, ...input.map((item, index) => ({ id: item.id ?? `menu_${index}`, ...item })));
  return menus;
}

export async function getDashboardData(): Promise<DashboardSnapshot> {
  if (hasDatabase()) {
    const prisma = await getPrisma();
    const [postsTotal, published, drafts, usersTotal, mediaTotal, categoriesTotal, latest, draftRows, categoryRows] =
      await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: "PUBLISHED" } }),
        prisma.post.count({ where: { status: "DRAFT" } }),
        prisma.user.count(),
        prisma.media.count(),
        prisma.category.count(),
        prisma.post.findMany({
          include: { author: { select: { id: true, name: true, email: true, avatar: true } }, category: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
        prisma.post.findMany({
          where: { status: "DRAFT" },
          include: { author: { select: { id: true, name: true, email: true, avatar: true } }, category: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
        prisma.category.findMany({
          include: { _count: { select: { posts: true } } },
          orderBy: { name: "asc" },
        }),
      ]);

    return {
      totals: {
        posts: postsTotal,
        published,
        drafts,
        users: usersTotal,
        media: mediaTotal,
        categories: categoriesTotal,
      },
      latestPosts: latest.map(serializePost),
      draftPosts: draftRows.map(serializePost),
      categoryBreakdown: categoryRows.map((category) => ({ name: category.name, value: category._count.posts })),
    };
  }

  return getDashboardSnapshot();
}
