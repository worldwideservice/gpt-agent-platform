# ✅ Paddle Migration Completed

**Date**: 2025-01-19
**Status**: Database migration successfully applied and deployed

## What Was Completed

### 1. Database Migration ✅

Successfully applied Paddle integration migration to production Supabase database:

**New Columns Added**:
- `paddle_subscription_id` (text) - Paddle subscription identifier
- `paddle_customer_id` (text) - Paddle customer identifier
- `paddle_transaction_id` (text) - Latest transaction ID
- `price_id` (text) - Paddle price ID for the subscription plan

**Indexes Created**:
- `idx_subscriptions_paddle_customer_id` - Fast lookups by customer
- `idx_subscriptions_paddle_subscription_id` - Fast lookups by subscription

**RLS Policies Updated**:
- "Users can view own organization subscriptions" - Uses correct `org_id` column
- "Only system can update subscriptions" - Restricts updates to service role only

**Legacy Data**:
- No Lemon Squeezy columns existed, so renaming was skipped
- Migration is backward compatible

### 2. Code Deployment ✅

- Build completed successfully (exit code 0)
- Production deployment live at: **https://ton-18-platform-7b5a9wqo2-world-wide-services-62780b79.vercel.app**
- Deployment URL: https://vercel.com/world-wide-services-62780b79/ton-18-platform/5c9HqwPkXzdQwgYgEfGEYSHRmFZ5
- All changes committed and pushed to GitHub

### 3. Files Modified ✅

- `supabase/migrations/20250119_paddle_integration.sql` - Final working migration
- Git commit: `c93df253c` - "fix: apply Paddle migration - add subscription columns and update RLS policies"

## Next Steps - Paddle Account Setup

Follow these steps to complete the Paddle integration:

### Step 1: Create Paddle Account

