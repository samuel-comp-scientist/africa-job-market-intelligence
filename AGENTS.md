# AGENTS.md

## Project Overview

African Job Market Intelligence Platform — a monorepo with 3 independent components sharing a MongoDB database. No root package manager, no CI/CD, no workspace tooling.

```
backend/        — Express.js API (Node.js, CommonJS)  → port 5000
frontend/       — Next.js 16 App Router (TypeScript)  → port 3000
data-science/   — Python scraping + ML pipeline
data/           — Local MongoDB WiredTiger data store (git-tracked, do not edit)
docs/           — ARCHITECTURE.md, API.md
```

## Developer Commands

### Backend (`backend/`)
```
npm install              # install deps
cp .env.example .env     # create env file (must do before first run)
npm run init-db          # initialize DB schema + seed sample data
npm run dev              # start with nodemon (port 5000)
npm start                # production start
npm test                 # jest
npm run lint             # eslint
```

### Frontend (`frontend/`)
```
npm install
npm run dev              # Next.js dev server (port 3000)
npm run build            # production build
npm run type-check       # tsc --noEmit
npm run lint             # eslint
```

### Data Science (`data-science/`)
```
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python main.py             # full pipeline: scrape → analyze → predict → store
```

## Architecture & Boundaries

- **Not a unified monorepo** — each directory has its own `package.json` / `requirements.txt`. Always `cd` into the component before running commands.
- **Backend entry point**: `backend/server.js` (CommonJS, `require()`). Exports `app` for testing.
- **Frontend entry point**: `frontend/src/app/page.tsx` (Next.js App Router).
- **Data-science entry point**: `data-science/main.py`.
- **Backend uses CommonJS**, frontend uses ESM + TypeScript. Do not mix module syntax within a component.

## Backend Structure
```
backend/
  server.js           — Express app, MongoDB connect, auto-creates default admin on startup
  routes/             — REST route handlers (auth, jobs, skills, salaries, trends, admin, ai, user, visualization, dashboard)
  controllers/        — Business logic
  models/             — Mongoose schemas (User, Job, Company, Skill, SkillTrends, SalaryAnalytics, Prediction, ScraperLog)
  middleware/         — auth.js (JWT verify), validation.js (Joi)
  scrapers/           — Puppeteer/Axios-based job scrapers + scheduler (node-cron)
  ai/                 — AI career advisor, resume analyzer, forecasting modules
  services/           — Reusable service layer
  utils/              — databaseInit.js (run via `npm run init-db`), emailService.js
```

## Frontend Structure
```
frontend/src/app/
  page.tsx            — Landing page
  login/              — Auth pages
  signup/
  dashboard/          — User dashboards
  analytics/
  skills-heatmap/
  career-advisor/
  resume-analyzer/
```
- Uses Ant Design (`antd`) + TailwindCSS v4 + Recharts + Lucide icons.
- Path aliases: `@/*` → `./src/*`, `@/components/*`, `@/types/*`, etc.
- React Compiler enabled in `next.config.ts`.
- No test framework configured.

## Data Science Structure
```
data-science/
  main.py             — Pipeline orchestrator
  scraper/job_scraper.py    — Web scraping (selenium, bs4)
  analysis/data_analyzer.py  — Pandas-based analysis
  models/skill_predictor.py  — scikit-learn predictions
  utils/database.py          — pymongo MongoDB client
```

## Environment & Setup

- **Backend** requires `.env` (copy from `.env.example`). Key vars: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`.
- **Data-science** requires `.env` (copy from `.env.example`). Key var: `MONGODB_URI`.
- **Frontend** uses standard Next.js env loading. No `.env.example` committed.
- MongoDB can be local (`data/` directory has a local WiredTiger store) or Atlas (URI in `.env`).
- Backend auto-creates a default admin user on startup if not present (`server.js:60-140`).

## Testing

- Backend uses **Jest** + **Supertest**. Run: `cd backend && npm test`.
- Frontend has **no test framework** installed.
- Data-science has **no test suite**.

## Important Gotchas

- **No root-level scripts** — there is no workspace-level `package.json` or task runner. Every command must be run from within its component directory.
- **`data/` directory** at repo root is a live MongoDB data directory (WiredTiger files). It is tracked by git. Do not manually edit these files.
- **Hardcoded admin credentials** exist in `server.js` — this is development-only behavior.
- **Scrapers use Puppeteer** — may require Chrome/Chromium to be available. Puppeteer auto-downloads Chromium by default.
- **Frontend expects backend at port 5000** — CORS is configured for `http://localhost:3000` by default. If you change ports, update `FRONTEND_URL` in backend `.env`.
- **Next.js 16** with `reactCompiler: true` — some React patterns may behave differently than older versions.

## Reference Docs

- `docs/ARCHITECTURE.md` — System architecture, data flow, API endpoints
- `docs/API.md` — API documentation
- `backend/SETUP.md` — Backend setup guide
- `backend/SCRAPER_DOCUMENTATION.md` — Scraper system docs
