---
date: 2026-02-21
topic: cli-config-repos
---

# CLI Config-Based Repo Discovery

## What We’re Building
We will switch the Go CLI to a config-driven model for git repo discovery. A single config file at `~/.ccrank/repos.json` will be the source of truth for which repos are uploaded. The CLI will support an onboarding flow where users run `--add-repo` from a project folder to add that repo to the config. If `--add-repo` is run in a non‑git folder, the CLI will scan recursively from that folder and add up to 30 repos, chosen by most recent commit activity.

The CLI will use this config automatically for uploads when it exists, without requiring `--all-repos`. The only repo-related flag remains `--add-repo` (and `--repo` for explicit single‑repo runs). ccusage upload should be automatically included in the same run.

## Why This Approach
This matches the desired UX: users explicitly opt in repos by adding them once, and uploads remain fast and predictable. It avoids parsing Claude’s internal project metadata and keeps control in the user’s hands. It also supports a simple onboarding message: the tool creates a predictable config file and users can run `--add-repo` from their current project folder.

## Key Decisions
- **Config format**: `~/.ccrank/repos.json` with `{ "repos": ["/path/one", "/path/two"] }`.
- **Auto-config usage**: if the config file exists, use it by default (no `--all-repos` needed).
- **Add behavior**: inside a git repo, add only the current repo; outside a git repo, scan recursively and add up to 30 repos.
- **Top 30 rule**: choose the 30 most recently committed repos (based on `git log -1 --format=%ct`).
- **Deduping**: normalize paths and skip duplicates when merging into config.
- **Single config file**: no multi‑scope configs for now.
- **ccusage auto‑included**: when running the CLI, ccusage upload is included by default.

## Open Questions
- None.

## Next Steps
→ `/prompts:workflows-plan` for implementation details.
