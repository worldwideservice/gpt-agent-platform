# Paddle Integration Migration Instructions

## Overview
This document provides instructions for applying the Paddle integration migration to your Supabase database.

## Migration File
**Location:** `supabase/migrations/20250119_paddle_integration.sql`

## Manual Application via Supabase Dashboard

Since the Supabase CLI encountered migration history conflicts and PostgreSQL client tools are not available on this system, please apply the migration manually:

### Steps:

1. **Open Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `rpzchsgutabxeabbnwas`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute the Migration**
   - Open the file: `supabase/migrations/20250119_paddle_integration.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press Cmd+Enter

4. **Verify the Migration**
   After running, verify the changes:
   ```sql
   -- Check new Paddle columns exist
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'subscriptions'
   AND column_name LIKE 'paddle%';

   -- Should return:
   -- paddle_subscription_id | text
   -- paddle_customer_id | text
   -- paddle_transaction_id | text

   -- Check price_id column
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'subscriptions'
   AND column_name = 'price_id';

   -- Check legacy columns were renamed
   SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'subscriptions'
   AND column_name LIKE 'legacy_ls%';

   -- Should return:
   -- legacy_ls_subscription_id
   -- legacy_ls_customer_id
   -- legacy_ls_variant_id (if existed)

   -- Check indexes were created
   SELECT indexname
   FROM pg_indexes
   WHERE tablename = 'subscriptions'
   AND indexname LIKE '%paddle%';

   -- Should return:
   -- idx_subscriptions_paddle_subscription_id
   -- idx_subscriptions_paddle_customer_id
   -- idx_subscriptions_price_id
   ```

## Alternative: Command Line Application (if PostgreSQL client available)

If you have PostgreSQL client (psql) installed, you can apply the migration using:

```bash
# Get database connection string
supabase db remote connect

# Then use psql to execute the migration
psql "postgresql://..." -f supabase/migrations/20250119_paddle_integration.sql
```

## What This Migration Does

1. **Adds Paddle columns** to `subscriptions` table:
   - `paddle_subscription_id` - Paddle subscription ID
   - `paddle_customer_id` - Paddle customer ID
   - `paddle_transaction_id` - Latest transaction ID
   - `price_id` - Paddle price ID

2. **Renames Lemon Squeezy columns** (preserves historical data):
   - `lemon_squeezy_subscription_id` → `legacy_ls_subscription_id`
   - `lemon_squeezy_customer_id` → `legacy_ls_customer_id`
   - `variant_id` → `legacy_ls_variant_id`

3. **Creates indexes** for performance:
   - Index on `paddle_subscription_id`
   - Index on `paddle_customer_id`
   - Index on `price_id`

4. **Updates `billing_plans` table**:
   - Adds `price_id` column
   - Renames `variant_id` to `legacy_ls_variant_id`

5. **Updates subscription status type**:
   - Converts from enum to TEXT to support Paddle's 'paused' status

6. **Updates RLS policies**:
   - Ensures users can only view their organization's subscriptions
   - Ensures only system (service role) can update subscriptions

7. **Adds constraint**:
   - Ensures either `paddle_subscription_id` OR `legacy_ls_subscription_id` is present

## Next Steps After Migration

Once the migration is applied successfully:

1. ✅ **Test License Checking**
   - The license check system is already implemented in code
   - Test with an expired subscription to verify the UI warnings appear

2. **Set Up Paddle Account**
   - Follow instructions in `docs/PADDLE_SETUP.md`
   - Configure webhook URL: `https://your-domain.com/api/webhooks/paddle`

3. **Configure Paddle Environment Variables** in Vercel:
   ```bash
   PADDLE_VENDOR_ID=your_vendor_id
   PADDLE_API_KEY=your_api_key
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   PADDLE_ENVIRONMENT=production  # or 'sandbox' for testing
   ```

4. **Test Paddle Integration**:
   - Create a test subscription
   - Verify webhook events are received
   - Confirm database updates from webhooks

## Troubleshooting

### Migration History Conflicts

If you see "Remote migration versions not found in local migrations directory":

```bash
# Repair migration history
supabase migration repair --status reverted <timestamp>

# Pull remote schema to sync
supabase db pull
```

### Permission Errors

If you encounter RLS policy errors when applying the migration, it means you're not using the service role key. Make sure you're:
- Using the Supabase Dashboard (which has full permissions)
- OR using the `SUPABASE_SERVICE_ROLE_KEY` for CLI operations

## Support

If you encounter any issues:
1. Check Supabase Dashboard → Database → Logs for errors
2. Verify your service role key is correct in `.env.local`
3. Ensure your Supabase project is on a paid plan (some features require it)
