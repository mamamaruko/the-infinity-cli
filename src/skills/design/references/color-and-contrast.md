# Color and Contrast Reference

## Purpose

Color must communicate structure and state, not just decoration.

## Palette Roles

- Neutral base: surfaces, borders, text scaffolding
- Accent: key interaction and identity moments
- Semantic: success, warning, error, info
- Effects: subtle highlights, gradients, overlays

## Practical Rules

- Start from neutral system first, add accent last
- Use accent for decisions, not for every component
- Keep semantic colors reserved for status meaning

## Contrast Baseline

- Body text: target WCAG AA (4.5:1)
- Large text and UI elements: at least 3:1 where allowed
- Critical action labels should exceed minimum when possible

## State Clarity

Each interactive component should distinguish:

- default
- hover
- focus
- active
- disabled
- error

Do not rely on color alone; pair with shape, icon, label, or motion.

## Anti-Patterns

- Defaulting to generic accent palettes without reason
- Saturated gradients under dense text
- Barely visible disabled states
- Status colors reused as brand accents
