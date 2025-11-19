#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const apiDir = path.join(process.cwd(), 'app/api/manage/[tenantId]')

function findRoutes(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            findRoutes(fullPath, results)
        } else if (entry.name === 'route.ts') {
            results.push(fullPath)
        }
    }

    return results
}

function fixRoute(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')

    // Check if already fixed
    if (content.includes('params: Promise<{ tenantId:')) {
        console.log(`✓ Already fixed: ${path.relative(process.cwd(), filePath)}`)
        return false
    }

    // Fix params type
    content = content.replace(
        /\{ params \}:\s*\{\s*params:\s*\{\s*tenantId:\s*string\s*\}\s*\}/g,
        '{ params }: { params: Promise<{ tenantId: string }> }'
    )

    // Add await params if not present
    if (!content.includes('await params')) {
        // Find the first line after GET/POST/PUT/DELETE function declaration
        content = content.replace(
            /(export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{)/,
            '$1\n  const { tenantId } = await params\n'
        )
    }

    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`)
    return true
}

const routes = findRoutes(apiDir)
console.log(`Found ${routes.length} routes to check\n`)

let fixedCount = 0
routes.forEach(route => {
    if (fixRoute(route)) {
        fixedCount++
    }
})

console.log(`\nFixed ${fixedCount} out of ${routes.length} routes`)
