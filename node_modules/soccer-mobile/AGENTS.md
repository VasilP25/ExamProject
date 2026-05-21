# Mobile Application Agents Instructions (Expo)

## Framework

- Use Expo as the main development framework.
- Use React Native through Expo managed workflow.
- Prefer Expo SDK APIs instead of custom native modules.
- Avoid ejecting unless absolutely necessary.

---

## Architecture

- Prefer component-based architecture.
- Keep screens small and focused.
- Extract reusable UI into shared components.
- Move business logic into hooks and services.
- Avoid putting logic directly inside screens.

---

## Navigation

- Use a clear navigation structure (stack / tab navigation).
- Keep navigation logic separate from UI components.
- Avoid deeply nested navigation stacks.
- Keep route definitions organized and readable.

---

## Styling

- Use a consistent styling approach across the app.
- Prefer reusable components for UI consistency.
- Ensure responsive design for different screen sizes.
- Avoid duplicated styles.
- Prefer Expo-compatible styling solutions.

---

## Data Handling

- All API calls must go through a separate service layer.
- Do not fetch data directly inside UI components when avoidable.
- Keep state predictable and minimal.
- Separate data logic from presentation logic.

---

## State Management

- Prefer local state when possible.
- Use global state only when necessary.
- Keep state structure simple and scalable.
- Avoid overengineering state management.

---

## Performance (Expo specific)

- Use FlatList for large lists.
- Avoid unnecessary re-renders.
- Optimize image usage using Expo Image tools.
- Lazy load screens when possible.
- Avoid heavy computations in render functions.

---

## Backend Integration

- Use Neon serverless PostgreSQL as database (via API layer only).
- Use Drizzle ORM only in backend/API, never in mobile app directly.
- Mobile app must NEVER access database directly.
- All data must go through API endpoints (REST or similar).

---

## Expo Rules

- Prefer Expo SDK modules (camera, image picker, notifications, etc.).
- Avoid native modules unless required.
- Use EAS Build for production builds.
- Keep app compatible with Expo Go when possible.
- Manage environment variables using Expo config.

---

## TypeScript

- Use strict TypeScript.
- Avoid `any`.
- Reuse shared types across web and backend.
- Keep types consistent with API responses.

---

## Code Quality

- Keep code modular and readable.
- Prefer composition over duplication.
- Avoid tight coupling between UI and logic.
- Follow consistent naming conventions.

---

## Important

- Prioritize smooth mobile UX.
- Keep the app fast and responsive.
- Prefer simplicity over overengineering.
- Optimize for real device performance, not just emulators.
