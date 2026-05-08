import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PostStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const categories = [
  "Academic",
  "News",
  "Announcements",
  "Admissions",
  "Programs",
  "Research",
  "Video",
  "Student Life",
];

type SeedPost = {
  title: string;
  category: string;
  excerpt: string;
  thumbnail: string;
  content?: string;
};

const posts: SeedPost[] = [
  {
    title: "Buổi Tư vấn Tuyển sinh Sau đại học 2026 ngành Công nghệ Thông tin",
    category: "Admissions",
    excerpt:
      "Khoa Khoa học và Kỹ thuật Máy tính tổ chức buổi tư vấn tuyển sinh sau đại học 2026 cho chương trình Thạc sĩ và Tiến sĩ Công nghệ Thông tin.",
    thumbnail: "/cms-assets/postgraduate-admission.svg",
    content:
      "<article><p><strong>Khoa Khoa học và Kỹ thuật Máy tính - Trường Đại học Quốc tế, ĐHQG-HCM</strong> trân trọng thông báo tổ chức <strong>Buổi Tư vấn Tuyển sinh Sau đại học 2026</strong> dành cho chương trình Thạc sĩ và Tiến sĩ ngành Công nghệ Thông tin.</p><h2>Thông tin sự kiện</h2><p><strong>Thời gian:</strong> 08:30, Thứ Bảy, ngày 16/05/2026<br><strong>Địa điểm:</strong> Phòng A2.307, Trường Đại học Quốc tế<br><strong>Hình thức:</strong> Tham gia trực tiếp, có hỗ trợ tham gia online</p><h2>Nội dung chính</h2><ul><li>Giới thiệu chương trình Thạc sĩ và Tiến sĩ ngành Công nghệ Thông tin.</li><li>Cập nhật điều kiện dự tuyển, thời hạn nộp hồ sơ và học bổng.</li><li>Hỏi đáp với giảng viên, cựu học viên và bộ phận tuyển sinh.</li></ul></article>",
  },
  {
    title: "TUYỂN SINH THẠC SĨ & TIẾN SĨ CNTT 2026",
    category: "Admissions",
    excerpt:
      "Thông báo tuyển sinh chương trình Thạc sĩ và Tiến sĩ Công nghệ Thông tin năm 2026 với hình thức xét tuyển và các mốc thời gian cụ thể.",
    thumbnail: "/cms-assets/admission-2026.svg",
    content:
      "<p><strong>THÔNG BÁO TUYỂN SINH CHƯƠNG TRÌNH THẠC SĨ VÀ TIẾN SĨ CÔNG NGHỆ THÔNG TIN NĂM 2026</strong></p><h2>Thời gian tuyển sinh</h2><p><strong>Đợt 1:</strong> nhận hồ sơ đến 29/05/2026, xét tuyển 18-19/06/2026, nhập học tháng 09/2026.</p><p><strong>Đợt 2:</strong> nhận hồ sơ đến 23/10/2026, xét tuyển 12-13/11/2026, nhập học tháng 02/2027.</p>",
  },
  {
    title: "Thông tin tuyển sinh 2026",
    category: "News",
    excerpt:
      "Trường Đại học Quốc tế tuyển 2.300 chỉ tiêu, áp dụng phương thức xét tuyển tổng hợp để mở rộng cơ hội cho thí sinh.",
    thumbnail: "/cms-assets/admission-2026.svg",
    content:
      "<h2>Trường Đại học Quốc tế tuyển 2.300 chỉ tiêu, áp dụng công thức xét tuyển 3 trong 1</h2><p>Năm 2026, Trường Đại học Quốc tế (ĐHQG-HCM) công bố tuyển sinh với tổng chỉ tiêu 2.300 sinh viên.</p><ul><li>Số ngành đào tạo: 24.</li><li>Chương trình do trường cấp bằng: 1.930 chỉ tiêu.</li><li>Chương trình liên kết quốc tế: 370 chỉ tiêu.</li></ul>",
  },
  {
    title: "NHỊP CẦU DU HỌC: DU HỌC TẠI CHỖ",
    category: "Video",
    excerpt:
      "Video giới thiệu góc nhìn về du học tại chỗ trong các ngành Công nghệ Sinh học và Công nghệ Thông tin.",
    thumbnail: "/cms-assets/video-briefing.svg",
    content:
      "<p>Chuyên mục video cung cấp thông tin về mô hình học tập quốc tế, chương trình liên kết và lựa chọn du học tại chỗ cho sinh viên.</p><div class=\"cms-video\"><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/gl_5fqsBm1Q?si=PtoSuCaqDJfJt1oE\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe></div>",
  },
  {
    title: "Internship 2025-2026 Sem II",
    category: "Announcements",
    excerpt:
      "Thông báo hướng dẫn sinh viên đăng ký học phần Internship, quy trình apply, báo cáo và theo dõi tiến độ thực tập.",
    thumbnail: "/cms-assets/internship-opportunity.svg",
    content:
      "<h2>Internship 2025-2026 Semester II</h2><p>Sinh viên cần đăng ký học phần Internship (IT082IU), apply for internship, báo cáo với internship coordinator và theo dõi tiến độ theo hướng dẫn của Khoa.</p><ul><li>Enroll the course Internship (IT082IU).</li><li>Apply for internship.</li><li>Report to the internship coordinator by email.</li><li>Submit final documents on time.</li></ul>",
  },
  {
    title: "NAB Vietnam",
    category: "Student Life",
    excerpt:
      "Thông báo webinar PM và tham quan doanh nghiệp dành cho sinh viên năm 3 và năm 4, có thời gian, hình thức và địa điểm cụ thể.",
    thumbnail: "/cms-assets/campus-location.svg",
    content:
      "<h2>Thông báo cho sinh viên: Webinar PM và Tham quan doanh nghiệp</h2><p><strong>Webinar:</strong> 20:00 - 21:30, ngày 18/12/2025, hình thức Online (Zoom).</p><p><strong>Tham quan doanh nghiệp:</strong> 09:30 - 11:30, ngày 16/01/2026, dành cho 30-50 sinh viên năm 3 và năm 4.</p><p><strong>Địa điểm:</strong> NAB Innovation Centre Vietnam, TP.HCM.</p>",
  },
  {
    title: "School of Computer Science and Engineering Achieves ASIIN Accreditation",
    category: "News",
    excerpt:
      "The School renews its international quality commitment through program accreditation, curriculum mapping, learning outcome assessment, and external review.",
    thumbnail: "/cms-assets/graduation.svg",
  },
  {
    title: "Admission Scores 2025",
    category: "Admissions",
    excerpt:
      "Updated undergraduate admission score ranges, application notes, scholarship reminders, and program consultation guidance for prospective students.",
    thumbnail: "/cms-assets/admissions.svg",
  },
  {
    title: "Internship Orientation Announcement 2025",
    category: "Announcements",
    excerpt:
      "Students are invited to attend the internship orientation session covering company matching, reporting rules, supervisor expectations, and final submission timelines.",
    thumbnail: "/cms-assets/internship.svg",
  },
  {
    title: "Bachelor of Engineering in Information Technology",
    category: "Programs",
    excerpt:
      "A practice-oriented program covering software engineering, networks, cybersecurity, data platforms, computer systems, and capstone product development.",
    thumbnail: "/cms-assets/program.svg",
  },
  {
    title: "Twinning Programs with International Partners",
    category: "Programs",
    excerpt:
      "Study pathways with partner universities in Australia, the United Kingdom, and the United States, including transfer planning and academic advising.",
    thumbnail: "/cms-assets/campus.svg",
  },
  {
    title: "Research Seminar on Intelligent Information Systems",
    category: "Research",
    excerpt:
      "Faculty members and postgraduate students present current work in AI, data platforms, cybersecurity, distributed systems, and knowledge engineering.",
    thumbnail: "/cms-assets/research.svg",
  },
  {
    title: "Data Science Program Introduces Applied Analytics Track",
    category: "Programs",
    excerpt:
      "The updated track adds applied analytics, machine learning practice, dashboard design, and project-based data storytelling for undergraduate students.",
    thumbnail: "/cms-assets/program.svg",
  },
  {
    title: "Computer Engineering Lab Opens New Embedded Systems Practice Room",
    category: "News",
    excerpt:
      "Students now have expanded access to microcontroller kits, sensor modules, networked devices, and guided lab exercises for embedded systems courses.",
    thumbnail: "/cms-assets/research.svg",
  },
  {
    title: "Master Program Information Session on AI and Data Systems",
    category: "Admissions",
    excerpt:
      "Prospective graduate students are invited to learn about admission requirements, research supervision, course planning, and thesis expectations.",
    thumbnail: "/cms-assets/admissions.svg",
  },
  {
    title: "Cybersecurity Workshop for Final-Year Students",
    category: "Announcements",
    excerpt:
      "The workshop covers secure coding, incident response basics, common web vulnerabilities, and career preparation for security roles.",
    thumbnail: "/cms-assets/internship.svg",
  },
  {
    title: "Scholarship Application Reminder for Incoming Students",
    category: "Admissions",
    excerpt:
      "Applicants should prepare transcripts, English certificates, achievement evidence, and financial documents before the scholarship submission deadline.",
    thumbnail: "/cms-assets/graduation.svg",
  },
  {
    title: "Capstone Showcase Features Student Software Products",
    category: "Student Life",
    excerpt:
      "Student teams present web platforms, mobile applications, AI prototypes, data dashboards, and network tools developed during the capstone semester.",
    thumbnail: "/cms-assets/campus.svg",
  },
  {
    title: "Faculty Research Group Receives Grant for Smart Campus Systems",
    category: "Research",
    excerpt:
      "The project studies sensing, data integration, privacy-aware analytics, and service dashboards for smart campus operations.",
    thumbnail: "/cms-assets/research.svg",
  },
  {
    title: "International Exchange Briefing for Computing Students",
    category: "Announcements",
    excerpt:
      "The briefing explains exchange timelines, credit transfer planning, English requirements, partner options, and academic advising steps.",
    thumbnail: "/cms-assets/campus.svg",
  },
  {
    title: "Research Database Access Guide for Students",
    category: "Research",
    excerpt:
      "The guide helps students find academic papers, use citation tools, access digital library resources, and prepare literature reviews.",
    thumbnail: "/cms-assets/research.svg",
  },
];

