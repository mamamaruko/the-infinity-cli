# psi Cleanup Manifest

Date: 2026-02-17
Scope: psi content hygiene (empty files, duplicate slugs, naming normalization)

## Removed

- `ψ/inbox/focus.md` (empty placeholder)
- `ψ/memory/learnings/2026-02-04_skill-self-validation-pattern-date-2026-02.md` (duplicate of canonical file)
- `ψ/memory/learnings/2026-02-05_subagent-path-handling-pattern-when-spawning-su.md` (duplicate of canonical file)
- `ψ/memory/learnings/2026-02-01_sibling-worktrees-for-ide-compatibility-when-cr.md` (duplicate of canonical file)

## Renamed / Normalized

- `ψ/memory/learnings/2026-02-04_forward-plan-mode-chain-pattern-date-202.md`
  -> `ψ/memory/learnings/2026-02-04_forward-plan-mode-chain-pattern.md`
  - normalized heading structure
  - added explicit confidence line
  - converted trailing footer to tags section

## Policy Update

- Updated `ψ/README.md`:
  - parent repo reference aligned to current identity
  - removed stale mention of `focus.md`
  - added "Historical Policy" section for legacy-name context handling
