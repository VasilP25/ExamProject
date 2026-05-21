# Agents Instructions

## General Architecture Rules

- Prefer component-based architecture.
- Avoid large monolithic files.
- Split UI into reusable components whenever possible.
- Keep components small and focused on a single responsibility.
- Reuse components instead of duplicating UI or logic.
- Shared logic should be extracted into hooks, utilities, or shared modules.

---

## Code Organization

- Separate:
  - UI components
  - business logic
  - API logic
  - utility functions
  - hooks
  - types

- Avoid putting too much logic directly inside pages.

- Prefer feature-based or modular folder structure.

---

## Next.js Rules

- Use App Router.
- Prefer Server Components unless client interactivity is needed.
- Use `"use client"` only when necessary.
- Keep API routes separated and clean.
- Optimize for performance and readability.

---

## Database Rules

- Use Neon serverless PostgreSQL as the primary database.
- Use Drizzle ORM for database access and schema management.
- Keep database queries separated from UI components.
- Prefer reusable database utilities and query functions.
- Use typed schemas and strong TypeScript integration.
- Avoid raw SQL unless absolutely necessary.
- Keep database logic clean, modular, and maintainable.

---

## TypeScript Rules

- Use TypeScript everywhere.
- Avoid `any`.
- Prefer explicit typing.
- Reuse shared types.

---

## Styling Rules

- Use Tailwind CSS for styling.
- Prefer Tailwind utility classes over custom CSS.
- Create reusable UI components for repeated patterns.
- Keep styling consistent across the project.
- Avoid duplicated styles whenever possible.
- Prefer responsive Tailwind utilities for layout and spacing.
- Use clean and maintainable class structures.

---

## Git Rules

- Keep commits small and focused.
- Do not commit:
  - node_modules
  - build folders
  - environment files

---

## Important

- Prioritize readability and maintainability.
- Prefer clean abstractions over quick hacks.
- Do not create unnecessary complexity.
