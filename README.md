# Hari Handika Setiawan Personal Portfolio Website

Panduan ini menjelaskan cara menggunakan, menjalankan, melakukan migrasi database Prisma, dan mengisi data awal untuk aplikasi portfolio Hari Handika Setiawan.

## Ringkasan Aplikasi

Aplikasi ini terdiri dari dua bagian:

- `apps/api`: backend NestJS, Prisma ORM, PostgreSQL, JWT, bcrypt.
- `apps/web`: frontend Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod.

Fitur utama:

- Public portfolio: Home, About, Experience, Skills, Projects, Project Detail, Contact.
- Admin: Login, Dashboard, Profile, Projects, Skills, Experiences, Messages.
- Database dinamis menggunakan PostgreSQL dan Prisma.

## Prasyarat

Pastikan sudah tersedia:

- Node.js 20 atau versi LTS yang kompatibel.
- PostgreSQL lokal atau database managed seperti Railway PostgreSQL / Neon.
- npm.

Catatan environment lokal:

- Jika install package dari npm registry gagal karena policy jaringan, gunakan dependency cache/lokal yang tersedia atau registry alternatif.
- Jalankan command dari folder aplikasi yang sesuai, karena `apps/api` dan `apps/web` punya `package.json` masing-masing.

## Struktur Folder

```text
Portofolio_CV_Hari
+-- apps
|   +-- api
|   |   +-- prisma
|   |   |   +-- schema.prisma
|   |   |   +-- seed.ts
|   |   +-- src
|   +-- web
|       +-- src
+-- README.md
```

## Setup Backend

Masuk ke folder backend:

```bash
cd apps/api
```

Install dependency:

```bash
npm install
```

Buat file `.env` dari contoh:

```bash
copy .env.example .env
```

Contoh isi `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hari_portfolio?schema=public"
NODE_ENV="development"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=12
ADMIN_EMAIL="admin@harihandika.dev"
ADMIN_PASSWORD="ChangeMe123!"
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Jalankan migrasi database:

```bash
npm run prisma:migrate -- --name init_portfolio_schema
```

Isi data awal:

```bash
npm run prisma:seed
```

Jalankan backend:

```bash
npm run start:dev
```

API berjalan di:

```text
http://localhost:4000/api
```

Health check:

```text
GET http://localhost:4000/api/health
```

## Setup Frontend

Masuk ke folder frontend:

```bash
cd apps/web
```

Install dependency:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:3000
```

## Urutan Menjalankan Aplikasi Lokal

1. Jalankan PostgreSQL.
2. Jalankan migrasi Prisma dari `apps/api`.
3. Jalankan seed Prisma dari `apps/api`.
4. Jalankan backend di port `4000`.
5. Jalankan frontend di port `3000`.
6. Login admin melalui `/admin/login`.

Contoh alur command:

```bash
cd apps/api
npm run prisma:generate
npm run prisma:migrate -- --name init_portfolio_schema
npm run prisma:seed
npm run start:dev
```

Buka terminal lain:

```bash
cd apps/web
npm run dev
```

## Login Admin

Halaman login:

```text
http://localhost:3000/admin/login
```

Credential default dari seed:

```text
Email: admin@harihandika.dev
Password: ChangeMe123!
```

Untuk production, ubah `ADMIN_EMAIL` dan `ADMIN_PASSWORD` sebelum menjalankan seed.

## Endpoint Utama

Public:

```text
GET  /api/profile
GET  /api/projects
GET  /api/projects/featured
GET  /api/projects/:slug
GET  /api/skills
GET  /api/experiences
POST /api/contact
```

Admin:

```text
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/profile
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
POST   /api/skills
PATCH  /api/skills/:id
DELETE /api/skills/:id
POST   /api/experiences
PATCH  /api/experiences/:id
DELETE /api/experiences/:id
GET    /api/contact/messages
PATCH  /api/contact/messages/:id/read
DELETE /api/contact/messages/:id
```

Admin endpoint membutuhkan JWT token dari `POST /api/auth/login`.

## Prisma Migration

File schema utama:

```text
apps/api/prisma/schema.prisma
```

Validasi schema:

