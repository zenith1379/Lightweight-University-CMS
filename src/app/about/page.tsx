import { PageBand, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getMenus } from "@/lib/repositories";

export const metadata = {
  title: "About | SCSE",
  description: "About the School of Computer Science and Engineering CMS-powered faculty website.",
};

export default async function AboutPage() {
  const menus = await getMenus();
  return (
    <>
      <SiteHeader menus={menus} />
      <main>
        <PageBand eyebrow="About" title="School of Computer Science and Engineering">
          <p>
            The School trains computing professionals through intensive programs, research activity, international collaboration, and industry-oriented learning.
          </p>
        </PageBand>
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              {["Performance", "Maintainability", "Editorial Control"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <h2 className="font-black text-slate-950">{item}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Supported by SSR pages, modular APIs, reusable UI, Prisma models, and RBAC-protected management workflows.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
