# Hari Handika Setiawan Portfolio Web

Next.js frontend foundation for the Hari Handika Setiawan portfolio application.

This step only prepares the frontend foundation. Public pages, admin pages, data fetching screens, and form workflows are intentionally not implemented yet.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui configuration
- Framer Motion
- React Hook Form
- Zod

## Folder Structure

```text
apps/web
├── src
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── ui
│   │       └── button.tsx
│   └── lib
│       ├── api.ts
│       └── utils.ts
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env.local
```

Set the backend API URL:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## shadcn/ui

The shadcn/ui config is in `components.json`. Shared helpers live in `src/lib/utils.ts`, and generated UI components should go under `src/components/ui`.

Example add command after dependencies are installed:

```bash
npx shadcn@latest add input textarea card form
```
