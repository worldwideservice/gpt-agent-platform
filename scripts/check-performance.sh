#!/bin/bash

# Performance Check Script
# Checks Lighthouse scores and performance metrics

echo "🔍 Performance Check Script"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Lighthouse CLI is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse CLI not found. Installing...${NC}"
    npm install -g @lhci/cli
fi

# Check if server is running
if ! curl -f http://localhost:3000/api/health &> /dev/null; then
    echo -e "${RED}❌ Server is not running on http://localhost:3000${NC}"
    echo "Please run 'npm run dev' first"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Run Lighthouse audit
echo "📊 Running Lighthouse audit..."
echo ""

lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless --no-sandbox" \
  --quiet || {
    echo -e "${RED}❌ Lighthouse audit failed${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}✅ Lighthouse audit complete${NC}"
echo "📄 Report saved to: ./lighthouse-report.html"
echo ""

# Extract scores
PERFORMANCE=$(lighthouse http://localhost:3000 --only-categories=performance --output=json --quiet --chrome-flags="--headless" | jq '.categories.performance.score * 100')
ACCESSIBILITY=$(lighthouse http://localhost:3000 --only-categories=accessibility --output=json --quiet --chrome-flags="--headless" | jq '.categories.accessibility.score * 100')
BEST_PRACTICES=$(lighthouse http://localhost:3000 --only-categories=best-practices --output=json --quiet --chrome-flags="--headless" | jq '.categories["best-practices"].score * 100')
SEO=$(lighthouse http://localhost:3000 --only-categories=seo --output=json --quiet --chrome-flags="--headless" | jq '.categories.seo.score * 100')

echo "📊 Scores:"
echo "  Performance: ${PERFORMANCE}%"
echo "  Accessibility: ${ACCESSIBILITY}%"
echo "  Best Practices: ${BEST_PRACTICES}%"
echo "  SEO: ${SEO}%"
echo ""

# Check if scores meet requirements
if (( $(echo "$PERFORMANCE >= 90" | bc -l) )); then
    echo -e "${GREEN}✅ Performance score meets requirement (≥90)${NC}"
else
    echo -e "${YELLOW}⚠️  Performance score below requirement (≥90)${NC}"
fi

if (( $(echo "$ACCESSIBILITY >= 90" | bc -l) )); then
    echo -e "${GREEN}✅ Accessibility score meets requirement (≥90)${NC}"
else
    echo -e "${YELLOW}⚠️  Accessibility score below requirement (≥90)${NC}"
fi

echo ""
echo "✅ Performance check complete!"
echo ""

