import { NextRequest, NextResponse } from 'next/server'

// Temporarily disabled GraphQL API due to dependency conflicts
// Will be re-enabled after production deployment
export async function GET(request: NextRequest) {
 return NextResponse.json({
 message: 'GraphQL API temporarily disabled. Use REST API instead.',
 status: 'maintenance'
 }, { status: 503 })
}

export async function POST(request: NextRequest) {
 return NextResponse.json({
 message: 'GraphQL API temporarily disabled. Use REST API instead.',
 status: 'maintenance'
 }, { status: 503 })
}
