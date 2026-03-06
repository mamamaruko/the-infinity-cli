---
name: design
description: Research-first product design skill without mandatory MCP. Use when user says "design this", "create UI direction", "analyze UX", "make a design brief", or "improve interface".
---

# /design - Research-First Design Skill (MCP Optional)

Design intentional interfaces with a practical workflow that works now without custom MCP, and scales later with one.

## Usage

```
/design [task]
/design --quick [task]
/design --deep [task]
```

- `--quick`: fast design brief + first direction
- default: full brief + research + system + implementation checklist
- `--deep`: add alternatives, risk table, and stricter quality gate

## Reference Library

Use these files during execution:

- `references/research-playbook.md`
- `references/typography.md`
- `references/color-and-contrast.md`
- `references/motion-and-interaction.md`
- `references/content-and-conversion.md`
- `references/implementation-qa.md`
- `references/anti-slop.md`

## Core Principle

Do not copy visuals blindly. Copy reasoning patterns, then rebuild in our product voice.

## Step 0: Clarify Intent

Turn the request into this brief format:

```markdown
## Design Brief
- Screen / Flow:
- User:
- Main job to be done:
- Primary action:
- Objections to resolve:
- Tone and energy:
- Constraints (brand, technical, legal):
- Success metric:
```

## Step 1: Collect References (No Custom MCP Required)

Use available sources in this order:

1. Existing product patterns in current repo
2. Public references (docs, screenshots, known products)
3. Any available search tools

If external UI MCP is available, use it. If not, continue normally.

Use `references/research-playbook.md` as the mandatory operating guide for query angles, capture format, and stop conditions.

```markdown
## Research Log
- Query / source:
- Why chosen:
- Observed pattern:
- Copy that worked:
- Interaction detail:
- What to adapt for our context:
```

Minimum bar:
- 8+ references for a single screen
- 3+ flows for multi-step journey
- At least 1 counter-example (what not to do)

## Step 2: Synthesize, Do Not Mimic

Produce:

```markdown
## Pattern Table
| Pattern | Seen in | Why it works | Keep / Adapt / Drop |
|---------|----------|--------------|----------------------|

## Steal List (Reasoned)
- Pattern + reason + adaptation note

## Risks
- Risk
- Impact
- Mitigation
```

## Step 3: Build Design Direction

Create a practical spec:

```markdown
## Design Direction
- Narrative hook:
- Layout model:
- Type scale:
- Color roles:
- Component style:
- Motion strategy:
- Accessibility constraints:

## Content Strategy
- Headline logic:
- Proof / trust block:
- Objection handling:
- CTA hierarchy:
```

Rules:
- Avoid generic template look
- No default accent palette by habit
- Every decision must have a reason tied to user/job/metric

Use these references while shaping direction:

- Type and hierarchy: `references/typography.md`
- Palette and accessibility: `references/color-and-contrast.md`
- Motion and states: `references/motion-and-interaction.md`
- Messaging and CTA logic: `references/content-and-conversion.md`

## Step 4: Implementation Handoff

Output:

```markdown
## Implementation Checklist
- Semantic structure and hierarchy
- Tokens (type, color, spacing)
- States (hover/focus/disabled/error)
- Responsive behavior
- Motion and reduced-motion
- Accessibility checks (contrast, keyboard, labels)
- QA against reference patterns
```

## Output Contract

At completion, return all of these:

1. Design Brief
2. Research Log
3. Pattern Table
4. Steal List
5. Design Direction
6. Implementation Checklist
7. Quality Gate result (pass/fail with notes)

Before final output, run both:

- `references/implementation-qa.md`
- `references/anti-slop.md`

## Quality Gate

Pass only if all are true:
- Solves the stated job to be done
- Clear visual hierarchy in 5-second scan
- Distinct identity (not interchangeable with default AI layout)
- Primary CTA is unambiguous
- Accessibility baseline is satisfied
- Can explain why each major decision exists

## MCP Decision Policy

You do not need custom MCP to start.

Build custom MCP only when at least one is true:
- We need proprietary/private design data
- We repeatedly perform the same reference lookup manually
- We need strict consistency and traceability at scale

Until then, use current tools and keep the workflow artifact-driven.
