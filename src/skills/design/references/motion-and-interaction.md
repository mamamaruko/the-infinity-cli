# Motion and Interaction Reference

## Purpose

Motion should explain cause and effect, confirm actions, and reduce ambiguity.

## Timing Baseline

- Micro feedback (hover, press): 80-140ms
- Standard transitions: 160-240ms
- Enter/exit panels: 220-320ms

Use ease-out for entry and ease-in for exit when appropriate.

## Interaction States

Define behavior for:

- idle
- hover
- focus
- pressed
- loading
- success/error resolution

## Motion Principles

- Move one thing with intent, not many things without hierarchy
- Keep direction consistent with layout flow
- Use opacity + translate before complex transforms

## Reduced Motion

- Respect `prefers-reduced-motion`
- Replace large motion with opacity or instant state changes
- Preserve usability even with zero animation

## Anti-Patterns

- Decorative animation that delays primary task
- Inconsistent easing between related components
- Loading indicators with no progress meaning
