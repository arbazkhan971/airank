---
status: ready
priority: p1
issue_id: "004"
tags: [cli, git, config]
dependencies: []
---

# Config-based repo discovery for ccrank-git

Switch CLI repo discovery to ~/.ccrank/repos.json, add --add-repo onboarding, and auto-run ccusage.

## Problem Statement
Current discovery relies on Claude metadata paths, leading to "no valid git repos". Need config-based opt-in with simple onboarding and automatic ccusage upload.

## Findings
- CLI entrypoint: `cli/ccrank-git/main.go`
- Docs: `docs/git-metadata.md`, README Git metadata section
- Config should be a simple repos array; ccusage auto-run required

## Proposed Solutions
### Option 1: Config as source of truth (selected)
**Approach:** Use `~/.ccrank/repos.json`, auto-create if missing, `--add-repo` adds current repo or scans for top 30 most-recent repos.

**Pros:** Predictable uploads, fast, user-controlled.
**Cons:** Requires onboarding step.

**Effort:** 2-4 hours
**Risk:** Low

## Recommended Action
Implement config-driven discovery, update docs, ensure onboarding messages, and maintain machine flag behavior.

## Technical Details
Affected files:
- `cli/ccrank-git/main.go`
- `docs/git-metadata.md`
- `README.md`

## Acceptance Criteria
- [ ] `~/.ccrank/repos.json` created on startup if missing; CLI prints onboarding message and exits (no upload)
- [ ] `--add-repo` adds current repo if inside git repo; otherwise scans and adds up to 30 most-recently-committed repos
- [ ] Config auto-used for uploads; `--all-repos` removed or deprecated
- [ ] `--machine` remains, defaults to hostname; user can change on later uploads
- [ ] ccusage auto-runs; if Node missing, print guidance (mise + npx example)
- [ ] Docs updated for new onboarding

## Work Log
### 2026-02-21 - Start
**By:** Claude Code

**Actions:**
- Created ready todo from plan

### 2026-02-21 - Implementation
**By:** Claude Code

**Actions:**
- Updated CLI to use config-driven discovery and auto-run ccusage
- Added onboarding messages and config creation behavior
- Updated docs for `--add-repo` and config usage
