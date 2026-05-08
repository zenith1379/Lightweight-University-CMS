import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang } from "@/lib/i18n";
import { getMenus, getPostBySlug } from "@/lib/repositories";

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ lang?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : undefined,
      type: "article",
    },
  };
}

export default async function NewsDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const lang = getLang((await searchParams)?.lang);
  const [menus, post] = await Promise.all([getMenus(), getPostBySlug(slug)]);
  if (!post) notFound();

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath={`/news/${slug}`} />
      <main className="bg-white">
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f3192]">{post.category?.name ?? "News"}</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-slate-950">{post.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt}</p>
          {post.thumbnail && <img src={post.thumbnail} alt="" className="mt-8 aspect-[16/8] w-full rounded-lg object-cover" />}
          <div
            className="cms-prose mt-8 text-base leading-8 text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
