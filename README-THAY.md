# Lightweight University CMS - Huong dan nop va demo

## 1. Gioi thieu

Du an xay dung he quan tri noi dung cho website Khoa Khoa hoc va Ky thuat May tinh. Noi dung demo duoc bien tap theo file RSS `it.hcmiu.edu.vn.txt`, gom tin tuyen sinh, thong bao hoc vu, video, thuc tap, chuong trinh va thong tin lien he/vi tri.

## 2. Chuc nang public

- Trang chu co logo HCMIU, hero slider tu dong, nut mui ten trai/phai va nut tron chuyen slide.
- Header co dropdown kieu website goc cho Programs va Explore.
- Tin tuc, thong bao, tuyen sinh, chuong trinh, nhan su, lien he, tim kiem.
- Bai viet co thumbnail, noi dung HTML, video YouTube iframe, link, dia diem va thong tin lien he.
- Trang lien he co thong tin van phong va ban do Google Maps.
- Giao dien responsive cho desktop va dien thoai.

## 3. Chuc nang CMS Admin

- Dang nhap Admin/User.
- Dashboard thong ke bai viet, draft, user, media, category.
- Quan ly bai viet: tao, sua, xoa, draft/publish, thumbnail, SEO title, SEO description.
- Quan ly category.
- Quan ly media: upload, edit alt text, thay hinh moi cho media da co.
- Quan ly user cho Admin.
- Muc Menus da duoc an/xoa khoi CMS Admin theo yeu cau.

## 4. Cong nghe

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Tiptap rich text editor
- Zod validation
- bcrypt password hashing
- JWT HTTP-only cookie

## 5. Cai dat va chay local

```bash
npm install
cp .env.example .env
docker-compose up -d postgres
npm run db:migrate
npm run db:seed
npm run dev
```

Mo trinh duyet:

- Website: `http://localhost:3000`
- CMS Admin: `http://localhost:3000/admin`

Neu chua co `DATABASE_URL`, app van co sample data trong bo nho de demo giao dien public.

## 6. Tai khoan demo

- Admin: `admin@scse.local` / `Admin@12345`
- User: `user@scse.local` / `User@12345`

## 7. API test nhanh

Dang nhap va luu cookie:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@scse.local\",\"password\":\"Admin@12345\"}"
```

Lay thong tin session:

```bash
curl -b cookies.txt http://localhost:3000/api/auth/me
```

Xem danh sach API:

```bash
curl http://localhost:3000/api/docs
```

Lay danh sach bai viet:

```bash
curl http://localhost:3000/api/posts?pageSize=10
```

Tao category:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"name\":\"Scholarships\"}"
```

Upload media:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/media \
  -H "Origin: http://localhost:3000" \
  -F "file=@./public/cms-assets/admission-2026.svg" \
  -F "alt=Admission 2026"
```

Sua media:

```bash
curl -b cookies.txt -X PUT http://localhost:3000/api/media/MEDIA_ID \
  -H "Origin: http://localhost:3000" \
  -F "alt=Updated alt text"
```

Tao bai viet:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"title\":\"Demo API Post\",\"excerpt\":\"Bai viet tao bang API de test CMS.\",\"content\":\"<p>Noi dung demo</p>\",\"status\":\"DRAFT\",\"categoryId\":\"CATEGORY_ID\"}"
```

## 8. Kiem tra

```bash
npm run lint
npm run build
```

## 9. Cau truc quan trong

- `src/app`: public pages va API routes.
- `src/components`: header, footer, hero slider, CMS shell.
- `src/lib`: repository, auth, validators, sample data.
- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: du lieu seed demo.
- `public/cms-assets`: logo va anh minh hoa noi bo.
