import { PageBand, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getLang } from "@/lib/i18n";
import { getMenus } from "@/lib/repositories";

export const metadata = {
  title: "Contact | SCSE",
  description: "Contact information for the School of Computer Science and Engineering.",
};

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const lang = getLang((await searchParams).lang);
  const menus = await getMenus();
  const isVi = lang === "vi";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader menus={menus} lang={lang} currentPath="/contact" />
      <main className="flex-1">
        <PageBand eyebrow={isVi ? "Liên hệ" : "Contact"} title={isVi ? "Liên hệ Khoa" : "Contact"}>
          <p>
            {isVi
              ? "Liên hệ văn phòng Khoa để được hỗ trợ về tuyển sinh, chương trình đào tạo, dịch vụ sinh viên và các thủ tục hành chính."
              : "Reach the faculty office for admissions, program, student service, and administrative support."}
          </p>
        </PageBand>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1fr] lg:px-8">
            <div className="rounded-lg border border-[#d8e1f2] bg-white p-6 shadow-sm">
              <h2 className="font-black text-slate-950">{isVi ? "Văn phòng Khoa" : "Faculty Office"}</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Room A1-610, School of Computer Science and Engineering</p>
                <p>International University - VNU.HCM</p>
                <p>Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City, Vietnam</p>
                <p className="font-bold text-[#2f3192]">Phone: (028) 37244270 - Ext: 3232</p>
                <p className="font-bold text-[#2f3192]">Email: cse@hcmiu.edu.vn</p>
              </div>
            </div>
            <form className="rounded-lg border border-[#d8e1f2] bg-white p-6 shadow-sm">
              <div className="grid gap-3">
                <input className="h-11 rounded-md border border-[#d8e1f2] px-3 outline-none focus:ring-2 focus:ring-[#249ac6]/25" placeholder={isVi ? "Họ và tên" : "Your name"} />
                <input className="h-11 rounded-md border border-[#d8e1f2] px-3 outline-none focus:ring-2 focus:ring-[#249ac6]/25" placeholder="Email" />
                <textarea className="min-h-32 rounded-md border border-[#d8e1f2] p-3 outline-none focus:ring-2 focus:ring-[#249ac6]/25" placeholder={isVi ? "Nội dung cần hỗ trợ" : "Message"} />
                <button className="h-11 rounded-md bg-[#2f3192] px-4 text-sm font-bold text-white transition hover:bg-[#249ac6]" type="button">
                  {isVi ? "Gửi thông tin" : "Send"}
                </button>
              </div>
            </form>
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg border border-[#d8e1f2] bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="p-6">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f3192]">{isVi ? "Vị trí" : "Location"}</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">International University - VNU.HCM</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City, Vietnam
                  </p>
                  <img src="/cms-assets/campus-location.svg" alt="" className="mt-5 h-48 w-full rounded-md object-cover" />
                </div>
                <iframe
                  title="International University location"
                  src="https://www.google.com/maps?q=International%20University%20VNU%20HCM&output=embed"
                  className="min-h-[360px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
