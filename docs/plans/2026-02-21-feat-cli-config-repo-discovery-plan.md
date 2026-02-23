---
title: feat: Config-based repo discovery for ccrank-git
type: feat
status: completed
date: 2026-02-21
---

# feat: Config-based repo discovery for ccrank-git

## Overview
Switch the Go CLI (`cli/ccrank-git`) to use a single config file (`~/.ccrank/repos.json`) as the source of truth for which git repositories to upload. Add an onboarding flow via `--add-repo` that adds the current repo (when inside a git repo) or recursively discovers up to 30 most‑recently‑committed repos (when run outside a git repo). ccusage upload runs automatically in the same CLI run.

## Problem Statement / Motivation
The current repo discovery relies on Claude internal project metadata directories, which are not actual repo paths. This leads to “no valid git repos found.” A config‑driven approach is predictable, user‑controlled, and matches the intended UX: run a simple command in a project folder once, then future uploads are fast and reliable.

## Proposed Solution
- Introduce a config file `~/.ccrank/repos.json` containing `{"repos": ["/path/one", "/path/two"]}`.
- Update CLI behavior:
  - If config does not exist, create it on startup and print a short onboarding message.
  - Config is always used automatically for uploads (no `--all-repos`).
  - `--add-repo` is the only repo‑adding flag.
  - When inside a git repo, `--add-repo` adds only the current repo.
  - When outside a git repo, `--add-repo` scans recursively from the current folder, selects up to 30 repos by most recent commit (`git log -1 --format=%ct`), and merges them into config.
  - Deduplicate by normalized absolute path.
  - `--machine` stays and defaults to hostname; allow users to change it on later uploads.
  - ccusage upload runs by default in the same execution (no separate flag required).
- Update docs to describe the new onboarding step and config path.

### UX / Messaging (Onboarding)
- Add a brief onboarding snippet explaining:
  - The config file is created at `~/.ccrank/repos.json`.
  - Users should run `ccrank-git --add-repo` inside a project folder to opt in that repo.
  - If run outside a repo (e.g., a folder like `~/code`), the tool will find up to 30 repos by recent commit activity and add them to the config.
  - If Node is missing, instruct users to install `mise` and run `npx ccusage@latest daily --json` from the repo path (example guidance).

### Backward Compatibility
- Keep `--repo` for explicit single-repo runs.
- Decide how to handle `--all` / `--all-repos` flags if users still pass them:
  - Option A: keep as aliases (no behavior change).
  - Option B: deprecate with a warning.
  - Recommendation: alias to the new default behavior and print a short deprecation message.

## Technical Considerations
- **CLI entry**: `cli/ccrank-git/main.go` contains current flags (`--all-repos`, `--all`, `--repo`, `--machine`); these need to be revised.
- **Repo scanning**: prefer git commit timestamp over filesystem mtime to select top 30.
- **Config writes**: create `~/.ccrank/` if missing, write JSON with newline, merge and dedupe.
- **ccusage auto-run**: Node dependency is required. If missing, print guidance to install `mise` and the example `npx` command.
- **Path normalization**: use absolute paths and resolve `~` for dedupe; consider `EvalSymlinks` for stability.
- **Recursion guard**: skip `.git` directories once found; avoid descending into nested `.git` and consider symlink handling.
- **Large trees**: scanning should short-circuit once candidate repos exceed 30 (still need top 30 by recency).

## Acceptance Criteria
- [x] `~/.ccrank/repos.json` exists with `{"repos": [...]}` after running `--add-repo`.
- [x] When run inside a git repo, `--add-repo` adds only that repo (no recursion).
- [x] When run outside a git repo, `--add-repo` scans recursively, adds up to 30 repos chosen by most recent commit activity, and reports that the limit is 30.
- [x] Upload uses config automatically when it exists, without requiring `--all-repos`.
- [x] Paths are normalized and duplicates are skipped when merging.
- [x] ccusage upload runs automatically in the same CLI invocation by default.
- [x] When Node is missing, CLI prints guidance to install `mise` and the example `npx` command.
- [x] `docs/git-metadata.md` and README onboarding text are updated to reflect config‑based usage and `--add-repo`.
- [x] `--all` / `--all-repos` behavior is either aliased or cleanly deprecated with a clear message.

## Success Metrics
- Reduction in “no valid git repos found” reports.
- % of users who complete `--add-repo` onboarding and successfully upload.

## Dependencies & Risks
- **Node availability**: ccusage auto‑run will fail without Node; decide error policy.
- **Large scans**: recursive scan can be slow in large directories; enforce max 30 + early exit.
- **User expectations**: clarify in docs that config is the source of truth.
- **Token leakage risk**: ensure errors do not echo tokens (maintain current behavior).

## SpecFlow Analysis (Key Gaps to Address)
- **Missing config**: Define behavior when config does not exist or is empty (fallback to current repo, or error?).
- **Invalid JSON**: Define CLI behavior if `repos.json` is malformed.
- **ccusage failure**: Decide whether to fail the whole run or continue after git upload.
- **Permissions**: Handling when `~/.ccrank/` is not writable.
- **Repo limits**: Confirm the user‑facing message when capping at 30 repos.
- **Alias flags**: Determine messaging for users who still use `--all` or `--all-repos`.

## References & Research
- CLI entrypoint: `cli/ccrank-git/main.go`
- Git metadata docs: `docs/git-metadata.md`
- README section: `README.md` (Git metadata section)
- Brainstorm: `docs/brainstorms/2026-02-21-cli-config-repos-brainstorm.md`
