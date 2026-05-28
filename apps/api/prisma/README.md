# Portfolio Database

This folder contains the Prisma database design for the Hari Handika portfolio application.

## Environment

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hari_portfolio?schema=public"
ADMIN_EMAIL="admin@harihandika.dev"
ADMIN_PASSWORD="ChangeMe123!"
```

Use a strong `ADMIN_PASSWORD` in production. The seed value above is only for local development.

## Migration

From `apps/api`, install Prisma dependencies in the backend project:

```bash
npm install @prisma/client bcrypt
npm install -D prisma tsx @types/bcrypt
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create the first PostgreSQL migration:

```bash
npx prisma migrate dev --name init_portfolio_schema
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

## Seed

Run the seed file after the migration:

```bash
npx tsx prisma/seed.ts
```

Recommended `package.json` scripts for the NestJS backend:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  }
}
```

## Notes For NestJS Integration

- `User` is only for admin authentication.
- Store `User.password` as a bcrypt hash, never plain text.
- Use `Project.slug` for public project detail pages.
- Use `ProjectTechStack` as the explicit many-to-many join table between `Project` and `TechStack`.
- Query public projects ordered by `displayOrder`, then `createdAt`.
- Query skills grouped by `category`, ordered by `displayOrder`.
- Query experience timeline ordered by `displayOrder`, then `startDate` descending.
- Keep `ContactMessage.status` internal to admin workflows.
