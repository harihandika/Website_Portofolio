# Hari Handika Setiawan Portfolio API

NestJS backend foundation for the Hari Handika Setiawan portfolio application.

This step only prepares the backend foundation. Business modules such as auth, profile, projects, skills, experiences, and contact are intentionally not implemented yet.

## Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator and class-transformer
- JWT package for the future auth module
- bcrypt for the future admin password flow

## Folder Structure

```text
apps/api
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── README.md
├── src
│   ├── config
│   │   └── env.validation.ts
│   ├── health
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection and secure secrets:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hari_portfolio?schema=public"
NODE_ENV="development"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=12
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run the first migration:

```bash
npm run prisma:migrate -- --name init_portfolio_schema
```

Seed initial data:

```bash
npm run prisma:seed
```

Start the API:

```bash
npm run start:dev
```

This foundation uses `tsc` and `ts-node` directly, so it does not require the Nest CLI to run locally.

Health check:

```text
GET http://localhost:4000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "hari-portfolio-api",
  "uptime": 12.34,
  "timestamp": "2026-05-12T08:00:00.000Z"
}
```

## Auth Endpoints

Admin authentication is implemented with JWT, Passport, bcrypt, and Prisma.

```text
POST http://localhost:4000/api/auth/login
GET  http://localhost:4000/api/auth/me
```

Login request:

```json
{
  "email": "admin@harihandika.dev",
  "password": "ChangeMe123!"
}
```

Use the returned access token as a bearer token for `/api/auth/me`.

## Available Scripts

```bash
npm run build
npm run start:dev
npm run start:prod
npm run test
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run prisma:studio
```

## Production Notes

- Set `NODE_ENV=production`.
- Use a managed PostgreSQL database such as Railway PostgreSQL or Neon.
- Use a long random `JWT_SECRET`.
- Restrict `CORS_ORIGIN` to the deployed frontend domain.
- Run `npm run prisma:deploy` during backend deployment.
