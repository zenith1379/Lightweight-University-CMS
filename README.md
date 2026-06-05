# Lightweight University CMS Platform

Production-ready lightweight CMS/blog platform for a university faculty website, designed as a WordPress replacement for pages similar to SCSE HCMIU.

## Features

- Public SSR website: home, news, news detail, announcements, admissions, programs, faculty, about, contact, search
- Admin CMS dashboard at `/admin`
- ADMIN/USER roles with protected API mutations
- Post drafts, publish/unpublish workflow, categories, SEO metadata, thumbnails, slugs
- Tiptap rich text editor
- Media upload endpoint using Vercel Blob in production and local URL fallback in development
- Public navigation with dropdown menus styled after the reference site
- Dynamic `sitemap.xml`, `robots.txt`, Open Graph metadata
- PostgreSQL + Prisma schema and seed data

## Tech Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Local shadcn-style reusable UI primitives
- Zustand for admin state
- Tiptap editor
- Zod validation
- bcrypt password hashing
- JWT HTTP-only session cookie compatible with Auth.js-style `AUTH_SECRET` configuration
- PostgreSQL with Prisma ORM
- Vercel, Railway/VPS, Neon/Supabase-ready deployment

## Local Development

```bash
cp .env.example .env
# Edit .env and set POSTGRES_PASSWORD, DATABASE_URL, AUTH_SECRET, JWT_SECRET.
docker-compose up -d postgres
npm install
npm run db:migrate
SEED_ADMIN_PASSWORD="<set-a-local-admin-password>" SEED_USER_PASSWORD="<set-a-local-user-password>" npm run db:seed
npm run dev
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
# Edit .env and set POSTGRES_PASSWORD, DATABASE_URL, AUTH_SECRET, JWT_SECRET.
docker-compose up -d postgres
npm install
npm run db:migrate
$env:SEED_ADMIN_PASSWORD="<set-a-local-admin-password>"
$env:SEED_USER_PASSWORD="<set-a-local-user-password>"
npm run db:seed
npm run dev
```

Open:

- Public website: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`

Default seed emails:

- Admin email: `admin@scse.local`
- User email: `user@scse.local`

The seed passwords are intentionally not hard-coded. Set `SEED_ADMIN_PASSWORD` and `SEED_USER_PASSWORD` before running `npm run db:seed`.

The app also has an in-memory sample-data fallback when `DATABASE_URL` is not set, useful for UI preview builds.

## Database Model

Core tables:

- `users`: account, role, avatar, active flag
- `posts`: title, slug, HTML content, excerpt, status, SEO fields, author, category, publish timestamp
- `categories`: post taxonomy
- `media`: uploaded image metadata
- `menus`: public navigation seed data

Relationships:

- `User` 1-to-many `Post`
- `User` 1-to-many `Media`
- `Category` 1-to-many `Post`

## API Routes

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET|POST /api/posts`
- `GET|PUT|DELETE /api/posts/:id`
- `GET|POST /api/categories`
- `GET|POST /api/media`
- `PUT /api/media/:id`
- `POST /api/upload`
- `GET|POST /api/users`
- `GET /api/dashboard`
- `GET /api/docs`

## API Smoke Tests

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@scse.local\",\"password\":\"<your-seed-admin-password>\"}"

curl -b cookies.txt http://localhost:3000/api/auth/me
curl http://localhost:3000/api/docs
curl http://localhost:3000/api/posts?pageSize=10
curl http://localhost:3000/api/categories

curl -b cookies.txt -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"title\":\"Demo API Post\",\"excerpt\":\"Created through API smoke test.\",\"content\":\"<p>Demo</p>\",\"status\":\"DRAFT\",\"categoryId\":\"CATEGORY_ID\"}"
```

## Environment Variables

Required production variables:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="long-random-secret"
JWT_SECRET="long-random-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.edu.vn"
```

Optional:

```env
BLOB_READ_WRITE_TOKEN=""
REDIS_URL=""
NEXT_PUBLIC_APP_NAME="Lightweight University CMS"
```

## Deployment

Vercel + Neon:

1. Create a Neon or Supabase PostgreSQL database.
2. Set `DATABASE_URL`, `AUTH_SECRET`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, and optionally `BLOB_READ_WRITE_TOKEN`.
3. Deploy to Vercel. `vercel-build` runs Prisma generation, migrations, and Next build.
4. Run seed once from a trusted environment if demo data is needed:

```bash
npm run db:seed
```

Docker/VPS:

```bash
docker-compose up -d --build
```

## Verification

```bash
npm run lint
npm run build
```

## Vietnamese Handoff Notes

Du an xay dung he quan tri noi dung cho website Khoa Khoa hoc va Ky thuat May tinh. Noi dung demo duoc bien tap theo file RSS cua website tham chieu, gom tin tuyen sinh, thong bao hoc vu, video, thuc tap, chuong trinh va thong tin lien he/vi tri.

Chuc nang public:

- Trang chu co logo HCMIU, hero slider tu dong, nut mui ten trai/phai va nut tron chuyen slide.
- Header co dropdown kieu website goc cho Programs va Explore.
- Tin tuc, thong bao, tuyen sinh, chuong trinh, nhan su, lien he, tim kiem.
- Bai viet co thumbnail, noi dung HTML, video YouTube iframe, link, dia diem va thong tin lien he.
- Trang lien he co thong tin van phong va ban do Google Maps.
- Giao dien responsive cho desktop va dien thoai.

Chuc nang CMS Admin:

- Dang nhap Admin/User.
- Dashboard thong ke bai viet, draft, user, media, category.
- Quan ly bai viet: tao, sua, xoa, draft/publish, thumbnail, SEO title, SEO description.
- Quan ly category.
- Quan ly media: upload, edit alt text, thay hinh moi cho media da co.
- Quan ly user cho Admin.
- Muc Menus da duoc an/xoa khoi CMS Admin theo yeu cau.
