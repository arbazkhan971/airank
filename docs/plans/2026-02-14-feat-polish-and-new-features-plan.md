---
title: "feat: Polish UI, add About page, time travel, and multi-machine support"
type: feat
date: 2026-02-14
deepened: 2026-02-14
---

# Polish UI, About Page, Time Travel & Multi-Machine Support

## Enhancement Summary

**Deepened on:** 2026-02-14
**Research agents used:** Frontend Design, TypeScript Review, Security Sentinel, Performance Oracle, Data Migration Expert, Architecture Strategist, Best Practices Research

### Key Improvements from Research
1. **Migration safety:** Changed from single migration to 3-step zero-downtime deploy (prevents production outage)
2. **Podium layout:** Use flexbox `items-end` with `translate-y` offsets instead of CSS grid (better podium effect)
3. **Type safety:** Added ViewType union, DateRange interface, sanitizeSource() helper
4. **Date validation:** Added real date validation beyond regex format check
5. **Security headers:** Added CSP and standard security headers middleware
6. **Architecture:** Extract shared utilities to `src/utils.ts`

### Deferred for Later (YAGNI)
- KV caching (not needed until 500+ users — current scale is tiny)
- R2 image hosting (base64 is fine for 4 static screenshots on one page)
- Materialized user_totals table (premature optimization at current scale)
- Session token user data embedding (current DB query is fine)

---

## Overview

Six improvements to take ccrank.dev from working side project to polished, shareable product. Covers visual polish, origin story content, historical leaderboards, and multi-machine data consolidation.

## Pre-Implementation: Extract Utilities

**New file: `src/utils.ts`**

Before starting any phase, extract shared utilities from `src/html.ts` and add new ones:

```typescript
// src/utils.ts

// Move from html.ts
export function formatTokens(n: number): string { ... }
export function formatCost(n: number): string { ... }
export function timeAgo(dateStr: string | null): string { ... }
export function escapeHtml(str: string): string { ... }

// New: Type-safe view parameter
export type ViewType = 'daily' | 'weekly' | 'monthly';

export function isValidView(view: string | undefined): view is ViewType {
  return view === 'daily' || view === 'weekly' || view === 'monthly';
}

// New: Date range helper (for Phase 3)
export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
  prevDate: string;
  nextDate: string;
  isCurrentPeriod: boolean;
}

export function getDateRange(view: ViewType, dateStr: string): DateRange { ... }
export function getTodayUTC(): string { ... }

// New: Source sanitization (for Phase 4)
export function sanitizeSource(input: string | undefined): string {
  if (!input) return 'default';
  const sanitized = input.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
  return sanitized.length > 0 ? sanitized : 'default';
}

// New: Date validation (beyond regex)
export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date + 'T00:00:00Z');
  if (isNaN(parsed.getTime())) return false;
  const [year, month, day] = date.split('-').map(Number);
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
}
```

Update `src/html.ts` to import from utils instead of defining locally. Update `src/index.ts` imports accordingly.

---

## Implementation Phases

### Phase 1: Visual Polish + Top 3 Redesign

**Files:** `src/html.ts`

#### 1.1 Redesign top 3 podium cards in `landingPage()`

Current: Three equal cards with medal emoji. New: Podium layout with #1 visually dominant.

**Changes to `landingPage()` in `src/html.ts`:**

Use flexbox `items-end` with translate-y offsets for authentic podium effect:

```html
<div class="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 max-w-3xl mx-auto">
  <!-- #2 (Silver - Left, offset down) -->
  <div class="order-2 sm:order-1 flex-1 max-w-[240px] sm:translate-y-6">
    <div class="podium-card bg-gray-900 border border-gray-800 border-t-4 border-t-gray-400 rounded-xl p-6 text-center glow">
      <div class="text-2xl mb-3">&#x1f948;</div>
      <!-- avatar w-16 h-16, ring-gray-400 -->
      <div class="text-2xl font-bold text-purple-400">${formatCost(cost)}</div>
    </div>
  </div>

  <!-- #1 (Gold - Center, no offset = tallest) -->
  <div class="order-1 sm:order-2 flex-1 max-w-[280px]">
    <div class="podium-card bg-gray-900 border border-gray-800 border-t-4 border-t-yellow-500 rounded-xl p-8 text-center glow">
      <div class="text-3xl mb-3">&#x1f947;</div>
      <!-- avatar w-20 h-20, ring-yellow-400 -->
      <div class="text-3xl font-extrabold text-purple-400">${formatCost(cost)}</div>
    </div>
  </div>

  <!-- #3 (Bronze - Right, offset more) -->
  <div class="order-3 flex-1 max-w-[220px] sm:translate-y-10">
    <div class="podium-card bg-gray-900 border border-gray-800 border-t-4 border-t-amber-700 rounded-xl p-5 text-center glow">
      <div class="text-2xl mb-3">&#x1f949;</div>
      <!-- avatar w-14 h-14, ring-amber-600 -->
      <div class="text-2xl font-bold text-purple-400">${formatCost(cost)}</div>
    </div>
  </div>
</div>
```

