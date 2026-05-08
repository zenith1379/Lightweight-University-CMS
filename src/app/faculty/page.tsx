import { PageBand, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang } from "@/lib/i18n";
import { getMenus } from "@/lib/repositories";

const faculty = [
  ["Board of Deans", "Dean, Vice Deans, academic leadership", "Strategic direction, accreditation, academic quality, and international collaboration."],
  ["Lecturers", "Computer science, software engineering, networks, AI, and data systems", "Teaching, curriculum development, student mentoring, and research supervision."],
  ["Doctoral Students", "Research assistants and PhD candidates", "Research projects, publication support, seminars, and laboratory collaboration."],
  ["Teaching Assistants", "Course operation and laboratory support", "Tutorials, lab sessions, grading support, and student learning assistance."],
  ["Lab Technicians", "Infrastructure and specialized lab operations", "Network labs, software environments, equipment, and classroom technology."],
  ["Secretary", "Student service and faculty administration", "Academic records, meeting coordination, announcements, and faculty office support."],
];

export const metadata = {
  title: "Faculty Members | SCSE",
  description: "Faculty groups and academic user structure for the School of Computer Science and Engineering.",
};

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function FacultyPage({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const menus = await getMenus();
  const isVi = lang === "vi";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader menus={menus} lang={lang} currentPath="/faculty" />
      <main className="flex-1">
        <PageBand eyebrow={isVi ? "Nhân sự" : "People"} title={isVi ? "Đội ngũ Khoa" : "Faculty Members"}>
          <p>
            {isVi
              ? "Trang nhân sự trình bày các nhóm chính của Khoa, từ ban chủ nhiệm, giảng viên, nghiên cứu sinh đến đội ngũ hỗ trợ học thuật."
              : "Faculty profiles can be expanded into a dedicated module as the CMS grows. This page mirrors the academic user groups of the reference site with richer descriptions."}
          </p>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {faculty.map(([title, description, detail]) => (
              <div key={title} className="rounded-lg border border-[#d8e1f2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#249ac6] hover:shadow-lg">
                <h2 className="text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-[#2f3192]">{description}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
