#!/bin/bash

# Script to fix all page.tsx files to use async params in Next.js 14.2+

BASE_DIR="/Users/maksimgolovaty/Library/Mobile Documents/com~apple~CloudDocs/Development/AI agent/app/manage/[tenantId]"

echo "🔧 Fixing all page.tsx files to use async params..."
echo "=================================================="

# Find all page.tsx files except layout.tsx (already fixed)
find "$BASE_DIR" -name "page.tsx" -type f | while read -r file; do
  echo ""
  echo "📝 Processing: $file"

  # Check if file already uses Promise<params>
  if grep -q "params: Promise<" "$file"; then
    echo "   ✅ Already uses Promise<params>, skipping"
    continue
  fi

  # Check if file uses params at all
  if ! grep -q "params:" "$file"; then
    echo "   ⏭️  No params found, skipping"
    continue
  fi

  echo "   🔨 Fixing async params..."

  # Create backup
  cp "$file" "$file.backup"

  # Fix the file using perl for multi-line regex
  perl -i -0777 -pe '
    # Fix interface/type definitions for params
    s/params:\s*\{/params: Promise<{/g;

    # Add closing > for Promise type
    s/(params:\s*Promise<\{[^}]*\})\s*\n/\1>\n/g;

    # Fix function signatures to await params
    # Pattern: export default async function Component({ params }
    s/(export\s+default\s+async\s+function\s+\w+\(\{\s*)(params)(\s*\}[^{]*\{)/\1\2\3\n  const resolvedParams = await params;\n  const tenantId = resolvedParams.tenantId;\n  const agentId = resolvedParams.agentId || undefined;/g;
  ' "$file"

  echo "   ✅ Fixed!"
done

echo ""
echo "=================================================="
echo "✅ All files processed!"
echo ""
echo "⚠️  Note: Please manually review the changes and update"
echo "    variable references from params.tenantId to tenantId"
echo "    and from params.agentId to agentId"
