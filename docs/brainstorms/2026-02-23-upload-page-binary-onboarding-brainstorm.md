---
date: 2026-02-23
topic: upload-page-binary-onboarding
---

# Upload Page → Binary Onboarding (Julie Zhuo Lens)

## What We’re Building
Replace the current JSON upload form with a binary‑only onboarding page that drives a first successful upload. The page should make the “right next action” obvious and remove everything that doesn’t directly help the user finish the flow. It will highlight token generation (via Settings), present OS‑specific install/run instructions, and guide users to run `--add-repo` from a project folder before running the upload command. A small troubleshooting section will cover missing Node for ccusage.

## Why This Approach
The job‑to‑be‑done is “first successful upload.” The existing form invites the wrong behavior (manual JSON), while the CLI is now the canonical path. A single, OS‑aware pathway reduces cognitive load and helps users avoid the top two failure points: missing token and not adding repos. This approach honors Julie Zhuo’s principle: every element must earn its place.

## Key Decisions
- Primary outcome: first successful upload (binary end‑to‑end).
- Upload page becomes binary‑only (removes manual JSON upload).
- Token generation lives in Settings; page links there as Step 1.
- Layout uses OS detection: detected OS card expanded, other OS cards collapsed.
- Each OS card includes a download link and a one‑liner run command.
- `--add-repo` is a separate explicit step (run inside project folder).
- Add a short “multiple devices” section mentioning `--machine`.
- Include a small troubleshooting section for missing Node with `mise` guidance and the `npx` example.
- Rename nav label from “Upload” to “Install” (URL can remain `/upload`).
- Review other pages for obsolescence and alignment:
  - Settings page token section remains the source of truth.
  - Any copy referencing manual JSON upload must be removed or updated.
  - Navigation and onboarding flows should point to Install (not Upload).
  - Update meta/SEO copy that says “upload ccusage reports” to “install the CLI / run the binary.”
  - Keep `/api/upload` (still used by the CLI) even though the web form is removed.
  - Evaluate all user‑facing pages for Julie‑Zhuo clarity (every element earns its place).
- Navigation simplification: keep primary action visible (Install) and collapse secondary items under “More”.

## Open Questions
- Which pages/sections currently reference manual uploads (homepage, footer, meta, docs) and should be updated in the same pass?

## Next Steps
→ `/prompts:workflows-plan` to design and implement the new upload page content and navigation label.
