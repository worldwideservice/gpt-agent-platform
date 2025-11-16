#!/bin/bash

# Script to add GitHub Personal Access Token to MCP config
# Usage: ./setup-github-token.sh YOUR_GITHUB_TOKEN

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 YOUR_GITHUB_TOKEN"
    echo ""
    echo "To create a GitHub Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes:"
    echo "   - repo (Full control of private repositories)"
    echo "   - workflow (Update GitHub Action workflows)"
    echo "   - read:org (Read org and team membership)"
    echo "4. Click 'Generate token'"
    echo "5. Copy the token and run: $0 YOUR_TOKEN"
    exit 1
fi

GITHUB_TOKEN="$1"
CONFIG_FILE=".claude/mcp_config.json"

echo "Updating GitHub token in $CONFIG_FILE..."

# Use jq to update the token if available, otherwise use sed
if command -v jq &> /dev/null; then
    jq --arg token "$GITHUB_TOKEN" '.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN = $token' "$CONFIG_FILE" > "$CONFIG_FILE.tmp"
    mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    echo "✅ GitHub token updated successfully using jq!"
else
    # Fallback to sed if jq is not available
    sed -i "s/PLACEHOLDER_GITHUB_TOKEN/$GITHUB_TOKEN/g" "$CONFIG_FILE"
    echo "✅ GitHub token updated successfully using sed!"
fi

echo ""
echo "GitHub MCP is now configured!"
echo "Please restart your Claude Code session to activate the GitHub MCP server."
echo ""
echo "Available GitHub MCP commands:"
echo "  - create_pull_request"
echo "  - create_issue"
echo "  - list_issues"
echo "  - get_issue"
echo "  - update_issue"
echo "  - fork_repository"
echo "  - create_repository"
echo "  - and more..."
