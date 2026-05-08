import Link from "next/link";
import { PostCard, SiteFooter, SiteHeader, PageBand } from "@/components/site-chrome";
import { getLang, withLang } from "@/lib/i18n";
import { getCategories, getMenus, getPostsPage } from "@/lib/repositories";

export const revalidate = 60;

type Props = { searchParams: Promise<{ category?: string; q?: string; lang?: string }> };

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = getLang(params.lang);
  const [menus, categories, posts] = await Promise.all([
    getMenus(),
    getCategories(),
    getPostsPage({ page: 1, pageSize: 24, publicOnly: true, category: params.category, q: params.q }),
  ]);

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath="/news" />
      <main>
        <PageBand eyebrow={lang === "vi" ? "Tin tức" : "Newsroom"} title={lang === "vi" ? "Tin tức và thông báo" : "News and Announcements"}>
          <p>{lang === "vi" ? "Theo dõi tin tức học thuật, thông báo sinh viên, tuyển sinh và chương trình đào tạo được quản lý từ CMS." : "Browse faculty news, academic notices, admissions updates, and program information maintained through the CMS dashboard."}</p>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="site-scrollbar flex gap-2 overflow-auto pb-2">
              <Link href={withLang("/news", lang)} className="shrink-0 rounded-md bg-[#2f3192] px-3 py-2 text-sm font-bold text-white">All</Link>
              {categories.map((category) => (
                <Link key={category.id} href={withLang(`/news?category=${category.slug}`, lang)} className="shrink-0 rounded-md border border-[#d8e1f2] bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-[#249ac6] hover:text-[#2f3192]">
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => <PostCard key={post.id} post={post} lang={lang} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