**Card design tokens:**
- #1: avatar `w-20 h-20`, cost `text-3xl font-extrabold`, padding `p-8`, border `border-t-yellow-500`
- #2: avatar `w-16 h-16`, cost `text-2xl font-bold`, padding `p-6`, border `border-t-gray-400`
- #3: avatar `w-14 h-14`, cost `text-2xl font-bold`, padding `p-5`, border `border-t-amber-700`

**Add to `<style>` block in layout():**

```css
.podium-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.podium-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
}
```

**Partial state handling:** 1 user = single centered card, 2 users = two cards side by side.

**Mobile:** On `sm:` and below, cards stack vertically (#1 first via order), no translate-y offsets (sm:translate-y-* only applies on desktop).

#### 1.2 General page polish

- Hero heading: `text-5xl md:text-6xl` with `tracking-tight`
- Footer: reduce `mt-16` to `mt-12`
- Add `focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900` to interactive elements
- Names: add `tracking-tight` to large text for tighter letter spacing

#### 1.3 Security headers middleware

**Add to `src/index.ts` after session middleware:**

```typescript
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  c.res.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'unsafe-inline' https://cdn.tailwindcss.com; " +
    "style-src 'unsafe-inline' 'self'; img-src 'self' data: https:; " +
    "connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
});
```

---

### Phase 2: Origin Story Snippet + About Page + Credits

**Files:** `src/html.ts`, `src/index.ts`

#### 2.1 Add origin story snippet to homepage

**Changes to `landingPage()` in `src/html.ts`:**

Insert between podium section and CTA buttons:

```html
<div class="max-w-2xl mx-auto my-12">
  <div class="bg-[#005c4b] rounded-2xl rounded-tl-sm p-5 relative">
    <!-- WhatsApp tail -->
    <div class="absolute -left-2 top-0 w-4 h-4 bg-[#005c4b]"
         style="clip-path: polygon(100% 0, 0 0, 100% 100%);"></div>
    <div class="font-semibold text-white/95 text-sm mb-2">Thiyagarajan Maruthavanan (Rajan)</div>
    <p class="text-white/90 leading-relaxed">"Code a Leaderboard Vivek? Let everyone submit their ccusage :)"</p>
    <div class="text-right text-white/50 text-xs mt-2">14:46</div>
  </div>
  <p class="text-sm text-gray-500 mt-4 text-center">
    One WhatsApp message. Built with Claude Code on a phone. Deployed in minutes.
    <a href="/about" class="text-purple-400 hover:text-purple-300 transition ml-1">
      Read the full story
      <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </a>
  </p>
</div>
```

Show regardless of top 3 data (brand story, not data-dependent).

#### 2.2 Create About page

**New function `aboutPage()` in `src/html.ts`:**

Signature: `export function aboutPage(): string`

Sections:
1. **Hero:** "How ccrank.dev was born" — gradient title
2. **The Spark:** Rajan's message as larger WhatsApp bubble
3. **Built on a Phone:** Paragraph + Akash's quote: "The only hardwork I had to do was run 4 npm commands."
4. **The Prompt:** Claude Code screenshot (base64)
5. **Shipped It:** Screenshots of sharing the live link
6. **What This Leaderboard Is For:** Bullet points (visibility, competition, cost awareness, team bonding)
7. **How It Works:** Three steps: install ccusage, upload JSON, see your rank
8. **Powered by ccusage:** Credit section (see 2.3)

**Image handling — base64 inline:**
- Convert 4 screenshots to optimized PNGs (resize to max 800px wide before encoding)
- Embed as `data:image/png;base64,...` data URIs
- Add `loading="lazy"` and descriptive `alt` text to all images
- Constrain: `max-w-sm mx-auto rounded-lg shadow-xl`
- Use 2-column grid on desktop: `grid grid-cols-1 sm:grid-cols-2 gap-6`

**Why base64 is acceptable here:**
- Only 4 static images on a single page (not on every page)
- Images are hardcoded constants (not user input — no XSS risk)
- No R2 setup needed for a side project
- Can upgrade to R2 later if page size becomes an issue

**Screenshots mapping:**
- `SCR-20260214-rowh.png` — Rajan's original message (alt: "WhatsApp message from Rajan suggesting a leaderboard")
- `SCR-20260214-rozc.png` — Claude Code building the app (alt: "Claude Code agent building the app from a phone prompt")
- `SCR-20260214-rpgi.png` — Sharing the live app (alt: "Akash sharing the deployed app link in WhatsApp")
- `SCR-20260214-rpmv.png` — Domain purchase (alt: "Deciding on the ccrank domain name")

**New route in `src/index.ts`:**

```typescript
app.get('/about', (c) => {
  return c.html(aboutPage());
});
```

**Navigation:** Add "About" link to footer. Also add to unauthenticated nav alongside Leaderboard.

#### 2.3 ccusage credit

**In `aboutPage()` (bottom section):**

```html
<div class="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-800/30 rounded-2xl p-8 text-center">
  <p class="text-sm text-gray-400 mb-2">Powered by</p>
  <a href="https://github.com/ryoppippi/ccusage?utm_source=ccrank&utm_medium=web&utm_campaign=credits"
     target="_blank" rel="noopener" class="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
    ccusage
  </a>
  <p class="text-sm text-gray-500 mt-3">
    Open-source CLI for tracking Claude Code token usage and costs.
    <br>Created by <a href="https://github.com/ryoppippi" target="_blank" rel="noopener" class="text-gray-400 hover:text-gray-300">ryoppippi</a>.
  </p>
  <code class="inline-block bg-gray-800 px-3 py-1.5 rounded text-purple-400 font-mono text-sm mt-4">
    npx ccusage@latest daily --json
  </code>
</div>
```

**In footer (`layout()` in `src/html.ts`):**

Add between "Built by" line and social icons:

```html
<p class="text-xs text-gray-600 mb-3">
  Powered by <a href="https://github.com/ryoppippi/ccusage?utm_source=ccrank&utm_medium=web&utm_campaign=footer"
  target="_blank" rel="noopener" class="text-gray-500 hover:text-gray-400 transition">ccusage</a>
</p>
```

---

### Phase 3: Time Travel Feature

**Files:** `src/utils.ts`, `src/html.ts`, `src/index.ts`

#### 3.1 Add history route

**Route:** `GET /history`

**Query parameters:**
- `view`: `daily` | `weekly` | `monthly` (default: `daily`)
- `date`: `YYYY-MM-DD` (default: today UTC)

**Route handler in `src/index.ts`:**

```typescript
app.get('/history', async (c) => {
  const viewParam = c.req.query('view');
  const view: ViewType = isValidView(viewParam) ? viewParam : 'daily';
  const dateParam = c.req.query('date') || getTodayUTC();
  const user = c.get('user');

  // Validate date (format AND real date)
  if (!isValidDateString(dateParam)) {
    return c.html(errorPage('Invalid Date', 'Use a valid YYYY-MM-DD date.', user), 400);
  }

  // Bound date range (no more than 3 years back)
  const parsed = new Date(dateParam + 'T00:00:00Z');
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  if (parsed < threeYearsAgo) {
    return c.html(errorPage('Date Out of Range', 'Date must be within the last 3 years.', user), 400);
  }

  const range = getDateRange(view, dateParam);

  const results = await c.env.DB.prepare(
    `SELECT u.display_name, u.avatar_url,
      SUM(d.cost_usd) as total_cost,
      SUM(d.total_tokens) as total_tokens,
      SUM(d.output_tokens) as total_output_tokens,
      COUNT(DISTINCT d.date) as days_active
    FROM daily_usage d JOIN users u ON d.user_id = u.id
    WHERE d.date >= ? AND d.date <= ?
    GROUP BY u.id
    ORDER BY total_cost DESC
    LIMIT 10`
  ).bind(range.startDate, range.endDate).all();

  const entries = (results.results || []).map((row: any, i: number) => ({
    rank: i + 1,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    total_cost: row.total_cost,
    total_tokens: row.total_tokens,
    total_output_tokens: row.total_output_tokens,
    days_active: row.days_active,
  }));

  return c.html(historyPage(entries, {
    view, label: range.label,
    prevDate: range.prevDate, nextDate: range.nextDate,
    isCurrentPeriod: range.isCurrentPeriod, currentDate: dateParam
  }, user));
});
```

#### 3.2 getDateRange() in `src/utils.ts`

```typescript
export function getDateRange(view: ViewType, dateStr: string): DateRange {
  const date = new Date(dateStr + 'T00:00:00Z');
  const today = new Date(getTodayUTC() + 'T00:00:00Z');

  if (view === 'daily') {
    const prev = new Date(date); prev.setUTCDate(prev.getUTCDate() - 1);
    const next = new Date(date); next.setUTCDate(next.getUTCDate() + 1);
    return {
      startDate: dateStr, endDate: dateStr,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      prevDate: formatUTCDate(prev), nextDate: formatUTCDate(next),
      isCurrentPeriod: dateStr === getTodayUTC(),
    };
  }

  if (view === 'weekly') {
    // Monday start (ISO 8601)
    const day = date.getUTCDay();
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    const prevMon = new Date(monday); prevMon.setUTCDate(prevMon.getUTCDate() - 7);
    const nextMon = new Date(monday); nextMon.setUTCDate(nextMon.getUTCDate() + 7);
    return {
      startDate: formatUTCDate(monday), endDate: formatUTCDate(sunday),
      label: `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`,
      prevDate: formatUTCDate(prevMon), nextDate: formatUTCDate(nextMon),
      isCurrentPeriod: today >= monday && today <= sunday,
    };
  }

  // monthly
  const firstOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const lastOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  const prevMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1));
  const nextMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  return {
    startDate: formatUTCDate(firstOfMonth), endDate: formatUTCDate(lastOfMonth),
    label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    prevDate: formatUTCDate(prevMonth), nextDate: formatUTCDate(nextMonth),
    isCurrentPeriod: today >= firstOfMonth && today <= lastOfMonth,
  };
}
```

#### 3.3 History page template

**New function `historyPage()` in `src/html.ts`:**

```typescript
interface HistoryNavigation {
  view: ViewType;
  label: string;
  prevDate: string;
  nextDate: string;
  isCurrentPeriod: boolean;
  currentDate: string;
}

export function historyPage(
  entries: LeaderboardEntry[],
  nav: HistoryNavigation,
  user: User | null
): string
```

**Tab bar with gradient active state:**

```html
<div class="bg-gray-900 border border-gray-800 rounded-xl p-1.5 inline-flex gap-1 mb-6">
  <!-- Active: bg-gradient-to-r from-purple-600 to-cyan-600 text-white -->
  <!-- Inactive: text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 -->
</div>
```

**Date navigator:**

```html
<div class="flex items-center justify-center gap-6 mb-8">
  <a href="/history?view=${nav.view}&date=${nav.prevDate}"
     class="p-2 rounded-lg hover:bg-gray-800 transition">
    <svg class="w-5 h-5"><!-- left chevron --></svg>
  </a>
  <span class="text-lg font-semibold min-w-[200px] text-center">${nav.label}</span>
  ${nav.isCurrentPeriod
    ? '<span class="p-2 opacity-30"><svg ...><!-- right chevron --></svg></span>'
    : '<a href="..." class="p-2 rounded-lg hover:bg-gray-800 transition"><svg ...></svg></a>'}
</div>
```

Tab switching preserves date context. Empty state: "No data for [period]" message.

#### 3.4 Navigation links

Add "History" link to nav bar for both authenticated and unauthenticated users, after "Leaderboard".

---

### Phase 4: Multi-Machine Source Tracking

**Files:** `migrations/0003_add_source.sql`, `migrations/0004_drop_old_index.sql`, `src/index.ts`, `src/html.ts`

#### 4.1 Database migration — ZERO DOWNTIME (3-step deploy)

**CRITICAL:** The migration and code deploy must be decoupled to prevent breaking uploads.

**Step 1 — Migration `0003_add_source.sql` (add column + new index, keep old index):**

```sql
-- Add source column with default for existing rows
ALTER TABLE daily_usage ADD COLUMN source TEXT NOT NULL DEFAULT 'default';

-- Add new index ALONGSIDE old one (both work during transition)
CREATE UNIQUE INDEX idx_daily_usage_user_date_source ON daily_usage(user_id, date, source);
```

Run: `npm run db:migrate`

At this point, old code still works (uses old `ON CONFLICT(user_id, date)` which still exists).

**Step 2 — Code deploy:**

Deploy updated code that uses `ON CONFLICT(user_id, date, source)`. Both indexes exist, new code uses new one.

**Step 3 — Migration `0004_drop_old_index.sql` (after verifying code is stable):**

```sql
-- Safe to drop now that code uses new constraint
DROP INDEX IF EXISTS idx_daily_usage_user_date;
```

Run: `npm run db:migrate` (after code is deployed and verified)

#### 4.2 Update upload API

**Changes to `POST /api/upload` in `src/index.ts`:**

```typescript
let body: { json: string; source?: string };
try {
  body = await c.req.json();
} catch {
  return c.json({ ok: false, error: 'Invalid request body' }, 400);
}

const source = sanitizeSource(body.source); // from utils.ts
```

Update INSERT to include source:

```sql
INSERT INTO daily_usage (id, upload_id, user_id, date, source, input_tokens, ...)
VALUES (?, ?, ?, ?, ?, ?, ...)
ON CONFLICT(user_id, date, source) DO UPDATE SET
  upload_id = excluded.upload_id,
  input_tokens = excluded.input_tokens,
  ...
```

#### 4.3 Update upload form

Add machine name field above JSON input in `uploadPage()`:

```html
<div class="mb-4">
  <label class="block text-sm text-gray-400 mb-2">Machine name <span class="text-gray-600">(optional)</span></label>
  <input type="text" id="source-name" placeholder="e.g. laptop, vpc-1, work-desktop"
    class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition"
    maxlength="50" pattern="[a-zA-Z0-9_-]*">
  <p class="text-xs text-gray-500 mt-1">Use different names for each machine to track usage separately</p>
</div>
```

Include source in fetch body. Store/restore last-used source via localStorage.

#### 4.4 Leaderboard queries stay the same

All existing leaderboard queries use `SUM()` grouped by `user_id`, which naturally aggregates across all sources. No changes needed.

#### 4.5 Deployment checklist

```sql
-- Verify migration succeeded
SELECT COUNT(*) FROM daily_usage WHERE source IS NULL; -- Must be 0
SELECT source, COUNT(*) FROM daily_usage GROUP BY source; -- Should show 'default'

-- Verify indexes
SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='daily_usage';

-- Test UPSERT with new constraint
-- Upload same data twice → should update, not duplicate
```

---

## Acceptance Criteria

### Pre-Implementation
- [ ] `src/utils.ts` created with extracted utilities + new helpers
- [ ] `src/html.ts` updated to import from utils
- [ ] Security headers middleware added

### Phase 1: Visual Polish
- [ ] Top 3 cards show podium layout (#2 | #1 | #3) on desktop
- [ ] #1 card is visually larger (bigger avatar, bigger cost text, taller)
- [ ] Cards have colored top borders (gold/silver/bronze)
- [ ] Cards have smooth hover lift effect (cubic-bezier transition)
- [ ] Mobile: cards stack vertically, #1 first, no translate offsets
- [ ] Handles 0, 1, 2, or 3 users gracefully

### Phase 2: Content
- [ ] Homepage shows WhatsApp-styled origin story snippet with clip-path tail
- [ ] Snippet links to `/about` page
- [ ] `/about` page loads with all 4 screenshots (base64, lazy-loaded)
- [ ] All images have descriptive alt text
- [ ] About page has: origin story, purpose, how it works, credits
- [ ] Footer shows "Powered by ccusage" with UTM link
- [ ] About page has gradient "Powered by ccusage" section
- [ ] About page screenshots in 2-column grid on desktop, stacked on mobile

### Phase 3: Time Travel
- [ ] `/history` loads with daily view, today's date
- [ ] View parameter uses ViewType union (not raw string)
- [ ] Date validation checks format AND real date validity
- [ ] Date bounded to 3 years back maximum
- [ ] Tab switching between daily/weekly/monthly works
- [ ] Tab switching preserves date context
- [ ] Prev/next navigation works correctly
- [ ] "Next" button disabled when on current period
- [ ] Deep linking works: `/history?view=weekly&date=2026-02-10`
- [ ] Empty state shows "No data for [period]" message
- [ ] Top 10 entries display with rank, avatar, name, cost, tokens
- [ ] "History" link appears in nav bar for all users
- [ ] Week boundaries use Monday start (ISO 8601)
- [ ] All dates in UTC

### Phase 4: Multi-Machine
- [ ] Migration 0003 adds source column + new index (keeps old index)
- [ ] Code deploys with `ON CONFLICT(user_id, date, source)`
- [ ] Migration 0004 drops old index (after code verified stable)
- [ ] Upload form has optional "Machine name" field with pattern validation
- [ ] `sanitizeSource()` validates: alphanumeric + hyphens/underscores, max 50 chars
- [ ] Same source + same date = overwrites (UPSERT)
- [ ] Different source + same date = both stored
- [ ] Leaderboard aggregates across all sources correctly
- [ ] Last-used source remembered in localStorage
- [ ] Uploading without source defaults to "default"
- [ ] Post-deploy verification queries run successfully

---

## Phase 5: Shareable Social Stats Cards

**Goal:** Let users share their ranking as an attractive card on Twitter/LinkedIn to drive viral invite demand.

**Beads:** `claude-leaderboard-using-ccusage-4bu`

### 5.1 Database: Add sharing opt-in

```sql
-- migrations/0005_add_sharing.sql
ALTER TABLE users ADD COLUMN sharing_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN share_slug TEXT;
CREATE UNIQUE INDEX idx_users_share_slug ON users(share_slug) WHERE share_slug IS NOT NULL;
```

- `sharing_enabled` — 0 (default) or 1
- `share_slug` — unique URL-safe identifier (e.g., username or short hash)

### 5.2 Card Page: `/card/:slug`

**Public route** — only works if user has `sharing_enabled = 1`.

Two display modes via query param `?mode=simple` (default) or `?mode=full`:

**Simple card:** Rank, cost, title, avatar, days active, "ccrank.dev" CTA
**Full card:** Above + total tokens, daily breakdown mini-bar, last active date

**HTML page features:**
- Beautiful dark card design matching app theme
- OG meta tags with `og:image` pointing to `/card/:slug/image.png`
- "Share on X" button (pre-filled tweet with card URL)
- "Download Image" button (client-side SVG-to-Canvas-to-PNG)
- "Copy Link" button

### 5.3 OG Image Generation: `/card/:slug/image.png`

Generate PNG server-side on Cloudflare Workers using **satori** + **@resvg/resvg-wasm**:

1. Query user stats (rank, cost, title, etc.)
2. Build SVG via satori from JSX-like object (card layout)
3. Convert SVG to PNG via resvg-wasm
4. Return with `Content-Type: image/png`, `Cache-Control: public, max-age=3600`

**Card design:** 1200x630px (Twitter/LinkedIn optimal), dark background, gold/silver/bronze accent based on rank, ccrank.dev branding.

### 5.4 Settings UI: Enable Sharing

Add to dashboard or a new `/settings` section:
- Toggle: "Make my stats card public"
- Preview of what the card looks like
- Copy shareable URL
- Choose slug (defaults to display name, slugified)

### 5.5 Share Prompts

After uploading data, show: "Your rank changed! Share your card?" with a tweet preview.

On the leaderboard, add a small share icon next to the user's own row.

### Acceptance Criteria: Phase 5
- [x] Users can enable/disable sharing from settings
- [x] `/card/:slug` returns 404 if sharing disabled
- [x] Simple card shows rank, cost, title, days active
- [x] Full card shows all stats
- [x] OG image renders as 1200x630 PNG
- [x] Twitter card preview works when URL is shared
- [x] "Share on X" opens tweet composer with card URL
- [x] "Download Image" saves PNG locally
- [x] Share slug is unique per user
- [x] Card page includes "Join at ccrank.dev" CTA for viewers

---

## References

- Brainstorm: `docs/brainstorms/2026-02-14-polish-and-features-brainstorm.md`
- Main routes: `src/index.ts`
- HTML templates: `src/html.ts`
- New utilities: `src/utils.ts` (to create)
- Database schema: `migrations/0001_initial.sql`
- Screenshots: `/Users/mainstreet/Documents/jumpshots/SCR-20260214-ro*.png`, `SCR-20260214-rp*.png`
- ccusage: https://github.com/ryoppippi/ccusage
