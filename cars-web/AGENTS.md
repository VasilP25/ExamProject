# Web Application Agents Instructions

## Framework

- Use Next.js App Router.
- Prefer Server Components by default.
- Use Client Components only when interactivity is required.
- Keep pages lightweight and move logic into separate components or services.

---

## Components

- Create reusable UI components whenever possible.
- Keep components small and focused.
- Avoid large page files with excessive JSX or logic.
- Shared UI should be extracted into common components.

---

## Styling

- Use Tailwind CSS exclusively for styling.
- Prefer utility-first styling.
- Avoid inline styles unless necessary.
- Keep spacing, typography, and layout consistent.
- Prefer responsive design patterns.

---

## Data Fetching

- Prefer server-side data fetching when possible.
- Keep database queries outside UI components.
- Use separate services/actions for database operations.
- Avoid unnecessary client-side fetching.

---

## Database

- Use Neon serverless PostgreSQL.
- Use Drizzle ORM for schema and queries.
- Keep schemas typed and organized.
- Separate database logic from presentation logic.

---

## File Structure

- Organize code by feature or domain when possible.
- Separate:
  - components
  - actions
  - services
  - hooks
  - types
  - database logic

---

## Performance

- Optimize unnecessary re-renders.
- Avoid overusing client components.
- Lazy load heavy components when appropriate.
- Optimize images and assets.

---

## TypeScript

- Use strict typing.
- Avoid `any`.
- Reuse shared interfaces and types.

---

## Code Quality

- Prefer readable and maintainable code.
- Avoid duplicated logic.
- Prefer composition over deeply nested logic.
- Keep functions focused and predictable.

---

## Important

- Prioritize scalability and maintainability.
- Prefer clean architecture over shortcuts.
- Keep the codebase modular and easy to extend.
