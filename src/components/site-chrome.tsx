import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Menu, Post } from "@/lib/domain";
import type { Lang } from "@/lib/i18n";
import { t, withLang } from "@/lib/i18n";

type DropdownItem = { label: string; path: string; hasChildren?: boolean };

const dropdowns: Record<string, DropdownItem[]> = {
  "/programs": [
    { label: "Undergraduate", path: "/programs?category=undergraduate", hasChildren: true },
    { label: "Exchange Programs", path: "/programs?category=exchange-programs" },
    { label: "Graduate", path: "/programs?category=graduate", hasChildren: true },
    { label: "Program Specification", path: "/programs?category=program-specification" },
  ],
  "/news": [
    { label: "Academic", path: "/news?category=academic" },
    { label: "Announcement", path: "/news?category=announcements" },
    { label: "Video", path: "/news?category=video" },
  ],
  "/admissions": [
    { label: "Undergraduate Admission", path: "/admissions" },
    { label: "Graduate Admission", path: "/news?category=admissions" },
    { label: "Scholarships", path: "/news?category=scholarships" },
  ],
  "/explore": [
    { label: "Faculty Members", path: "/faculty" },
    { label: "Location", path: "/contact" },
    { label: "Contact Office", path: "/contact" },
  ],
};

function hasDropdown(path: string) {
  return Boolean(dropdowns[path]?.length);
}

function menuLabel(label: string, lang: Lang) {
  if (lang !== "vi") return label;
  const labels: Record<string, string> = {
    Home: "Trang chủ",
    News: "Tin tức",
    Admissions: "Tuyển sinh",
    Programs: "Đào tạo",
    Faculty: "Nhân sự",
    Contact: "Liên hệ",
  };
  return labels[label] ?? label;
}

export function SiteHeader({ menus, lang = "en", currentPath = "/" }: { menus: Menu[]; lang?: Lang; currentPath?: string }) {
  const nextLang = lang === "vi" ? "en" : "vi";
  const desktopMenus = [
    ...menus,
    { id: "menu_student_handbook_static", label: "Student Handbook", path: "/news?category=student-life", order: 98 },
    { id: "menu_explore_static", label: "Explore", path: "/explore", order: 99 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8e1f2] bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={withLang("/", lang)} className="flex min-w-0 items-center gap-3">
          <Image src="/cms-assets/hcm-iu-logo.png" alt="International University" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full" />
          <span className="min-w-0">
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#2f3192]">{t(lang, "university")}</span>
            <span className="block text-sm font-black text-slate-950 sm:text-base">{t(lang, "school")}</span>
          </span>
        </Link>
        <nav className="site-scrollbar hidden items-center gap-1 overflow-visible lg:flex">
          {desktopMenus.map((menu) => {
            const menuHasDropdown = hasDropdown(menu.path);
            return (
              <div key={menu.id} className="group relative">
                <Link
                  href={withLang(menu.path, lang)}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold text-[#24356f] transition group-hover:text-red-600 hover:bg-[#e8f7fc]"
                >
                  {menuLabel(menu.label, lang)}
                  {menuHasDropdown && <ChevronDown size={14} />}
                </Link>
                {menuHasDropdown && (
                  <div className="absolute left-0 top-full z-50 hidden w-64 bg-[#328bd0] py-1 text-sm shadow-xl group-hover:block group-focus-within:block">
                    {dropdowns[menu.path].map((item) => (
                      <Link
                        key={item.label}
                        href={withLang(item.path, lang)}
                        className="flex items-center justify-between px-5 py-3 font-medium text-white transition hover:bg-[#2377bb]"
                      >
                        <span>{item.label}</span>
                        {item.hasChildren && <ChevronRight size={16} />}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link href={withLang(currentPath, nextLang)} className="rounded-md border border-[#c8d7ee] px-3 py-2 text-sm font-black text-[#2f3192] transition hover:bg-[#e8f7fc]">
            {lang === "vi" ? "EN" : "VI"}
          </Link>
          <Link href="/admin" className="rounded-md bg-[#2f3192] px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#249ac6]">
            {t(lang, "cms")}
          </Link>
        </nav>
      </div>
      <div className="site-scrollbar flex gap-2 overflow-x-auto border-t border-[#d8e1f2] bg-[#f4f9fd] px-4 py-2 lg:hidden">
        {desktopMenus.map((menu) => {
          const menuHasDropdown = hasDropdown(menu.path);
          return (
            <div key={menu.id} className="group relative shrink-0">
              <Link
                href={withLang(menu.path, lang)}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-black text-[#24356f] transition hover:bg-white hover:text-red-600 hover:shadow-sm"
              >
                {menuLabel(menu.label, lang)}
                {menuHasDropdown && <ChevronDown size={14} />}
              </Link>
              {menuHasDropdown && (
                <div className="mt-1 hidden w-64 bg-[#328bd0] py-1 text-xs shadow-xl group-hover:block">
                  {dropdowns[menu.path].map((item) => (
                    <Link key={item.label} href={withLang(item.path, lang)} className="flex items-center justify-between px-4 py-3 font-bold text-white hover:bg-[#2377bb]">
                      <span>{item.label}</span>
                      {item.hasChildren && <ChevronRight size={14} />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <Link href={withLang(currentPath, nextLang)} className="shrink-0 rounded-md border border-[#c8d7ee] px-3 py-2 text-sm font-black text-[#2f3192] hover:bg-white">
          {lang === "vi" ? "EN" : "VI"}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ lang = "en" }: { lang?: Lang }) {
  return (
    <footer className="border-t border-[#d8e1f2] bg-[#12175f] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">SCSE CMS Platform</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50">{t(lang, "footerIntro")}</p>
        </div>
        <div className="text-sm text-blue-50">
          <p className="font-bold text-white">{t(lang, "contact")}</p>
          <p className="mt-3">Quarter 6, Linh Trung Ward, Thu Duc City</p>
          <p>Ho Chi Minh City, Vietnam</p>
        </div>
        <div className="text-sm text-blue-50">
          <p className="font-bold text-white">{t(lang, "administration")}</p>
          <Link href="/admin" className="mt-3 inline-block text-cyan-200 hover:text-white">
            {t(lang, "userDashboard")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PostCard({ post, lang = "en" }: { post: Post; lang?: Lang }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-[#d8e1f2] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2f3192]">{post.category?.name ?? "News"}</p>
          <span className="rounded-full bg-[#e8f7fc] px-2 py-0.5 text-xs font-bold text-[#249ac6]">{post.status}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-black text-slate-950">
          <Link href={withLang(`/news/${post.slug}`, lang)}>{post.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        <p className="mt-3 text-xs font-bold text-slate-500">
          {post.author?.name ?? "SCSE Editorial Board"} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US") : "Draft"}
        </p>
        <Link href={withLang(`/news/${post.slug}`, lang)} className="mt-4 inline-flex text-sm font-black text-[#2f3192] hover:text-[#249ac6]">
          {t(lang, "readMore")}
        </Link>
      </div>
    </article>
  );
}

export function PageBand({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-[#d8e1f2] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f3192]">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">{title}</h1>
        <div className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{children}</div>
      </div>
    </section>
  );
}
