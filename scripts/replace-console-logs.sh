#!/bin/bash

# Script to replace console.log/error/warn with logger in TypeScript files
# Usage: ./scripts/replace-console-logs.sh [directory]

set -e

DIRECTORY="${1:-.}"
DRY_RUN="${DRY_RUN:-false}"

echo "🔍 Searching for console.log/error/warn in: $DIRECTORY"

# Count total occurrences
TOTAL=$(grep -r "console\.\(log\|error\|warn\|info\)" "$DIRECTORY" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  2>/dev/null | wc -l || echo "0")

echo "📊 Found $TOTAL console.* calls"

if [ "$TOTAL" -eq 0 ]; then
  echo "✅ No console calls found!"
  exit 0
fi

echo ""
echo "This script will:"
echo "  - Replace console.log → logger.info"
echo "  - Replace console.error → logger.error"
echo "  - Replace console.warn → logger.warn"
echo "  - Replace console.info → logger.info"
echo "  - Add import { logger } from '@/lib/utils/logger' if needed"
echo ""

if [ "$DRY_RUN" = "true" ]; then
  echo "🔥 DRY RUN MODE - No files will be modified"
  echo ""
fi

# Find all files with console usage
FILES=$(grep -rl "console\.\(log\|error\|warn\|info\)" "$DIRECTORY" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "✅ No files to process"
  exit 0
fi

PROCESSED=0
SKIPPED=0

for file in $FILES; do
  echo "📝 Processing: $file"

  if [ "$DRY_RUN" = "true" ]; then
    # Show what would be changed
    grep -n "console\.\(log\|error\|warn\|info\)" "$file" 2>/dev/null || true
    echo ""
    continue
  fi

  # Check if file already imports logger
  HAS_LOGGER_IMPORT=$(grep -c "from '@/lib/utils/logger'" "$file" || echo "0")

  # Create backup
  cp "$file" "$file.bak"

  # Replace console calls
  sed -i 's/console\.log(/logger.info(/g' "$file"
  sed -i 's/console\.error(/logger.error(/g' "$file"
  sed -i 's/console\.warn(/logger.warn(/g' "$file"
  sed -i 's/console\.info(/logger.info(/g' "$file"

  # Add logger import if needed
  if [ "$HAS_LOGGER_IMPORT" -eq 0 ]; then
    # Check if there's already an import from Next
    if grep -q "from 'next/server'" "$file"; then
      # Add after next/server import
      sed -i "/from 'next\/server'/a import { logger } from '@/lib/utils/logger'" "$file"
    elif grep -q "^import" "$file"; then
      # Add after first import
      sed -i "0,/^import/s/^\(import.*\)$/\1\nimport { logger } from '@\/lib\/utils\/logger'/" "$file"
    else
      # Add at the beginning of file
      sed -i "1i import { logger } from '@/lib/utils/logger'\n" "$file"
    fi
  fi

  # Check if changes were made
  if diff -q "$file" "$file.bak" > /dev/null 2>&1; then
    echo "  ⏭️  No changes needed"
    rm "$file.bak"
    SKIPPED=$((SKIPPED + 1))
  else
    echo "  ✅ Updated"
    rm "$file.bak"
    PROCESSED=$((PROCESSED + 1))
  fi

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Done!"
echo "  📝 Processed: $PROCESSED files"
echo "  ⏭️  Skipped: $SKIPPED files"
echo ""
echo "⚠️  Important:"
echo "  1. Review changes: git diff"
echo "  2. Run tests: npm run test"
echo "  3. Fix any errors manually"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
