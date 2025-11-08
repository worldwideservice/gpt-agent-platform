import { NextResponse, type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { handleStripeWebhook } from '@/lib/services/billing'

// Force dynamic rendering (uses headers())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const getStripe = () => {
 const secretKey = process.env.STRIPE_SECRET_KEY
 if (!secretKey) {
 throw new Error('STRIPE_SECRET_KEY is not configured')
 }
 return new Stripe(secretKey, {
 apiVersion: '2025-10-29.clover',
 })
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * POST /api/billing/webhook - Обработка Stripe webhooks
 */
export const POST = async (request: NextRequest) => {
 try {
 const body = await request.text()
 const headersList = await headers()
 const sig = headersList.get('stripe-signature')

 if (!sig) {
 return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 })
 }

 let event: Stripe.Event

 try {
 event = getStripe().webhooks.constructEvent(body, sig, endpointSecret)
 } catch (err: any) {
 console.error('Webhook signature verification failed:', err.message)
 return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
 }

 // Обрабатываем webhook
 const success = await handleStripeWebhook(event)

 if (!success) {
 return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
 }

 return NextResponse.json({ success: true, received: true })
 } catch (error) {
 console.error('Stripe webhook error:', error)
 return NextResponse.json(
 { success: false, error: 'Internal server error' },
 { status: 500 },
 )
 }
}


