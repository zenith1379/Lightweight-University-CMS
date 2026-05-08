import { PostCard, SiteFooter, SiteHeader, PageBand } from "@/components/site-chrome";
import { getMenus, getPostsPage } from "@/lib/repositories";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const [menus, posts] = await Promise.all([getMenus(), getPostsPage({ page: 1, pageSize: 24, publicOnly: true, q })]);
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader menus={menus} />
      <main className="flex-1">
        <PageBand eyebrow="Search" title="Search Results">
          <form action="/search" className="flex gap-2">
            <input name="q" defaultValue={q} className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 px-3" placeholder="Search news..." />
            <button className="rounded-md bg-[#2f3192] px-4 text-sm font-bold text-white">Search</button>
          </form>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.data.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}


