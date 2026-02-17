#!/bin/bash
# The Infinity Skills Installer - One command to install everything

set -e

echo "∞ The Infinity Skills Installer"
echo ""

# 0. Check & install Claude Code
if ! command -v claude &> /dev/null; then
  echo "📦 Installing Claude Code..."
  curl -fsSL https://claude.ai/install.sh | bash
else
  echo "✓ Claude Code installed"
fi

# 1. Check & install bun
if ! command -v bun &> /dev/null; then
  echo "📦 Installing bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
else
  echo "✓ bun installed"
fi

# 2. Check & install ghq
if ! command -v ghq &> /dev/null; then
  echo "📦 Installing ghq..."
  if command -v brew &> /dev/null; then
    brew install ghq
  elif command -v go &> /dev/null; then
    go install github.com/x-motemen/ghq@latest
  else
    echo "⚠️  Please install ghq manually: brew install ghq"
  fi
else
  echo "✓ ghq installed"
fi

# 3. Get latest stable version
echo "🔍 Fetching latest stable version..."
LATEST_TAG=$(curl -s https://api.github.com/repos/mamamaruko/the-infinity-cli/releases/latest | grep '"tag_name"' | cut -d'"' -f4)

if [ -z "$LATEST_TAG" ]; then
  echo "⚠️  Could not fetch latest version, using fallback v1.5.82"
  LATEST_TAG="v1.5.82"
fi

echo "📦 Installing the-infinity-skills@$LATEST_TAG..."
~/.bun/bin/bunx --bun \
  the-infinity-skills@github:mamamaruko/the-infinity-cli#$LATEST_TAG \
  install -g -y

echo ""
echo "✨ Done! Now:"
echo ""
echo "1. Restart Claude Code"
echo "2. Copy this prompt to the fresh Claude:"
echo ""
echo "─────────────────────────────────────────"
cat << 'PROMPT'
Set timezone to GMT+7 and setup Oracle permissions:

```bash
export TZ='Asia/Bangkok'
```

Then setup permissions:

```bash
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
```

Then run: /awaken
PROMPT
echo "─────────────────────────────────────────"
