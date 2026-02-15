---
title: "feat: Add efficiency metrics and sortable leaderboard"
type: feat
date: 2026-02-15
---

# Efficiency Metrics & Sortable Leaderboard

## Overview

Add three computed efficiency metrics to ccrank.dev and make the leaderboard sortable by any of them. Metrics appear on the leaderboard, profile pages, and social cards.

**Brainstorm:** `docs/brainstorms/2026-02-15-efficiency-metrics-brainstorm.md`

## Metrics

All computed from existing `daily_usage` columns — no migration needed.

| Metric | Formula | Label |
|--------|---------|-------|
| Output per Dollar | `SUM(output_tokens) / SUM(cost_usd)` | `tokens/$` |
| Cache Hit Rate | `SUM(cache_read_tokens) / SUM(total_tokens)` | `%` |
| Output Ratio | `SUM(output_tokens) / SUM(total_tokens)` | `%` |

**Threshold:** $100 total spend AND 10+ active days to qualify for efficiency rankings.

## Acceptance Criteria

- [x] Leaderboard has tabs: Cost (default) | Output/$ | Cache Rate | Output Ratio
- [x] Selecting a tab re-sorts the table by that metric (server-side, URL param `?sort=`)
- [x] Efficiency columns visible in all sort views
- [x] Below-threshold users shown at bottom with `—` rank on efficiency sorts
- [x] Profile pages show all 3 efficiency stats
- [x] Social card (PNG + SVG) shows Output/$ stat if user meets threshold
- [x] Default behavior unchanged — `/leaderboard` without params still sorts by cost

---

## Implementation Tasks

### Task 1: Add efficiency metrics to leaderboard SQL and route

**Files:**
- Modify: `src/index.ts` — `/leaderboard` route (lines 244-276) and `/api/leaderboard` route (lines 758-791)

**What to do:**

1. Accept `?sort=cost|output_per_dollar|cache_rate|output_ratio` query param (default: `cost`)
2. Update SQL query to compute additional columns:

```sql
SELECT
  u.display_name,
  u.avatar_url,
  CASE WHEN u.sharing_enabled = 1 THEN u.share_slug ELSE NULL END as share_slug,
  COALESCE(SUM(d.cost_usd), 0) as total_cost,
  COALESCE(SUM(d.total_tokens), 0) as total_tokens,
  COALESCE(SUM(d.output_tokens), 0) as total_output_tokens,
  COALESCE(SUM(d.cache_read_tokens), 0) as total_cache_read,
  COUNT(DISTINCT d.date) as days_active,
  MAX(d.date) as last_active,
  CASE WHEN COALESCE(SUM(d.cost_usd), 0) > 0
    THEN COALESCE(SUM(d.output_tokens), 0) / COALESCE(SUM(d.cost_usd), 1)
    ELSE 0 END as output_per_dollar,
  CASE WHEN COALESCE(SUM(d.total_tokens), 0) > 0
    THEN CAST(COALESCE(SUM(d.cache_read_tokens), 0) AS REAL) / COALESCE(SUM(d.total_tokens), 1)
    ELSE 0 END as cache_rate,
  CASE WHEN COALESCE(SUM(d.total_tokens), 0) > 0
    THEN CAST(COALESCE(SUM(d.output_tokens), 0) AS REAL) / COALESCE(SUM(d.total_tokens), 1)
    ELSE 0 END as output_ratio
FROM users u
LEFT JOIN daily_usage d ON u.id = d.user_id
GROUP BY u.id
HAVING total_cost > 0
ORDER BY total_cost DESC
```

3. In JS after query: if sort is an efficiency metric, split results into qualified (>=$100 AND >=10 days) and unqualified. Sort qualified by metric DESC, append unqualified at bottom. Assign ranks only to qualified users.

4. Pass sort param and entries to `leaderboardPage()`.

**Commit:** `feat: add efficiency metrics to leaderboard queries`

---

### Task 2: Add efficiency columns and sort tabs to leaderboard HTML

**Files:**
- Modify: `src/html.ts` — `leaderboardPage()` function (lines 449-521)
- Modify: `src/utils.ts` — add `LeaderboardEntry` fields and format helpers

**What to do:**

1. Add to `LeaderboardEntry` in `src/utils.ts`:
```typescript
output_per_dollar: number;
cache_rate: number;
output_ratio: number;
meets_efficiency_threshold: boolean;
```

2. Add format helpers in `src/utils.ts`:
```typescript
export function formatEfficiency(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return Math.round(value).toString();
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%';
}
```

