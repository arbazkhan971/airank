---
status: complete
priority: p1
issue_id: "005"
tags: [ui, onboarding, docs]
dependencies: []
---

# Binary-first install onboarding page

Replace Upload page with binary-first install onboarding, update nav + copy across the site, and align README/docs.

## Problem Statement
The Upload page still promotes manual JSON uploads, which is no longer the primary flow. Users need a clear, binary-first install path with OS-specific commands and a focused CTA.

## Findings
- Upload page and nav are in `src/html.ts`.
- Meta/SEO copy and “how it works” steps reference manual uploads.
- README and docs still mention manual JSON upload steps.

## Proposed Solutions
### Option 1: Binary-first install page with OS detection (selected)
**Approach:** Replace `/upload` with an install guide that highlights token generation, OS-specific download + run, `--add-repo`, and troubleshooting.

**Pros:** Clear first-success flow, reduced confusion.
**Cons:** Requires broad copy updates.

**Effort:** 3–5 hours
**Risk:** Medium (sitewide copy drift)

## Recommended Action
Implement install page content and nav changes, update copy across all pages, and align README/docs. Add copy-to-clipboard and OS detection.

## Acceptance Criteria
- [ ] `/upload` page is binary-only (no JSON form)
- [ ] OS-detected primary card with copy-to-clipboard one-liner
- [ ] `--add-repo` step included explicitly
- [ ] “Multiple devices” + `--machine` section
- [ ] Troubleshooting includes mise + `npx` example
- [ ] Nav label “Install” and secondary items under “More”
- [ ] Meta/SEO copy updated to remove manual upload language
- [ ] About/How-it-works steps updated
- [ ] README + docs updated

## Work Log
### 2026-02-23 - Start
**By:** Claude Code

**Actions:**
- Created ready todo from plan

### 2026-02-23 - Implementation
**By:** Claude Code

**Actions:**
- Replaced Upload page with binary-first Install flow
- Added OS detection, copy-to-clipboard commands, and troubleshooting
- Simplified nav with Install as primary and More for secondary links
- Updated homepage, About, and README copy to remove manual upload references
