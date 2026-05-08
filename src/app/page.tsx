import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";
import { PostCard, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang, t, withLang } from "@/lib/i18n";
import { getCategories, getMenus, getPostsPage } from "@/lib/repositories";

export const revalidate = 60;

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function Home({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const [menus, categories, latest, admissions] = await Promise.all([
    getMenus(),
    getCategories(),
    getPostsPage({ page: 1, pageSize: 6, publicOnly: true }),
    getPostsPage({ page: 1, pageSize: 3, publicOnly: true, category: "admissions" }),
  ]);

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath="/" />
      <main>
        <section className="relative overflow-hidden bg-[#12175f] text-white">
          <HeroSlider
            slides={[
              {
                src: "/cms-assets/postgraduate-admission.svg",
                eyebrow: lang === "vi" ? "Tuyen sinh Sau dai hoc 2026" : "Graduate Admission 2026",
                title: lang === "vi" ? "Tu van Thac si va Tien si Cong nghe Thong tin" : "Master and Doctor of IT consulting session",
                body: lang === "vi" ? "Su kien dien ra luc 08:30, Thu Bay 16/05/2026 tai Phong A2.307, Truong Dai hoc Quoc te, co ho tro tham gia online." : "The session starts at 08:30 on Saturday, 16/05/2026 in Room A2.307, International University, with online support available.",
              },
              {
                src: "/cms-assets/admission-2026.svg",
                eyebrow: lang === "vi" ? "Thong tin tuyen sinh 2026" : "Admission Information 2026",
                title: lang === "vi" ? "Truong Dai hoc Quoc te tuyen 2.300 chi tieu" : "International University announces 2,300 admission quotas",
                body: lang === "vi" ? "Noi dung demo duoc bien tap theo RSS cua website Khoa, gom tuyen sinh, hoc bong, chuong trinh dao tao va huong dan ho so." : "Demo content is adapted from the School RSS feed, covering admission, scholarships, programs, and application guidance.",
              },
              {
                src: "/cms-assets/video-briefing.svg",
                eyebrow: lang === "vi" ? "Video va su kien" : "Video and Events",
                title: lang === "vi" ? "Nhip cau du hoc va cac chuong trinh lien ket" : "Study-abroad briefing and partnership pathways",
                body: lang === "vi" ? "Bai viet co the nhung video YouTube, hinh anh, link dang ky va thong tin dia diem nhu tren website goc." : "Posts can include YouTube video embeds, images, registration links, and location details like the reference website.",
              },
              {
                src: "/cms-assets/internship-opportunity.svg",
                eyebrow: lang === "vi" ? "Thuc tap va doanh nghiep" : "Internship and Industry",
                title: lang === "vi" ? "Thong bao thuc tap duoc quan ly tap trung" : "Internship notices managed in one CMS",
                body: lang === "vi" ? "CMS ho tro dang thong bao thuc tap, lich thi, webinar, tham quan doanh nghiep va cac cap nhat hoc vu cho sinh vien." : "The CMS supports internship notices, exam schedules, webinars, company visits, and academic updates for students.",
              },
            ]}
            latestNewsHref={withLang("/news", lang)}
            programsHref={withLang("/programs", lang)}
            latestNewsLabel={t(lang, "latestNews")}
            programsLabel={t(lang, "programs")}
          />
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f3192]">{t(lang, "welcome")}</p>
                <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">{t(lang, "newsroomTitle")}</h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">{t(lang, "newsroomBody")}</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{t(lang, "browseBySection")}</p>
                <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link key={category.id} href={withLang(`/news?category=${category.slug}`, lang)} className="rounded-lg border border-[#d8e1f2] bg-[#f4f9fd] px-4 py-3 transition hover:border-[#249ac6] hover:bg-[#e8f7fc] hover:text-[#2f3192]">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["6", t(lang, "publicGroups")],
                ["RBAC", t(lang, "rbac")],
                ["SEO", t(lang, "seo")],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-[#d8e1f2] bg-[#f4f9fd] p-5">
                  <p className="text-3xl font-black text-[#2f3192]">{value}</p>
                  <p className="mt-2 text-sm font-bold text-slate-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8e1f2] bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f3192]">{t(lang, "latestNews")}</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">{t(lang, "freshFromCms")}</h2>
              </div>
              <Link href={withLang("/news", lang)} className="text-sm font-bold text-[#2f3192] hover:text-[#249ac6]">{t(lang, "viewAll")}</Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latest.data.map((post) => <PostCard key={post.id} post={post} lang={lang} />)}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2f3192]">{t(lang, "admissions")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">{t(lang, "admissionsTitle")}</h2>
            </div>
            <div className="space-y-3">
              {admissions.data.map((post) => (
                <Link key={post.id} href={withLang(`/news/${post.slug}`, lang)} className="block rounded-lg border border-[#d8e1f2] p-4 transition hover:border-[#249ac6] hover:bg-[#e8f7fc]">
                  <p className="font-bold text-slate-950">{post.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
