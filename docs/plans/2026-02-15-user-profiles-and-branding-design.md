# User Profiles, Branding, and OG Image — Design Doc

**Date:** 2026-02-15
**Status:** Approved

---

## 1. User Profile Page (`/user/:slug`)

### Access Model
- **Opt-in public profiles** — reuses existing `sharing_enabled` + `share_slug` columns
- If sharing disabled or slug not found, return 404
- Profile owner sees all stats; public visitors see everything except total cost

### URL
- `/user/:slug` — distinct from `/card/:slug` (card is the compact shareable card)

### Layout (top to bottom)

1. **Header** — Large avatar, display name, title badge (Token Whale etc), rank pill (`#1`, `#2`, etc)
2. **Public Stats Row** — Days active, total tokens, output tokens, last active date
3. **Private Stat** — Total cost (only visible when logged in as profile owner)
4. **Activity Heatmap** — GitHub-style 52-week grid
   - Tabs: Cost | Tokens | Sessions (default: Cost)
   - Purple gradient on dark background (matching site theme)
   - Each cell = 1 day, color intensity = relative value within user's range
   - Tooltip on hover: date + value
   - Data source: `daily_usage` table grouped by date, past 365 days
   - Rendered server-side as inline HTML/CSS grid (no JS framework needed)
5. **Favorite Tools** — 3 styled pills/badges
   - Header: "Tools I can't live without"
   - Empty state: "No favorite tools set yet" (only profile owner sees "Set yours in Settings")
6. **Share on X Button** — Pre-filled tweet with rank, tools, and profile URL

### Tweet Format
```
I'm ranked #X on ccrank.dev!

My go-to Claude Code tools:
- [tool1]
- [tool2]
- [tool3]

Check your ranking: ccrank.dev/user/{slug}
```
Adapts if 0-2 tools set (omits tools section if none). Button hidden if sharing disabled.

### DB Migration (`0006_add_fav_tools.sql`)
```sql
ALTER TABLE users ADD COLUMN fav_tools TEXT DEFAULT '[]';
```
Stored as JSON array of up to 3 strings. Validated server-side.

### Settings Page Updates
- Add "Favorite Tools" section with 3 text inputs below the existing sharing toggle
- Save via existing `/api/settings/sharing` endpoint (extend payload)

---

## 2. OG Image for Website

### Approach
- User compresses existing OG image with Squoosh (target: 1200x630, <300KB)
- Uploads to Sirv (external static image host)
- Provides URL; all pages reference it in `og:image` and `twitter:image` meta tags

### Implementation
- Update `layout()` in `html.ts`: set `og:image` and `twitter:image` to Sirv URL
- Change `twitter:card` to `summary_large_image`
- Per-user `/card/:slug` pages keep their dynamic SVG OG image (override in `cardPage()`)
- Zero bundle impact

---

## 3. Homepage Branding Update

### Hero Section
- Title: **ccrank.dev** (large gradient text)
- Tagline: **"Who burns the most Claude tokens? Find out."** (playful, current vibe)
- Remove "by Akash Mahajan" text block
- Add subtle: "by [@makash](https://x.com/makash?utm_source=ccrank&utm_medium=web)" in small gray text

### Nav Bar
- Change "Claude Leaderboard" to "ccrank.dev"

### Page Titles
- Change `<title>` pattern from "X - Claude Leaderboard by Akash" to "X | ccrank.dev"

### OG Meta
- `og:site_name`: "ccrank.dev"
- `og:title`: "X | ccrank.dev"

### Footer
- Change to: `Powered by ccusage | Open Source`
- "ccusage" links to ryoppippi's repo (existing UTM)
- "Open Source" links to `github.com/makash/claude-leaderboard-using-ccusage?utm_source=ccrank&utm_medium=web&utm_campaign=footer`

### About Page
- Add professional intro paragraph at top:
  > "ccrank.dev is an open-source developer ranking platform for Claude Code usage. Track, compare, and compete on your team's AI-assisted development metrics."

---

## 4. MIT License

- Add `LICENSE` file at repo root
- Standard MIT license text
- Copyright (c) 2025-2026 Akash Mahajan

---

## Implementation Notes

- **Leaderboard clickable names:** Make user avatars/names on leaderboard and history pages link to `/user/:slug` (only if user has sharing enabled and slug set)
- **Heatmap rendering:** Pure server-side HTML — CSS Grid with 53 columns (weeks) x 7 rows (days). Each cell is a small `<div>` with background-color computed from data. Tab switching done with simple JS show/hide of pre-rendered grids (all 3 tabs rendered server-side, only one visible).
- **Bundle impact:** Minimal — only new HTML template code, no new dependencies.
