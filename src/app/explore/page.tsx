import Link from "next/link";
import { PageBand, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang, withLang } from "@/lib/i18n";
import { getMenus } from "@/lib/repositories";

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function ExplorePage({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const menus = await getMenus();
  const isVi = lang === "vi";

  const links = [
    { label: isVi ? "Nhân sự Khoa" : "Faculty Members", href: "/faculty" },
    { label: isVi ? "Vị trí" : "Location", href: "/contact" },
    { label: isVi ? "Văn phòng liên hệ" : "Contact Office", href: "/contact" },
  ];

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath="/explore" />
      <main>
        <PageBand eyebrow="Explore" title={isVi ? "Khám phá thông tin Khoa" : "Explore the School"}>
          <p>{isVi ? "Truy cập nhanh thông tin nhân sự, vị trí và liên hệ văn phòng Khoa." : "Quick access to faculty information, location, and office contact details."}</p>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {links.map((item) => (
              <Link key={item.href + item.label} href={withLang(item.href, lang)} className="rounded-lg border border-[#d8e1f2] bg-white p-5 font-black text-[#2f3192] shadow-sm transition hover:border-[#249ac6] hover:text-[#249ac6]">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
