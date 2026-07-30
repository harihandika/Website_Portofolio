---
name: portfolio-frontend
description: Guidelines for working on the Next.js App Router frontend in the Website_Portofolio project.
---

# Frontend Guidelines for Website_Portofolio

When working on the frontend (`apps/web`), strictly adhere to the following rules:

1. **Context**: The frontend uses Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.
2. **Execution**: All frontend commands (e.g., `npm run dev`, `npm install`) must be executed inside the `apps/web` directory.
3. **Styling**: Always use Tailwind CSS utility classes. Avoid creating custom CSS unless absolutely necessary.
4. **Forms**: Use `React Hook Form` combined with `Zod` for form validation.
5. **Animations**: Use `framer-motion` for complex UI interactions and page transitions.
6. **API Calls**: The frontend connects to the NestJS API running on `http://localhost:4000/api`. Read the environment variable `NEXT_PUBLIC_API_URL`.
