# ExamProject

Cars marketplace monorepo with a Next.js web app, an Expo mobile app, and a shared package.

## Structure

```txt
ExamProject/
  cars-web/      Next.js web app and API routes
  cars-mobile/   Expo mobile app
  cars-shared/   Shared TypeScript package
  package.json   npm workspaces root
```

## Main Features

- User registration and login with JWT stored in httpOnly cookies.
- Users can create, view, delete, like, and comment on car ads.
- Users cannot like their own ads.
- Admins can delete ads/comments and restore deleted comments.
- Admins cannot create or like ads.
- User profile page shows the logged-in user's information and created ads.
- Highlights page shows the most liked, most commented, and most expensive ads.
- Mobile app reads car data from the web app API.

## Tech Stack

- Monorepo: npm workspaces
- Web: Next.js App Router, React, TypeScript, Tailwind CSS
- Mobile: Expo SDK 54, Expo Router, React Native
- Database: Neon serverless PostgreSQL
- ORM: Drizzle ORM
- Authentication: JWT

## Environment

Create environment files before running the web app.

Root `.env` or `cars-web/.env.local`:

```env
DATABASE_URL="your_neon_database_url"
JWT_SECRET="your_long_random_secret"
```

Do not commit `.env` files. They are ignored by `.gitignore`.

For Expo on a physical phone, the mobile app auto-detects the computer LAN IP from Expo. You can override the API URL:

```env
EXPO_PUBLIC_API_BASE_URL="http://YOUR_COMPUTER_IP:3000"
```

## Install

Run dependencies from the repository root:

```bash
npm install
```

## Development

Start the web app:

```bash
npm run dev:web
```

Start the Expo app:

```bash
npm run dev:mobile
```

The web app runs on port `3000`. It is configured to listen on the local network so Expo Go can reach it from a phone on the same Wi-Fi.

## Useful Scripts

```bash
npm run dev:web       # Start Next.js web app
npm run dev:mobile    # Start Expo app
npm run build:web     # Build web app
npm run lint          # Run lint in workspaces
```

Web-only database scripts:

```bash
npm run db:generate --workspace=cars-web
npm run db:migrate --workspace=cars-web
npm run db:seed --workspace=cars-web
```

## Important Notes

- Run `npm install` only from the root.
- Keep only the root Git repository.
- Do not commit `node_modules`, `.next`, `.expo`, build folders, logs, or environment files.
- Mobile API calls go through `cars-web` API routes.
- Database and authentication logic should stay in `cars-web`, not in `cars-mobile`.