```bash
cd apps/api
npm run prisma:validate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Buat migration baru saat schema berubah:

```bash
npm run prisma:migrate -- --name nama_perubahan_schema
```

Contoh:

```bash
npm run prisma:migrate -- --name add_project_case_study_fields
```

Apply migration di production:

```bash
npm run prisma:deploy
```

Buka Prisma Studio:

```bash
npm run prisma:studio
```

Reset database lokal jika perlu:

```bash
npx prisma migrate reset
```

Perintah reset akan menghapus data lokal, menjalankan ulang migration, dan biasanya menawarkan untuk menjalankan seed.

## Data Yang Dimigrate Dengan Prisma

Model database yang dibuat melalui Prisma migration:

1. `User`
   - Untuk admin login.
   - Kolom utama: `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`.
   - Table: `users`.

2. `Profile`
   - Data personal Hari Handika Setiawan.
   - Kolom utama: `fullName`, `headline`, `bio`, `email`, `phone`, `location`, `githubUrl`, `linkedinUrl`, `cvUrl`, `photoUrl`.
   - Table: `profiles`.

3. `Project`
   - Data project portfolio dan case study.
   - Kolom utama: `title`, `slug`, `summary`, `description`, `problem`, `solution`, `impact`, `imageUrl`, `demoUrl`, `githubUrl`, `isFeatured`, `displayOrder`.
   - Table: `projects`.

4. `Skill`
   - Data skill yang ditampilkan per kategori.
   - Kolom utama: `name`, `category`, `level`, `displayOrder`.
   - Table: `skills`.

5. `TechStack`
   - Master teknologi untuk project.
   - Kolom utama: `name`, `category`, `displayOrder`.
   - Table: `tech_stacks`.

6. `ProjectTechStack`
   - Relasi many-to-many antara `Project` dan `TechStack`.
   - Kolom utama: `projectId`, `techStackId`.
   - Table: `project_tech_stacks`.

7. `Experience`
   - Timeline pengalaman kerja/proyek.
   - Kolom utama: `company`, `role`, `location`, `startDate`, `endDate`, `isCurrent`, `description`, `achievements`, `displayOrder`.
   - Table: `experiences`.

8. `ContactMessage`
   - Pesan dari visitor.
   - Kolom utama: `name`, `email`, `subject`, `message`, `status`.
   - Table: `contact_messages`.

## Data Awal Dari Seed

File seed:

```text
apps/api/prisma/seed.ts
```

Data yang diisi oleh seed:

- Admin user:
  - Email dari `ADMIN_EMAIL`, default `admin@harihandika.dev`.
  - Password dari `ADMIN_PASSWORD`, default `ChangeMe123!`.
  - Password disimpan dalam bentuk bcrypt hash.

- Profile:
  - Nama, headline, bio, email, phone, location, GitHub, LinkedIn, CV URL, photo URL.

- Tech stack:
  - Next.js, React, TypeScript, Tailwind CSS, NestJS, Prisma ORM, PostgreSQL, JWT, Docker, Railway.

- Projects:
  - ProcureFlow ERP.
  - Transfer Request Portal.
  - Hari Handika Setiawan Portfolio.

- Skills:
  - Frontend: Next.js, React, Tailwind CSS, Framer Motion.
  - Backend: NestJS, REST API Design, JWT Authentication.
  - Database: Prisma ORM, PostgreSQL, Schema Design.
  - Cloud & DevOps: Docker, Railway, Vercel.
  - Integration: API Integration, ERP Workflow Modeling.

- Experiences:
  - Freelance / Portfolio Projects.
  - Internal Business Application Project.

Seed bersifat idempotent untuk data utama karena menggunakan `upsert` pada admin, profile, tech stack, projects, skills, dan experiences.

## Alur Migrasi Saat Development

Saat menambah atau mengubah model database:

1. Edit `apps/api/prisma/schema.prisma`.
2. Jalankan validasi:

```bash
npm run prisma:validate
```

3. Buat migration:

```bash
npm run prisma:migrate -- --name nama_migration
```

4. Generate client:

```bash
npm run prisma:generate
```

5. Jika perlu, update `apps/api/prisma/seed.ts`.
6. Jalankan seed:

```bash
npm run prisma:seed
```

7. Jalankan backend:

```bash
npm run start:dev
```

8. Test dari frontend atau API client.

## Deployment Singkat

Backend Railway:

```bash
npm run build
npm run prisma:deploy
npm run start:prod
```

Frontend Vercel:

```env
NEXT_PUBLIC_API_URL="https://backend-production-url/api"
```

Database:

- Gunakan Railway PostgreSQL atau Neon PostgreSQL.
- Set `DATABASE_URL` di backend environment.
- Jalankan `prisma migrate deploy` saat release.

## Troubleshooting

Jika backend tidak bisa connect database:

- Pastikan PostgreSQL berjalan.
- Pastikan `DATABASE_URL` benar.
- Pastikan database `hari_portfolio` sudah dibuat jika menggunakan PostgreSQL lokal.

Jika admin login gagal:

- Pastikan `npm run prisma:seed` sudah dijalankan.
- Pastikan email/password sesuai env seed.
- Jika password env diubah, jalankan ulang seed.

Jika frontend tidak mendapat data:

- Pastikan backend berjalan di `http://localhost:4000/api`.
- Pastikan `NEXT_PUBLIC_API_URL` di `apps/web/.env.local` benar.
- Pastikan CORS backend mengizinkan `http://localhost:3000`.

Jika Prisma Client tidak sinkron:

```bash
cd apps/api
npm run prisma:generate
```

Jika migration production:

- Jangan gunakan `migrate dev` di production.
- Gunakan:

```bash
npm run prisma:deploy
```
