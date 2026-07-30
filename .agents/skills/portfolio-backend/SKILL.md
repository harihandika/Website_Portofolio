---
name: portfolio-backend
description: Guidelines for working on the NestJS backend and Prisma ORM in the Website_Portofolio project.
---

# Backend Guidelines for Website_Portofolio

When working on the backend (`apps/api`), strictly adhere to the following rules:

1. **Context**: The backend is a NestJS application using Prisma ORM and PostgreSQL.
2. **Execution**: All backend commands (e.g., `npm run start:dev`, `npm install`) must be executed inside the `apps/api` directory.
3. **Database Changes**: 
   - If you modify `apps/api/prisma/schema.prisma`, you MUST run `npm run prisma:generate` to update the Prisma client.
   - For migrations, use `npm run prisma:migrate -- --name <migration_name>`.
   - Seed data is managed in `apps/api/prisma/seed.ts`. Use `npm run prisma:seed` to apply.
4. **Validation**: Use `class-validator` and `class-transformer` for DTOs.
5. **Auth**: Endpoints modifying data must use the JWT auth guard to ensure only the admin can access them.
