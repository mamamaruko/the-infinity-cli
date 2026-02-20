---
name: gemini
description: Control Gemini browser tab via MQTT bridge. Use when user says "gemini", wants to send message to Gemini, inspect Gemini tabs, or run Gemini deep research flow.
---

# /gemini - Gemini Bridge Control

Control Gemini browser actions through MQTT command/response topics.

## Usage

```bash
/gemini status
/gemini tabs
/gemini chat "hello"
/gemini chat --tab 123 "hello"
/gemini new "hello in new tab"
/gemini model thinking --tab 123
/gemini research "compare S-33 vs T-58"
/gemini transcribe https://youtube.com/watch?v=...
```

## Requirements

- Gemini browser proxy extension connected
- Mosquitto broker with:
  - TCP `1883` for CLI scripts
  - WebSocket `9001` for browser extension
- `mosquitto_pub` and `mosquitto_sub` installed

## Topics

- Command: `claude/browser/command`
- Response: `claude/browser/response`
- Status: `claude/browser/status`

## Step 1: Parse Subcommand

Parse first word of `$ARGUMENTS`:

- `status` -> run `scripts/status.ts`
- `tabs` -> run `scripts/list-tabs.ts`
- `chat` -> run `scripts/send-chat.ts [rest]`
- `new` -> run `scripts/send-chat.ts --new-tab [rest]`
- `model` -> run `scripts/set-model.ts [rest]`
- `research` -> run `scripts/deep-research.ts [rest]`
- `transcribe` -> run `scripts/youtube-transcribe.ts [rest]`
- empty -> show usage + run `scripts/status.ts`

## Step 2: Execute Script

```bash
bun scripts/status.ts
bun scripts/list-tabs.ts
bun scripts/send-chat.ts $ARGUMENTS
bun scripts/set-model.ts $ARGUMENTS
bun scripts/deep-research.ts $ARGUMENTS
bun scripts/youtube-transcribe.ts $ARGUMENTS
```

## Troubleshooting

- If timeout: check extension online with `status`
- If no tabs: create with `new` or open Gemini manually
- If commands fail: verify topics are exactly `claude/browser/*`

---

ARGUMENTS: $ARGUMENTS
