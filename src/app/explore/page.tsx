import Link from "next/link";
import { PageBand, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang, withLang } from "@/lib/i18n";
import { getMenus } from "@/lib/repositories";

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function ExplorePage({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const menus = await getMenus();

  const links = [
    { label: "Faculty Members", href: "/faculty" },
    { label: "Location", href: "/contact" },
    { label: "Contact Office", href: "/contact" },
  ];

  return (
    <>
      <SiteHeader menus={menus} lang={lang} currentPath="/explore" />
      <main>
        <PageBand eyebrow="Explore" title={"Explore the School"}>
          <p>{"Quick access to faculty information, location, and office contact details."}</p>
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
