export type Lang = "en" | "vi";

export function getLang(value?: string | null): Lang {
  return value === "vi" ? "vi" : "en";
}

export function withLang(path: string, lang: Lang) {
  return lang === "vi" ? `${path}${path.includes("?") ? "&" : "?"}lang=vi` : path;
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
  },
  vi: {
    university: "Trường Đại học Quốc tế",
    school: "Khoa Khoa học và Kỹ thuật Máy tính",
    cms: "Quản trị",
    footerIntro:
      "Hệ quản trị nội dung gọn nhẹ cho tin tức, thông báo, tuyển sinh, chương trình đào tạo, nhân sự, menu, media và SEO.",
    contact: "Liên hệ",
    administration: "Quản trị nội dung",
    userDashboard: "Bảng điều khiển CMS",
    readMore: "Xem thêm",
    heroEyebrow: "Nền tảng CMS đại học",
    heroTitle: "Khoa Khoa học và Kỹ thuật Máy tính",
    heroBody:
      "Website khoa nhanh, dễ bảo trì, có CMS để quản lý tin tức, thông báo, tuyển sinh, chương trình đào tạo, SEO, media và phân quyền biên tập.",
    latestNews: "Tin mới",
    programs: "Chương trình",
    welcome: "Giới thiệu",
    newsroomTitle: "Thiết kế cho cổng thông tin của khoa",
    newsroomBody:
      "Giao diện gọn gàng hơn cho desktop và điện thoại: nổi bật tuyển sinh, chương trình học, thông báo và quy trình quản trị nội dung cho nhân viên.",
    browseBySection: "Duyệt theo chuyên mục",
    publicGroups: "Nhóm trang công khai",
    rbac: "Vai trò Admin và User",
    seo: "Metadata, sitemap, robots",
    freshFromCms: "Nội dung mới từ CMS",
    viewAll: "Xem tất cả",
    admissions: "Tuyển sinh",
    admissionsTitle: "Cập nhật cho thí sinh",
  },
};

export function t(lang: Lang, key: keyof typeof copy.en) {
  return copy[lang][key];
}
