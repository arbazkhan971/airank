# TeamEval - AI Usage Analytics & Team Evaluation Platform

Track and evaluate your team's Claude and Codex AI usage in one place.

## Features

- Claude usage tracking (tokens, costs, cache rates, models)
- Codex task tracking (completion, success rates, efficiency)
- Team management with roles (Owner, Admin, Manager, Member)
- Structured evaluations with 5-dimension scoring
- Gamified leaderboard with titles and rankings
- Reports and analytics dashboard
- API tokens for CLI-based data upload
- Multi-machine usage aggregation
- Vercel deployment ready

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + PostgreSQL
- NextAuth.js (Google OAuth)
- Tailwind CSS
- Recharts
- Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Setup

```bash
cd team-eval
npm install
cp .env.example .env
# Edit .env with your database URL and OAuth credentials
npx prisma db push
npx prisma db seed
npm run dev
```

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:3000)
- `NEXTAUTH_SECRET` - Random secret (`openssl rand -hex 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## API Endpoints

### Upload Usage Data

- `POST /api/upload/claude` - Upload Claude usage (ccusage JSON format)
- `POST /api/upload/codex` - Upload Codex task data
- Authorization: `Bearer <api-token>`

### Teams & Evaluations

- `GET/POST /api/teams` - List/create teams
- `GET/POST /api/evaluations` - List/create evaluations
- `GET /api/leaderboard` - Team leaderboard

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## License

MIT
