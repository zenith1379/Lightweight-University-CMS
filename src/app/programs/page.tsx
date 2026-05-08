import { PageBand, PostCard, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang } from "@/lib/i18n";
import { getMenus, getPostsPage } from "@/lib/repositories";

export const revalidate = 60;

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function ProgramsPage({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const [menus, posts] = await Promise.all([
    getMenus(),
    getPostsPage({ page: 1, pageSize: 12, publicOnly: true, category: "programs" }),
  ]);

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath="/programs" />
      <main>
        <PageBand eyebrow={"Academic Programs"} title={"Programs"}>
          <p>{"Undergraduate, postgraduate, and twinning program information for computer science, engineering, networks, and data-oriented pathways."}</p>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.data.map((post) => <PostCard key={post.id} post={post} lang={lang} />)}
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
