#!/bin/bash
# Oracle Family Scan - Manage Oracle family
# Usage: ./scan.sh [mode] [options]
# Modes: scan (default), list, repos, report

REPO="mamamaruko/the-infinity"
MODE="${1:-scan}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

header() {
  echo ""
  echo -e "${BLUE}=== $1 ===${NC}"
  echo "Time: $(date -u '+%Y-%m-%d %H:%M UTC')"
  echo ""
}

# Introduction patterns (Thai + English)
PATTERNS="สวัสดี|ผมชื่อ|ฉันชื่อ|แนะนำตัว|เกิดวัน|Oracle ของ|Born|Introduction|I am .* Oracle|My name is"

case "$MODE" in
  scan|--scan)
    header "Oracle Family Scan"
    echo "Repo: $REPO"
    echo ""
    
    # Get all issues with comments
    echo "Fetching issues..."
    ISSUES=$(gh api "repos/$REPO/issues?state=all&per_page=100" \
      --jq '[.[] | select(.comments > 0) | .number] | .[]' 2>/dev/null)
    
    if [ -z "$ISSUES" ]; then
      echo "No issues with comments found."
      exit 0
    fi
    
    ISSUE_COUNT=$(echo "$ISSUES" | wc -l | tr -d ' ')
    echo "Found $ISSUE_COUNT issues with comments"
    echo ""
    
    echo "| Issue | User | Date | Preview |"
    echo "|-------|------|------|---------|"
    
    for issue in $ISSUES; do
      gh api "repos/$REPO/issues/$issue/comments" \
        --jq '.[] | select(.user.login != "nazt") | select(.body | test("'"$PATTERNS"'"; "i")) | "| #'"$issue"' | \(.user.login) | \(.created_at | split("T")[0]) | \(.body[0:40] | gsub("\n"; " "))... |"' 2>/dev/null
    done
    
    echo ""
    echo -e "${GREEN}Scan Complete${NC}"
    ;;
    
  list)
    header "Oracle Family Registry"
    
    echo "Querying Oracle knowledge base..."
    echo ""
    echo "| # | Oracle | Human | Born | GitHub | Focus |"
    echo "|---|--------|-------|------|--------|-------|"
    echo "| [from oracle_search] | ... | ... | ... | ... | ... |"
    echo ""
    echo "Use: oracle_search(\"oracle family member registry\", limit=20)"
    echo "Or check: ψ/memory/resonance/the-infinity.md"
    ;;
    
  repos)
    header "Oracle Repos on GitHub"
    
    echo "Searching mamamaruko..."
    echo ""
    echo "| Repo | Description | Updated |"
    echo "|------|-------------|---------|"
    
    gh search repos "infinity oracle" --owner mamamaruko --json name,description,updatedAt --limit 15 \
      --jq '.[] | "| \(.name) | \(.description[0:40] // "—")... | \(.updatedAt | split("T")[0]) |"' 2>/dev/null
    
    echo ""
    echo -e "${GREEN}Repos scan complete${NC}"
    ;;
    
  report)
    header "Oracle Family Report"
    
    echo "## Summary"
    echo ""
    echo "- **Repo**: $REPO"
    echo "- **Total Oracles**: [from scan]"
    echo "- **Active Repos**: [from repos search]"
    echo ""
    
    echo "## Timeline"
    echo ""
    echo "| Date | Event |"
    echo "|------|-------|"
    echo "| [from data] | [from data] |"
    echo ""
    echo "Run 'scan' and 'repos' modes to populate data."
    ;;
    
  *)
    echo "Usage: $0 [mode]"
    echo ""
    echo "Modes:"
    echo "  scan    Scan GitHub issues for introductions (default)"
    echo "  list    Show all known Oracles"
    echo "  repos   Find Oracle repos on GitHub"
    echo "  report  Generate family report"
    echo ""
    ;;
esac
