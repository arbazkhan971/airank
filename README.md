<div align="center">

# AIRank

### AI Usage Analytics & Team Evaluation Platform

[![Built on ccrank](https://img.shields.io/badge/built%20on-ccrank.dev-8B5CF6?style=for-the-badge)](https://github.com/makash/ccrank)
[![Open Source](https://img.shields.io/badge/open%20source-MIT-green?style=for-the-badge)](LICENSE)

**Track Claude Code & Codex CLI usage across your team. Evaluate productivity. Ship faster.**

Built on top of [ccrank](https://github.com/makash/ccrank) by [Akash Mahajan](https://github.com/makash).

</div>

---

> **Credit & Attribution**
>
> This project is a fork of [**ccrank**](https://github.com/makash/ccrank) (also live at [ccrank.dev](https://ccrank.dev)), originally created by [**Akash Mahajan** (@makash)](https://github.com/makash). The entire foundation — leaderboard, usage tracking, social cards, invite system, and the beautiful dark UI — was built by Akash, famously on a phone using Claude Code.
>
> AIRank extends ccrank with team evaluation features, dual-platform support (Claude Code + OpenAI Codex CLI), credential-based auth, Docker self-hosting, and a setup wizard. We're grateful to Akash for open-sourcing ccrank and making this possible.
>
> **Original project:** [github.com/makash/ccrank](https://github.com/makash/ccrank) | [ccrank.dev](https://ccrank.dev)
>
> **Powered by:** [ccusage](https://github.com/ryoppippi/ccusage) by [ryoppippi](https://github.com/ryoppippi)

---

## What's Different from ccrank?

| Feature | ccrank | AIRank |
|---------|--------|--------|
| Claude Code tracking | Yes | Yes |
| OpenAI Codex CLI tracking | - | Yes |
| Platform breakdown (Claude vs Codex) | - | Yes |
| Google OAuth login | Yes | Yes |
| Credential-based auth (email/password) | - | Yes |
| Admin-created team accounts | - | Yes |
| Setup wizard | - | Yes |
| Docker self-hosting | - | Yes |
| Export API | - | Yes |
| Cloudflare Workers deployment | Yes | Yes |
| Invite system | Yes | Yes |
| Social cards & sharing | Yes | Yes |
| Leaderboard + time filters | Yes | Yes |

---

## Features

| | Feature | Description |
|---|---|---|
| :trophy: | **Leaderboard** | Ranked by cost, tokens, output/$, cache rate, output ratio |
| :robot: | **Dual Platform** | Track both Claude Code and OpenAI Codex CLI usage side-by-side |
| :bar_chart: | **Platform Breakdown** | See Claude vs Codex split on profiles and dashboards |
| :busts_in_silhouette: | **Team Evaluation** | Admin-created accounts, credential auth, team management |
| :clock3: | **Time-Travel History** | Daily, weekly, monthly snapshots with platform filters |
| :frame_with_picture: | **Social Cards** | Shareable SVG/PNG stats cards for Twitter/LinkedIn |
| :whale: | **Docker Self-Hosting** | One-command deploy with Docker Compose |
| :magic_wand: | **Setup Wizard** | Guided first-run configuration |
| :outbox_tray: | **Export API** | Export team usage data programmatically |
| :computer: | **Multi-Machine** | Aggregate usage across laptops, desktops, cloud instances |
| :medal_sports: | **Gamified Titles** | Apprentice → Practitioner → Power User → Token Whale → Claude Maximalist |
| :new_moon: | **Dark Theme** | Beautiful dark UI, fully responsive |

---

## Quick Start

### Option 1: Cloudflare Workers (Free)

```bash
git clone https://github.com/arbazkhan971/airank.git
cd airank
npm install
npx wrangler login
npx wrangler d1 create claude-leaderboard-db
# Update database_id in wrangler.toml
npm run db:migrate
npm run deploy
```

### Option 2: Docker Self-Hosting

```bash
git clone https://github.com/arbazkhan971/airank.git
cd airank
docker compose up -d
```

Visit the setup wizard at `http://localhost:8787` to configure.

---

## CLI Usage

The CLI uploads usage data from both platforms automatically:

```bash
# Install and run
ccrank-git --url https://your-instance.com --token YOUR_TOKEN
```

It runs both `npx ccusage@latest daily --json` (Claude Code) and `npx @ccusage/codex@latest daily --json` (Codex CLI), uploading whatever data is available.

### Manual upload

```bash
# Claude Code
npx ccusage@latest daily --json > report.json

# Codex CLI
npx @ccusage/codex@latest daily --json > report.json
```

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/leaderboard` | No | Leaderboard with platform filters |
| `GET` | `/history` | No | Historical rankings with platform filters |
| `GET` | `/user/:slug` | No | Public user profile with platform breakdown |
| `POST` | `/api/upload` | Token | Upload usage JSON (auto-detects platform) |
| `GET` | `/api/leaderboard` | No | Leaderboard JSON (`?platform=claude\|codex`) |
| `GET` | `/api/me` | Token | Current user stats + platform breakdown |
| `GET` | `/api/export` | Admin | Export team data |

---

## Project Structure

```
src/
  index.ts        Hono routes, middleware, API endpoints
  auth.ts         Sessions, Google OAuth, credential auth
  parser.ts       ccusage JSON parser with platform detection
  html.ts         Dark-themed HTML templates (Tailwind CSS)
  utils.ts        Shared types and utilities
  card.ts         Social card SVG generation (satori)
cli/
  ccrank-git/     Go CLI for git metadata + dual-platform upload
migrations/
  0001-0009       Database schema evolution
```

---

## Acknowledgments

This project stands on the shoulders of:

<table>
  <tr>
    <td align="center" width="200">
      <a href="https://github.com/makash/ccrank">
        <img src="https://github.com/makash.png" width="60" style="border-radius: 50%;" /><br />
        <b>Akash Mahajan</b><br />
        <sub>@makash</sub>
      </a><br /><br />
      <sub>Creator of <a href="https://ccrank.dev">ccrank.dev</a> — the original Claude Code leaderboard. Built the entire foundation this project is based on. Built on a phone with Claude Code.</sub>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/ryoppippi/ccusage">
        <img src="https://github.com/ryoppippi.png" width="60" style="border-radius: 50%;" /><br />
        <b>ryoppippi</b>
      </a><br /><br />
      <sub>Creator of <a href="https://github.com/ryoppippi/ccusage">ccusage</a> and <a href="https://www.npmjs.com/package/@ccusage/codex">@ccusage/codex</a> — the CLI tools that make usage tracking possible for both Claude Code and Codex CLI.</sub>
    </td>
  </tr>
</table>

### Built With

- [ccrank](https://github.com/makash/ccrank) — The original Claude Code leaderboard by [@makash](https://github.com/makash)
- [ccusage](https://github.com/ryoppippi/ccusage) — Claude Code usage analyzer by [@ryoppippi](https://github.com/ryoppippi)
- [@ccusage/codex](https://www.npmjs.com/package/@ccusage/codex) — Codex CLI usage analyzer
- [Hono](https://hono.dev) — Lightweight web framework
- [Cloudflare Workers](https://workers.cloudflare.com) + [D1](https://developers.cloudflare.com/d1/) — Serverless edge compute + SQLite
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Satori](https://github.com/vercel/satori) — SVG generation for social cards

---

## Contributing

Contributions welcome! Please open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

This project is a derivative work of [ccrank](https://github.com/makash/ccrank) by [Akash Mahajan](https://github.com/makash), also licensed under MIT.

---

<div align="center">
  <sub>
    Built on <a href="https://github.com/makash/ccrank">ccrank</a> by <a href="https://github.com/makash">@makash</a> &middot;
    Powered by <a href="https://github.com/ryoppippi/ccusage">ccusage</a> by <a href="https://github.com/ryoppippi">ryoppippi</a>
  </sub>
</div>
