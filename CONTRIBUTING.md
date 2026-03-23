# Contributing to AIRank

Thanks for your interest in contributing! AIRank is built on [ccrank](https://github.com/makash/ccrank) by [@makash](https://github.com/makash).

## Local Development

### Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- Go 1.22+ (only for CLI binary development)

### Setup

```bash
git clone https://github.com/arbazkhan971/airank.git
cd airank
npm install

# Create local D1 database
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0001_initial.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0002_seed_invites.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0003_add_source.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0004_drop_old_index.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0005_add_sharing.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0006_add_fav_tools.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0007_add_git_metadata.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0008_add_git_machine.sql
npx wrangler d1 execute claude-leaderboard-db --local --file=migrations/0009_add_platform.sql

# Copy environment template
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your Google OAuth credentials

# Start dev server
npm run dev
```

Add `http://localhost:8787/auth/google/callback` as an authorized redirect URI in your Google Cloud Console.

### Project Structure

```
src/
  index.ts     Routes, middleware, API endpoints
  html.ts      Server-rendered HTML templates (Tailwind CSS)
  parser.ts    ccusage/codex JSON parser with platform detection
  auth.ts      Sessions, Google OAuth
  utils.ts     Shared types and formatting
  card.ts      Social card SVG generation (satori)
cli/
  ccrank-git/  Go CLI binary for git metadata + usage upload
migrations/    D1 SQLite schema migrations (run in order)
```

### Building the CLI

```bash
cd cli/ccrank-git
go build -o ccrank-git .
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Verify the build: `npx wrangler deploy --dry-run`
5. Commit with a descriptive message
6. Push and open a Pull Request

## Code Style

- TypeScript for the web app (Hono framework)
- Server-rendered HTML templates (no frontend framework)
- Tailwind CSS via CDN
- Go for the CLI binary
- SQLite (D1) for the database

## Attribution

This project is a derivative of [ccrank](https://github.com/makash/ccrank) by [Akash Mahajan](https://github.com/makash). Please maintain proper attribution in any forks or derivatives.
