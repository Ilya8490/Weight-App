# Health Metrics Dashboard

Health Metrics Dashboard is a full-stack monorepo for tracking body metrics, visualizing trends, and surfacing practical recommendations. It pairs a premium React dashboard with a type-safe Express + Prisma API, localized in English and Ukrainian, and ships with deployment-ready structure for Vercel and Render or Railway.

## Highlights

- JWT authentication with HTTP-only cookies
- Body metric calculations for BMI, ideal weight, BMR, and daily calories
- Historical metric tracking stored in PostgreSQL via Prisma
- Recharts-powered weight trend visualization
- Rule-based health insights
- Dark mode, localization, loading states, and polished responsive UI
- Guest mode with browser-only history for instant testing
- Shared TypeScript package for calculations and API-facing types

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Zustand, React Hook Form, Recharts, i18next, Framer Motion
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt
- Deployment: Vercel for frontend, Render or Railway for backend

## Monorepo Structure

```text
apps/
  backend/   Express API + Prisma
  frontend/  React dashboard
packages/
  shared/    Shared calculations and types
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `apps/backend/.env` from the example below:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_metrics"
JWT_SECRET="replace-with-a-strong-secret"
CLIENT_URL="http://localhost:5173"
PORT=4000
NODE_ENV="development"
```

Create `apps/frontend/.env`:

```bash
VITE_API_URL="http://localhost:4000"
```

### 3. Generate Prisma client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start both apps

In separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

### 5. Create a demo account with sample history

```bash
npm run prisma:seed
```

Demo credentials:

- Email: `demo@healthmetrics.app`
- Password: `Demo123456`

The seed command automatically runs Prisma client generation first and loads `apps/backend/.env`, so you can use it safely after configuring your database.

### Guest mode

You can also explore the dashboard without creating an account by choosing `Continue as guest` on the auth screen. Guest entries are stored only in the current browser.

## API Routes

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Metrics

- `GET /metrics/history`
- `POST /metrics/entry`

## Deployment

### Frontend on Vercel

- Root directory: `apps/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL`

### Backend on Render or Railway

- Root directory: `apps/backend`
- Build command: `npm install && npm run prisma:generate && npm run build`
- Start command: `npm run start`
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`, `PORT`

## Portfolio Notes

This project was designed to feel production-ready rather than tutorial-like:

- shared business logic package
- typed API contracts
- modular dashboard components
- localized product copy
- animated but restrained UI with recruiter-facing visual polish
