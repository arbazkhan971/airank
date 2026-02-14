# Brainstorm: Polish & New Features for ccrank.dev

**Date:** 2026-02-14
**Status:** Draft

---

## What We're Building

Six improvements to take ccrank.dev from "working side project" to "polished, shareable product":

1. **Visual polish + top 3 redesign** — Improve homepage podium cards and overall page quality
2. **Origin story snippet on homepage** — WhatsApp chat bubble teaser linking to About
3. **About page** — Full origin story with screenshots, purpose, and credits
4. **ccusage credit** — "Powered by ccusage" on About page and homepage footer
5. **Time travel feature** — Daily, weekly, and monthly historical leaderboards (public)
6. **Multi-machine ccusage consolidation** — Source tracking so multiple machines don't overwrite each other

---

## 1. Visual Polish + Top 3 Redesign

**Top 3 cards (current state):** Three equal-sized cards with medal emoji, avatar, name, title, cost, token count. They look flat and undifferentiated.

**Specific changes:**
- Make #1 card larger/taller than #2 and #3 (podium effect via CSS grid)
- Increase avatar size (currently w-14, go to w-20 for #1, w-16 for #2/#3)
- Make cost the most prominent element (larger font, bolder)
- Add colored top border to each card (gold/silver/bronze) instead of relying on subtle background gradients
- Improve spacing between podium section and CTAs

**General page polish (landing + leaderboard):**
- Tighten typography: larger hero heading, better size steps between headings/body
- Improve footer spacing (currently `mt-16` feels disconnected)
- Add subtle hover lift on cards (`hover:-translate-y-1 transition`)

**Constraints:**
- Tailwind CSS via CDN only, no build step
- No external image assets or JS frameworks
- Must work on mobile (cards stack vertically)

---

## 2. Origin Story Snippet on Homepage

**What:** A small section below the top 3 and above the CTAs.

**The story:**
- **Thiyagarajan Maruthavanan (Rajan)** messaged in a WhatsApp group: *"Code a Leaderboard Vivek? Let everyone submit their ccusage :)"*
- **Akash** built it with Claude Code on his phone, deployed in minutes
- *"The only hardwork I had to do was run 4 npm commands."*

**Design:**
- Styled as a chat bubble (green WhatsApp-style background)
- Rajan's quote + 1-line summary of what happened
- "Read the full story" link to `/about`
- Max 4-5 lines total

---

## 3. About Page

**Route:** `/about`

**Tone:** Casual & fun — side project blog post.

**Sections:**
1. **The spark** — Rajan's WhatsApp message
2. **Built on a phone** — Akash typed the prompt on his phone, ran 4 npm commands, done
3. **What this leaderboard is for** — Track Claude Code usage, friendly competition, cost awareness
4. **How it works** — Install ccusage, upload JSON, see your rank
5. **Credits** — ccusage by ryoppippi, built with Claude Code, Cloudflare Workers

**Screenshots** (4 files to embed):
- `/Users/mainstreet/Documents/jumpshots/SCR-20260214-rowh.png` — Rajan's original message
- `/Users/mainstreet/Documents/jumpshots/SCR-20260214-rozc.png` — Claude Code building the app
- `/Users/mainstreet/Documents/jumpshots/SCR-20260214-rpgi.png` — Akash sharing the live app
- `/Users/mainstreet/Documents/jumpshots/SCR-20260214-rpmv.png` — Buying the domain

**Image hosting:** Base64 inline. 4 small screenshots, acceptable page size increase. No external dependencies.

---

## 4. ccusage Credit

**About page:** Dedicated "Powered by" section with link to https://github.com/ryoppippi/ccusage and one-liner description.

**Homepage footer:** Add "Powered by ccusage" next to the existing "Built by Akash Mahajan" line.

---

## 5. Time Travel Feature

**Route:** `/history`

**What:** Public page to browse historical leaderboard rankings.

**UI:**
- Three tabs: Daily | Weekly | Monthly
- Prev/Next arrows with date label (e.g., "Feb 14, 2026" / "Week of Feb 10" / "February 2026")
- Top 10 table for the selected period
- Same styling as main leaderboard table

**Queries (all from existing `daily_usage` table, no new tables):**

Daily: `WHERE d.date = ?`
Weekly: `WHERE d.date BETWEEN ? AND ?` (Mon-Sun)
Monthly: `WHERE d.date >= ? AND d.date < ?` (calendar month)

All grouped by user, ordered by cost DESC, limited to 10.

**Defaults:** Today / this week / this month. Navigate with prev/next.

**Navigation links:** Add "History" to the nav bar (visible to all users).

---

## 6. Multi-Machine ccusage Consolidation

**The problem:** Akash has a laptop + 2 VPCs (one with 2 Claude users). Each generates separate ccusage reports. Current UPSERT on `(user_id, date)` means the last upload for a given date wins — multi-machine usage on the same day gets lost.

**Three approaches considered:**

### A. Multiple uploads (current — broken for same-day overlap)
Last upload overwrites. Doesn't work when two machines have usage on the same date.

### B. Source tracking (recommended)
- Add `source` column to `daily_usage` (TEXT, default "default")
- Change unique constraint to `(user_id, date, source)`
- Upload form gets optional "Machine name" field
- Same machine re-uploading overwrites; different machines add
- Leaderboard queries already use `SUM()` so they aggregate correctly

### C. Client-side merge
Merge JSON files before uploading. No server changes but manual and error-prone.

**Decision:** Go with **B**. One migration, one form field, clean data model.

---

## Key Decisions

1. **Frontend:** Tailwind CDN, no build step (keep current pattern)
2. **Images:** Base64 inline for About page screenshots
3. **Time travel:** Public, no auth, queries existing data
4. **About page:** Casual & fun tone
5. **Multi-machine:** Source tracking via DB migration (approach B)
6. **Top 3:** Podium layout with #1 visually dominant

---

## Implementation Order

1. Visual polish + top 3 cards (foundation)
2. About page + origin story snippet + ccusage credit (content)
3. Time travel feature (new page + queries)
4. Multi-machine consolidation (migration + upload UI)
