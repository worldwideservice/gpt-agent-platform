import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

let cachedSpec: unknown

async function loadSpec() {
  if (!cachedSpec) {
    const specPath = join(process.cwd(), 'public', 'api-spec.json')
    const fileContents = await readFile(specPath, 'utf-8')
    cachedSpec = JSON.parse(fileContents)
  }

  return cachedSpec
}

export const GET = async () => {
  const spec = await loadSpec()
  return NextResponse.json(spec)
}
