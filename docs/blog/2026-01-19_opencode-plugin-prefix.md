# OpenCode Plugin: Message Prefix for Session Identification

**Date**: 2026-01-19
**Version**: v1.4.0
**Branch**: dev/opencode-hooks

## The Problem

When using OpenCode with The Infinity Skills, there's no way to know if The Infinity Skills are active in a session. Users and agents can't easily identify which sessions have Infinity capabilities installed.

## The Solution

A simple OpenCode plugin that prefixes all user messages with `opencode-cli:`. This creates a clear identifier that The Infinity Skills are active.

## How It Works

```typescript
const PREFIX = "opencode-cli:"

const TheInfinitySkillsPlugin: Plugin = () => ({
  name: "the-infinity-skills",
  
  "experimental.chat.messages.transform": (_input: any, output: any) => {
    if (output?.messages && Array.isArray(output.messages)) {
      for (const msg of output.messages) {
        const role = msg.info?.role || msg.role
        if (role === "user" && msg.parts && Array.isArray(msg.parts)) {
          for (const part of msg.parts) {
            if (part.type === "text" && part.text && !part.text.startsWith(PREFIX)) {
              part.text = `${PREFIX} ${part.text}`
            }
          }
        }
      }
    }
  },
})
```

## Key Discovery

OpenCode's message structure uses `msg.info.role` not `msg.role`. This was discovered through source code archaeology of the Soul-Brews OpenCode fork.

## Installation

The plugin is automatically installed when you run:

```bash
bunx the-infinity-skills install -a opencode -g
```

This installs to:
- Global: `~/.config/opencode/plugins/the-infinity-skills.ts`
- Local: `.opencode/plugins/the-infinity-skills.ts`

## Impact

- **Session Identification**: Instantly know if The Infinity Skills are active
- **Debugging**: Easier to trace which sessions have Oracle capabilities
- **Future**: Foundation for more advanced hook integrations

## What's Next

- Consider adding todo continuation enforcer
- System prompt injection for skill awareness
- More hooks based on oh-my-opencode patterns

---

*the-infinity-cli v1.4.0 - OpenCode Plugin Support*
