# Efficiency Metrics & Sortable Leaderboard — Brainstorm

**Date:** 2026-02-15
**Author:** Akash Mahajan / Claude

## What We're Building

Add computed efficiency metrics to ccrank.dev so the leaderboard rewards more than just raw spend. Developers are skeptical of "who burns the most tokens" as the sole ranking — this addresses that by surfacing efficiency and letting users sort by different dimensions.

Three new metrics, all computed from existing `daily_usage` columns (no schema migration needed):

1. **Output per Dollar** — `SUM(output_tokens) / SUM(cost_usd)` — who generates the most per dollar spent
2. **Cache Hit Rate** — `SUM(cache_read_tokens) / SUM(total_tokens)` — who reuses context most efficiently
3. **Output Ratio** — `SUM(output_tokens) / SUM(total_tokens)` — highest signal-to-noise (output vs total)

## Why This Approach

- **Zero schema changes** — all three metrics derive from columns already in `daily_usage`
- **Addresses skepticism** — gives meaning beyond "who spent the most"
- **Tinkerer-friendly** — devs can optimize their workflow and see it reflected
- **Non-breaking** — default ranking stays by cost; efficiency is additive

## Key Decisions

1. **Minimum threshold for efficiency rankings:** $100 total spend AND 10+ active days. Prevents gaming with tiny usage.
2. **Sort UI:** Tabs above the leaderboard table (not clickable column headers). Options: Cost (default) | Output/$ | Cache Rate | Output Ratio.
3. **Visibility:** Efficiency metrics appear everywhere — leaderboard, user profile pages, AND social cards.
4. **Default stays cost:** Existing behavior preserved. Efficiency sorts are opt-in via tabs.
5. **No new data capture needed:** Future "projects" tracking (what got shipped) deferred to ccusage tool changes.

## Surfaces

### Leaderboard Page (`/leaderboard`)
- Tab bar above table: `Cost` | `Output/$` | `Cache Rate` | `Output Ratio`
- Active tab highlights, re-ranks the table by selected metric
- Efficiency columns visible in all views
- On efficiency sorts: qualified users ranked at top; below-threshold users listed at bottom with `—` instead of rank number

### Profile Pages (`/user/:slug`)
- New "Efficiency" stats row alongside existing cost/tokens/days stats
- Show all 3 metrics with labels

### Social Cards (`/card/:slug/image.png`)
- Add one efficiency stat to the card: **Output per Dollar** (most universally meaningful)
- Format: e.g., "42K tokens/$" shown below the stats row
- Only shown if user meets the $100 / 10-day threshold

## Open Questions

None — all resolved during brainstorm.

## Future (Out of Scope)

- **Project tracking:** Requires ccusage tool changes to capture project names / git context. Separate effort.
- **Model-level efficiency:** Breaking down efficiency by model (Opus vs Sonnet vs Haiku). Could add later.
- **Badges/achievements:** "Cache Master", "Efficiency King" — fun but not in this iteration.