1. Go to [paddle.com](https://paddle.com)
2. Click "Get Started" → "Sign Up"
3. Verify email
4. Complete business profile in **Settings → Business Details**
   - Business Name
   - Country: Ukraine
   - Address (can be home address)
   - Tax ID: Optional for now

### Step 2: Create Products and Prices

1. Go to **Catalog → Products** in Paddle Dashboard
2. Create product: "AI Agent Pro"
3. Add prices for each plan:

   **Starter**: $29/month (Price ID: `pri_...`)
   **Pro**: $99/month (Price ID: `pri_...`)
   **Enterprise**: $299/month (Price ID: `pri_...`)

4. Copy each **Price ID** - you'll need them for environment variables

### Step 3: Get API Key

1. Go to **Developer Tools → Authentication**
2. Create API Key
   - Name: "Production API Key"
   - Environment: Production
3. Copy the API key (format: `pdl_live_apikey_...`)
   - ⚠️ **Shown only once!** Save it securely

### Step 4: Configure Webhook

1. Go to **Developer Tools → Notifications**
2. Create new webhook:
   - URL: `https://ton-18-platform-7b5a9wqo2-world-wide-services-62780b79.vercel.app/api/webhooks/paddle`
   - Subscribe to events:
     - `subscription.created`
     - `subscription.updated`
     - `subscription.canceled`
     - `subscription.expired`
     - `subscription.resumed`
     - `subscription.paused`
     - `transaction.completed`
     - `transaction.payment_failed`
3. Copy **Webhook Secret** (format: `pdwhsec_...`)

### Step 5: Add Environment Variables to Vercel

Add these variables in Vercel Dashboard → Settings → Environment Variables:

```bash
PADDLE_API_KEY=pdl_live_apikey_... # From Step 3
PADDLE_WEBHOOK_SECRET=pdwhsec_... # From Step 4
PADDLE_ENVIRONMENT=production

# Price IDs from Step 2
PADDLE_STARTER_PRICE_ID=pri_...
PADDLE_PRO_PRICE_ID=pri_...
PADDLE_ENTERPRISE_PRICE_ID=pri_...
```

Or use CLI:
```bash
vercel env add PADDLE_API_KEY production
vercel env add PADDLE_WEBHOOK_SECRET production
vercel env add PADDLE_ENVIRONMENT production
vercel env add PADDLE_STARTER_PRICE_ID production
vercel env add PADDLE_PRO_PRICE_ID production
vercel env add PADDLE_ENTERPRISE_PRICE_ID production
```

### Step 6: Set Up Payout Method (Wise)

1. Go to **Settings → Payouts** in Paddle
2. Add payout method → Wise
3. Connect your Wise account:
   - Sign up at [wise.com](https://wise.com) if needed
   - Verify identity (passport required)
   - Add Ukrainian card for withdrawal
4. Configure automatic or manual payouts

**Minimum payout**: $50
**Wise fee**: ~0.5-1% for USD → UAH conversion

### Step 7: Test in Sandbox (Recommended Before Production)

1. Create sandbox API key in Paddle
2. Set up local `.env.local`:
   ```bash
   PADDLE_ENVIRONMENT=sandbox
   PADDLE_API_KEY=pdl_test_...
   ```
3. Use ngrok for local webhook testing:
   ```bash
   ngrok http 3000
   # Update webhook URL to: https://your-id.ngrok.io/api/webhooks/paddle
   ```
4. Test with card: `4242 4242 4242 4242`

### Step 8: Deploy and Test

1. Redeploy after adding environment variables:
   ```bash
   vercel --prod
   ```
2. Test checkout flow
3. Verify webhook events in Paddle Dashboard
4. Check Supabase database for subscription records
5. Monitor logs: `vercel logs --follow`

## Implementation Already Complete ✅

The following code is already implemented and ready to use:

### Available Functions

Located in `lib/services/billing`:

- `checkLicense(tenantId)` - Verify subscription validity
- `createCheckoutSession(tenantId, priceId, successUrl, cancelUrl)` - Start subscription
- `cancelSubscription(tenantId, atPeriodEnd)` - Cancel subscription
- `resumeSubscription(tenantId)` - Resume canceled subscription
- `changeSubscriptionPlan(tenantId, newPriceId)` - Upgrade/downgrade plan
- `getCustomerPortalUrl(tenantId)` - Get Paddle customer portal URL

### Webhook Handler

Already implemented at: `app/api/webhooks/paddle/route.ts`

Handles all Paddle events automatically:
- Creates subscriptions in database
- Updates subscription status
- Records transactions
- Verifies webhook signatures

### License Checking

Already integrated in:
- Middleware (`middleware.ts`) - Redirects if license expired
- API routes - Checks license before operations
- UI components - Shows warnings for expiring licenses

## Documentation

- **Setup Guide**: [docs/PADDLE_SETUP.md](docs/PADDLE_SETUP.md)
- **Migration File**: `supabase/migrations/20250119_paddle_integration.sql`
- **Migration Instructions**: `MIGRATION_INSTRUCTIONS.md`
- **Paddle API Docs**: https://developer.paddle.com/api-reference/overview

## Security Notes

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use Vercel Environment Variables for production
- ✅ Webhook signatures are verified automatically
- ✅ HTTPS required for webhooks (production URL already uses HTTPS)

## Costs

**Paddle**:
- Commission: 5% + $0.50 per transaction
- Handles all taxes and compliance automatically
- Works with Ukrainian developers (no ФОП needed)

**Wise**:
- Transfer fee: ~0.5-1% for USD → UAH
- No monthly fees

## Monitoring

**Check deployment logs**:
```bash
vercel logs --follow
```

**Verify webhook events**:
Paddle Dashboard → Developer Tools → Notifications → Event Log

**Check subscription data**:
Supabase Dashboard → Table Editor → subscriptions

## Troubleshooting

If webhooks don't arrive:
1. Check Paddle Event Log for delivery status
2. Verify webhook URL is correct and HTTPS
3. Endpoint must return 200 OK status
4. Check Vercel logs for errors

If subscription doesn't create:
1. Verify `org_id` is passed in checkout custom_data
2. Check Supabase logs for errors
3. Verify all migration columns exist
4. Check webhook events are arriving

## Status Summary

✅ Database schema updated
✅ Indexes created
✅ RLS policies configured
✅ Code deployed to production
✅ License checking implemented
✅ Webhook handler ready
✅ API functions implemented

⏳ Paddle account setup (manual steps required)
⏳ Environment variables configuration
⏳ Payout method setup (Wise)
⏳ Production testing

## Ready to Launch

Once you complete Steps 1-8 above, your Paddle billing integration will be fully operational and ready to accept payments!
