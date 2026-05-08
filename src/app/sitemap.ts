import type { MetadataRoute } from "next";
import { getPostsPage } from "@/lib/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPostsPage({ page: 1, pageSize: 100, publicOnly: true });
  const staticRoutes = ["", "/news", "/announcements", "/admissions", "/programs", "/faculty", "/about", "/contact", "/explore", "/search"];

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    ...posts.data.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    })),
  ];
}
