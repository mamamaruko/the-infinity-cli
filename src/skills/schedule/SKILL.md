---
name: schedule
description: Query schedule.md with a built-in parser. Use when user says "schedule", "upcoming events", "what's on today", "calendar".
---

# /schedule - Query Schedule

Query schedule.md with a built-in parser for fast, structured access.

## Usage

- `/schedule` → Show upcoming events (next 7 days)
- `/schedule january` → Show January 2026 events
- `/schedule today` → Today's events only
- `/schedule bitkub` → Search for specific keyword

## Implementation

Run the query script:

```bash
.claude/skills/schedule/scripts/query.ts [filter]
```

Script handles:
1. Parse `ψ/inbox/schedule.md`
2. Filter by section or keyword
3. Output markdown table

## Quick Reference

| Filter | Query |
|--------|-------|
| `upcoming` | January 2026 section |
| `today` | Events matching today's date |
| `[keyword]` | LIKE '%keyword%' search |

## See Also

- `scripts/query.ts` - Main query script
- `ψ/inbox/schedule.md` - Source file
