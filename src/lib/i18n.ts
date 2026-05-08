export type Lang = "en";
   
export function getLang(value?: string | null): Lang {
  return "en";
}

export function withLang(path: string, lang: Lang) {
  return path;
}

const copy = {
  en: {
    university: "International University",
    school: "School of Computer Science and Engineering",
    cms: "CMS",
    footerIntro:
      "Lightweight CMS for news, announcements, admissions, programs, faculty information, menus, media, and SEO-first public pages.",
    contact: "Contact",
    administration: "Administration",
    userDashboard: "User CMS dashboard",
    readMore: "Read more",
    heroEyebrow: "University CMS Platform",
    heroTitle: "School of Computer Science and Engineering",
    heroBody:
      "A fast, maintainable, CMS-driven faculty website with public news, announcements, admissions, programs, SEO metadata, media, and role-based content workflows.",
    latestNews: "Latest News",
    programs: "Programs",
    welcome: "Welcome",
    newsroomTitle: "Built for a university faculty newsroom",
    newsroomBody:
      "A cleaner faculty website experience for desktop and mobile: focused admissions updates, academic programs, announcements, and a user-friendly CMS workflow.",
    browseBySection: "Browse by section",
    publicGroups: "Public page groups",
    rbac: "Admin and user roles",
    seo: "Metadata, sitemap, robots",
    freshFromCms: "Fresh from the CMS",
    viewAll: "View all",
    admissions: "Admissions",
    admissionsTitle: "Updates for prospective students",
  }
};

export function t(lang: Lang, key: keyof typeof copy.en) {
  return copy.en[key];
}