async function main() {
  await prisma.media.deleteMany();
  await prisma.post.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const userPasswordHash = await bcrypt.hash("User@12345", 12);

  const admin = await prisma.user.create({
    data: {
      name: "SCSE Administrator",
      email: "admin@scse.local",
      passwordHash,
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    },
  });

  await prisma.user.create({
    data: {
      name: "Faculty User Editor",
      email: "user@scse.local",
      passwordHash: userPasswordHash,
      role: Role.USER,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
    },
  });

  const categoryRows = new Map<string, string>();
  for (const name of categories) {
    const category = await prisma.category.create({
      data: { name, slug: slugify(name) },
    });
    categoryRows.set(name, category.id);
  }

  for (const [index, post] of posts.entries()) {
    await prisma.post.create({
      data: {
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        content: post.content ?? `<p>${post.excerpt}</p><p>Editors can update this article from the admin CMS using the rich text editor, SEO fields, category selection, thumbnail media, draft workflow, and publish controls.</p>`,
        thumbnail: post.thumbnail,
        seoTitle: post.title,
        seoDescription: post.excerpt,
        status: index === posts.length - 1 ? PostStatus.DRAFT : PostStatus.PUBLISHED,
        publishedAt: index === posts.length - 1 ? null : new Date(Date.now() - index * 86_400_000),
        authorId: admin.id,
        categoryId: categoryRows.get(post.category)!,
      },
    });
  }

  await prisma.menu.createMany({
    data: [
      { label: "Home", path: "/", order: 1 },
      { label: "News", path: "/news", order: 2 },
      { label: "Admissions", path: "/admissions", order: 3 },
      { label: "Programs", path: "/programs", order: 4 },
      { label: "Faculty", path: "/faculty", order: 5 },
      { label: "Contact", path: "/contact", order: 6 },
    ],
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
