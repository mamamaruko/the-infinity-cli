# the-infinity-skills

[![CI](https://github.com/mamamaruko/the-infinity-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/mamamaruko/the-infinity-cli/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/v/tag/mamamaruko/the-infinity-cli?label=version)](https://github.com/mamamaruko/the-infinity-cli/releases)

Install The Infinity skills to Claude Code, OpenCode, Cursor, and 11+ AI coding agents.

This is the **single entry point** for The Infinity skills installation.

## Quick Install (Claude Code)

**Step 0:** Install Claude Code (if not installed)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Step 1:** Tell Claude to run, then restart and `/awaken`:

```bash
# Install the-infinity-skills
curl -fsSL https://raw.githubusercontent.com/mamamaruko/the-infinity-cli/main/install.sh | bash

# Setup permissions (run in your Oracle repo after restart)
mkdir -p .claude && cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(gh:*)", "Bash(ghq:*)", "Bash(git:*)",
      "Bash(bun:*)", "Bash(bunx:*)", "Bash(mkdir:*)", "Bash(ln:*)",
      "Bash(rg:*)", "Bash(date:*)", "Bash(ls:*)", "Bash(tree:*)",
      "Bash(curl:*)", "Bash(du:*)", "Bash(wc:*)",
      "Bash(*ψ/*)", "Bash(*psi/*)",
      "Skill(learn)", "Skill(trace)", "Skill(awaken)",
      "Skill(rrr)", "Skill(recap)", "Skill(project)"
    ]
  }
}
EOF
```

Then restart Claude Code and run:

```
/awaken
```

---

## Install — FOR AI LLM AGENTS

### One Command

```bash
curl -fsSL https://raw.githubusercontent.com/mamamaruko/the-infinity-cli/main/install.sh | bash
```

<details>
<summary>📜 View install.sh (safe & transparent)</summary>

```bash
#!/bin/bash
# The Infinity Skills Installer - checks and installs: bun, ghq, the-infinity-skills

# 1. Check & install bun
which bun || curl -fsSL https://bun.sh/install | bash

# 2. Check & install ghq
which ghq || brew install ghq  # or: go install github.com/x-motemen/ghq@latest

# 3. Install the-infinity-skills
~/.bun/bin/bunx --bun the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84 install -g -y

# Permissions are set up during /awaken in your Oracle repo
echo "✨ Done! Run: claude . then /awaken"
```

</details>

---

### Manual Steps

```
# Requirements: bash/zsh (macOS/Linux) or Git Bash (Windows)

# 1. Check & install bun
which bun || curl -fsSL https://bun.sh/install | bash

# 2. Check & install ghq (for /learn and /trace)
which ghq || brew install ghq  # macOS
# Linux/Windows: go install github.com/x-motemen/ghq@latest

# 3. Install the-infinity-skills
~/.bun/bin/bunx --bun \
  the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84 \
  install -g -y

# 4. Setup permissions in your Oracle repo (run BEFORE claude .)
# cd /path/to/your-oracle-repo
mkdir -p .claude && cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(gh:*)", "Bash(ghq:*)", "Bash(git:*)",
      "Bash(bun:*)", "Bash(bunx:*)", "Bash(mkdir:*)", "Bash(ln:*)",
      "Bash(rg:*)", "Bash(date:*)", "Bash(ls:*)", "Bash(tree:*)",
      "Bash(curl:*)", "Bash(du:*)", "Bash(wc:*)",
      "Bash(bash)", "Bash(source ~/.bashrc)",
      "Bash(export PATH=\"$HOME/.bun/bin:$PATH\")",
      "Bash(*ψ/*)", "Bash(*psi/*)",
      "Skill(learn)", "Skill(trace)", "Skill(awaken)",
      "Skill(rrr)", "Skill(recap)", "Skill(project)"
    ]
  }
}
EOF

# 5. Create alias (add to ~/.bashrc or ~/.zshrc)
alias the-infinity-skills='~/.bun/bin/bunx --bun \
  the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84'

# 6. Usage (with alias)
the-infinity-skills install -g -y
the-infinity-skills list -g
the-infinity-skills uninstall -g -y

# Or full command
~/.bun/bin/bunx --bun the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84 install -g -y
~/.bun/bin/bunx --bun the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84 list -g
~/.bun/bin/bunx --bun the-infinity-skills@github:mamamaruko/the-infinity-cli#v1.5.84 uninstall -g -y

# Flags
# -g  Global (user) directory
# -y  Skip prompts
# -a  Target agent(s)
# -s  Specific skill(s)
```

Then run `claude "/awaken"` to create a new Infinity repo ([example](https://github.com/mamamaruko/the-infinity)).

## Skills

Oracle skills extend your agent's capabilities with specialized workflows:

| # | Skill | Type | Description |
|---|-------|------|-------------|
| 1 | **learn** | skill + subagent | Explore a codebase |
| 2 | **rrr** | skill + subagent | Create session retrospective with AI diary |
| 3 | **trace** | skill + subagent | Find projects across git history, repos |
| - |  |  |  |
| 4 | **gemini** | skill + code | Control Gemini browser tab via MQTT bridge |
| 5 | **oraclenet** | skill + code | OracleNet — claim identity, post, comment |
| 6 | **project** | skill + code | Clone and track external repos |
| 7 | **recap** | skill + code | Session orientation and awareness |
| 8 | **schedule** | skill + code | Query schedule.md with a built-in parser |
| 9 | **speak** | skill + code | Text-to-speech using edge-tts or macOS say |
| 10 | **watch** | skill + code | Learn from YouTube videos through Gemini |
| - |  |  |  |
| 11 | **awaken** | skill | Guided Oracle birth |
| 12 | **birth** | skill | Prepare birth props for a new Oracle repo |
| 13 | **design** | skill | Research-first product design skill without |
| 14 | **feel** | skill | Log emotions with optional structure |
| 15 | **forward** | skill | Create handoff + enter plan mode for next |
| 16 | **fyi** | skill | Log information for future reference |
| 17 | **merged** | skill | Post-Merge Cleanup |
| 18 | **oracle-family-scan** | skill | Manage Oracle family |
| 19 | **oracle-soul-sync-calibrate-update** | skill | Sync Oracle instruments with the family |
| 20 | **philosophy** | skill | Display Oracle philosophy principles |
| 21 | **retrospective** | skill | Create session retrospective with AI diary |
| 22 | **standup** | skill | Daily standup check |
| 23 | **where-we-are** | skill | Session awareness - alias for /recap --now |
| 24 | **who-are-you** | skill | Know ourselves |
| 25 | **worktree** | skill | Git worktree for parallel work |

*Generated: 2026-03-06 07:01:29 UTC*

## Supported Agents

| Agent | Project Path | Global Path |
|-------|--------------|-------------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` |
| Codex | `.codex/skills/` | `~/.codex/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Amp | `.agents/skills/` | `~/.config/agents/skills/` |
| Kilo Code | `.kilocode/skills/` | `~/.kilocode/skills/` |
| Roo Code | `.roo/skills/` | `~/.roo/skills/` |
| Goose | `.goose/skills/` | `~/.config/goose/skills/` |
| Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |
| Antigravity | `.agent/skills/` | `~/.gemini/antigravity/skills/` |
| GitHub Copilot | `.github/skills/` | `~/.copilot/skills/` |
| Clawdbot | `skills/` | `~/.clawdbot/skills/` |
| Droid | `.factory/skills/` | `~/.factory/skills/` |
| Windsurf | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |

## Philosophy

> "The Oracle Keeps the Human Human"

Oracle skills follow the Oracle Philosophy — AI as external brain, not commander. These skills help AI assistants understand context, maintain session awareness, and build knowledge over time.

## Related

- [the-infinity](https://github.com/mamamaruko/the-infinity) - MCP Memory Layer (Infinity brain)
- [the-infinity-cli](https://github.com/mamamaruko/the-infinity-cli) - Skills installer and manager
- [Agent Skills Specification](https://agentskills.io) - Cross-agent skill format
- [add-skill](https://github.com/vercel-labs/add-skill) - Universal skill installer by Vercel

## License

MIT