3. Add tab bar above table in `leaderboardPage()`. Follow the history page tab pattern (`src/html.ts` lines 941-946):
```typescript
const sortOptions = [
  { key: 'cost', label: 'Cost' },
  { key: 'output_per_dollar', label: 'Output/$' },
  { key: 'cache_rate', label: 'Cache Rate' },
  { key: 'output_ratio', label: 'Output Ratio' },
];
const tabsHtml = sortOptions.map(s => {
  const isActive = s.key === sort;
  return `<a href="/leaderboard?sort=${s.key}" class="px-4 py-2 text-sm font-medium rounded-lg transition ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}">${s.label}</a>`;
}).join('');
```

4. Add 3 new columns to table header and rows:
   - Output/$ — `text-emerald-400` — `formatEfficiency(entry.output_per_dollar) + ' tokens/$'`
   - Cache Rate — `text-blue-400` — `formatPercent(entry.cache_rate)`
   - Output Ratio — `text-amber-400` — `formatPercent(entry.output_ratio)`

5. For below-threshold users on efficiency sorts: show `—` in rank column, dim the row with `opacity-50`.

**Commit:** `feat: add efficiency columns and sort tabs to leaderboard`

---

### Task 3: Add efficiency stats to profile page

**Files:**
- Modify: `src/index.ts` — `/user/:slug` route (lines 329-398)
- Modify: `src/html.ts` — `profilePage()` function (lines 1401+)

**What to do:**

1. Update profile SQL query to also fetch `cache_read_tokens`:
```sql
SELECT COALESCE(SUM(cost_usd), 0) as total_cost,
  COALESCE(SUM(total_tokens), 0) as total_tokens,
  COALESCE(SUM(output_tokens), 0) as total_output_tokens,
  COALESCE(SUM(cache_read_tokens), 0) as total_cache_read,
  COUNT(DISTINCT date) as days_active,
  MAX(date) as last_active
FROM daily_usage WHERE user_id = ?
```

2. Compute the 3 metrics in JS and pass to `profilePage()`.

3. Add an "Efficiency" stats row in `profilePage()` below the existing stats grid. Three boxes:
   - Output/$ — emerald color
   - Cache Rate — blue color
   - Output Ratio — amber color

4. Only show efficiency row if user meets threshold ($100 / 10 days).

**Commit:** `feat: add efficiency stats to user profile pages`

---

### Task 4: Add Output/$ to social cards

**Files:**
- Modify: `src/card.ts` — `CardData` interface and `generateCardSvg()` (lines 32-42, 51+)
- Modify: `src/card-png.ts` — `generateCardHtml()` (lines 16+)
- Modify: `src/index.ts` — card routes to compute and pass metric

**What to do:**

1. Add to `CardData` interface:
```typescript
outputPerDollar?: number; // only set if meets threshold
```

2. In `/card/:slug/image.svg` and `/card/:slug/image.png` routes: compute `output_per_dollar` from query results, pass to CardData only if cost >= 100 and days >= 10.

3. In `generateCardHtml()` (card-png.ts): add an efficiency stat line below the stats row, before fav tools:
```html
<div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px;">
  <div style="font-size: 28px; font-weight: 700; color: #34d399;">{formatEfficiency(value)} tokens/$</div>
  <div style="font-size: 16px; color: #9ca3af;">efficiency</div>
</div>
```

4. In `generateCardSvg()` (card.ts): add matching satori element for SVG card.

5. Also update the `/user/:slug` route's fire-and-forget card generation to include the new field.

**Commit:** `feat: add output per dollar to social sharing cards`

---

### Task 5: Deploy and verify

**Steps:**

1. `npx wrangler deploy`
2. Verify `/leaderboard` default view unchanged
3. Verify `/leaderboard?sort=output_per_dollar` re-ranks with threshold
4. Verify `/leaderboard?sort=cache_rate` and `?sort=output_ratio` work
5. Verify `/user/makash` shows efficiency stats
6. Verify `/card/makash/image.png` shows Output/$ stat
7. `git push`

**Commit:** none (deploy only)

---

## References

- Brainstorm: `docs/brainstorms/2026-02-15-efficiency-metrics-brainstorm.md`
- Leaderboard route: `src/index.ts:244-276`
- Leaderboard HTML: `src/html.ts:449-521`
- History tab pattern: `src/html.ts:941-946`
- Profile page: `src/html.ts:1401+`
- CardData interface: `src/card.ts:32-42`
- PNG card HTML: `src/card-png.ts:16-85`
- daily_usage schema: `migrations/0001_initial.sql:39-61`
