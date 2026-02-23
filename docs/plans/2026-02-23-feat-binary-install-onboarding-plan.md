---
title: feat: Binary-first install onboarding page
type: feat
status: completed
date: 2026-02-23
---

# feat: Binary-first install onboarding page

## Overview
Replace the Upload page with a binary‑only onboarding experience that drives a first successful upload. The page will prioritize token generation (via Settings), OS‑specific download/run commands, and an explicit `--add-repo` step. Secondary pages and navigation will be simplified to keep the primary action (Install) obvious, and any copy referring to manual JSON uploads will be removed or updated.

## Problem Statement / Motivation
The current Upload page is optimized for manual JSON uploads, which is no longer the primary flow. This creates user confusion and reduces successful uploads. A Julie‑Zhuo‑style pass should remove non‑essential elements, focus on the one right next action, and align the entire site with the binary‑first workflow.

## Proposed Solution
- Replace `/upload` content with a binary‑only install/onboarding flow.
- Use OS detection to expand the primary OS card (macOS/Linux/Windows) and collapse the others.
- Each OS card includes a direct binary download link and a one‑liner run command.
- Add a separate step to run `--add-repo` from a project folder before running upload.
- Add a short “multiple devices” section that mentions `--machine`.
- Add a small troubleshooting section for missing Node (mise guidance + `npx` example).
- Keep `/api/upload` intact (still used by the CLI).
- Update site copy and navigation to reinforce “Install” (not “Upload”).
- Review all pages for manual‑upload references and remove or update them.
- Simplify nav: keep primary action visible (Install), collapse secondary links under “More.”

### Information Architecture (Julie Zhuo Lens)
- **Primary action**: Install (visible in nav).
- **Secondary items**: History, About, Invites, Settings, Admin → under “More.”
- **Token step**: Link to Settings (single CTA).
- **Flow order on page**: 1) Get token → 2) Download binary (OS card) → 3) Add repo → 4) Run upload.

### Page Content Outline (Install)
- Hero: “Install the ccrank CLI” + one‑sentence promise (“first upload in 2 minutes”).
- Step 1: **Get token** → CTA to Settings.
- Step 2: **Download + run** (OS‑detected card expanded with one‑liner).
- Step 3: **Add repo** (`ccrank-git --add-repo`).
- Optional: **Multiple devices** (`--machine laptop`).
- Troubleshooting: **No Node?** → mise + `npx ccusage@latest daily --json`.

### Copy / Content Inventory (Pages to Update)
- `src/html.ts`:
  - `layout()` meta description + OpenGraph/Twitter description.
  - Nav labels (Upload → Install), desktop + mobile.
  - Homepage CTA copy and any “upload” messaging.
  - Upload page content → replaced by Install flow.
  - About/How‑it‑works steps referencing manual JSON.
  - Footer or any “upload your report” prompts.
- `README.md`: replace manual JSON upload instructions.
- `docs/git-metadata.md`: ensure binary flow and token guidance align.

## Repository Research Summary (Local)
- Navigation and meta copy live in `src/html.ts` (`layout()`), including the Upload link, meta descriptions, and homepage CTA.
- Upload form and manual JSON workflow live in `src/html.ts` (`uploadPage()`).
- “How it works” and About content include manual upload steps in `src/html.ts`.
- Routes in `src/index.ts` include `/upload` and `/api/upload`.
- Settings page already includes token generation and CLI links in `src/html.ts`.

## Institutional Learnings
- No `docs/solutions/` found in the repo; no prior learnings to apply.

## External Research Decision
- Skip external research. This is a product copy/UI restructuring task with clear internal direction and existing patterns.

## SpecFlow Analysis (User Flow Gaps)
- **First run without config**: Should show onboarding message and no upload attempt (align with CLI behavior).
- **User without token**: Must be guided to Settings with a clear “generate token” step.
- **OS mismatch**: Detected OS card should still let users switch to other OS cards.
- **Missing Node**: Troubleshooting must clarify ccusage dependency and an example command.
- **Non‑logged‑in users**: Ensure the Install page still guides to login/token if required.
- **Link affordances**: Settings CTA should be obvious and above the OS cards.
- **Collapsed OS cards**: Ensure keyboard access and a clear visual affordance.

## Acceptance Criteria
- [x] `/upload` page is binary‑only; JSON file upload and paste UI removed.
- [x] Install page shows OS‑detected primary card with download + one‑liner.
- [x] Other OS cards are available but collapsed.
- [x] Explicit step to run `--add-repo` from a project folder.
- [x] “Multiple devices” section mentions `--machine`.
- [x] Troubleshooting section includes mise guidance + `npx` example.
- [x] Nav label changed from “Upload” to “Install”; secondary links moved under “More.”
- [x] Meta/SEO copy updated to remove “upload ccusage reports” phrasing.
- [x] About/How‑it‑works steps updated to reflect binary‑first flow.
- [x] `/api/upload` remains unchanged and functional for CLI.
- [x] Install page works for logged‑out users (clear path to sign in / token).

## Success Metrics
- Increase in first‑run successful uploads (binary flow completion).
- Reduced support questions about manual JSON uploads.

## Implementation Notes (UI)
- OS detection can be client‑side using `navigator.userAgent` with a safe fallback (“Choose your OS”).
- Collapsed cards: render as buttons/toggles; expand to show download + command.
- Use copy‑to‑clipboard for the one‑liner if possible (optional).

## Testing Notes
- Manual check: logged‑out vs logged‑in view of Install page.
- Manual check: nav “More” menu on desktop and mobile.
- Manual check: OS detection fallback when user agent is unknown.

## Dependencies & Risks
- **Copy drift**: Multiple pages reference manual uploads; ensure a full pass.
- **Nav changes**: Ensure both desktop and mobile nav are updated consistently.
- **OS detection**: Need a safe fallback if detection fails.

## References & Research
- Upload page: `src/html.ts` → `uploadPage()`
- Nav + meta copy: `src/html.ts` → `layout()`
- About/How it works: `src/html.ts`
- Routes: `src/index.ts` (`/upload`, `/api/upload`)
- Settings token section: `src/html.ts` (settings page)
- Brainstorm: `docs/brainstorms/2026-02-23-upload-page-binary-onboarding-brainstorm.md`
