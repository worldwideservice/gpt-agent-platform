# 🚨 SECURITY ALERT - API Key Exposure

**Date**: 2025-01-19
**Severity**: HIGH
**Status**: Documentation fixed, awaiting key rotation

## Issue

GitHub Secret Scanning detected a Paddle API key exposed in the repository:

- **File**: `docs/PADDLE_SETUP.md`
- **Line**: 101
- **Commit**: b84bf6a4
- **Exposed Key**: `pdl_live_apikey_01kaeep48yxa0v0qj32bj52f5m_QXHn8TMnnc0q6HhjeKvrY1_AbX`

## Immediate Actions Taken ✅

1. ✅ Replaced the exposed key with a placeholder in documentation
2. ✅ Committed and pushed the fix (commit: 1ed690b91)
3. ✅ Updated all example configurations to use safe placeholder values

## CRITICAL: Actions Required by You

### If This Was a Real Production API Key:

**YOU MUST ROTATE THE KEY IMMEDIATELY** to prevent unauthorized access to your Paddle account.

#### Step 1: Revoke the Exposed Key

1. Go to [Paddle Dashboard](https://vendors.paddle.com)
2. Navigate to **Developer Tools → Authentication**
3. Find the API key: `pdl_live_apikey_01kaeep48yxa0v0qj32bj52f5m_...`
4. Click **Delete** or **Revoke**
5. Confirm deletion

#### Step 2: Create a New API Key

1. In the same page (**Developer Tools → Authentication**)
2. Click **Create API Key**
3. Fill in:
   - Name: "Production API Key - Rotated 2025-01-19"
   - Description: "Replacement for exposed key"
   - Environment: Production
4. Click **Create**
5. **COPY THE NEW KEY** (shown only once!)
   - Format: `pdl_live_apikey_...`
   - Store it securely (password manager, Vercel secrets, etc.)

#### Step 3: Update Vercel Environment Variables

Replace the old key with the new one in Vercel:

```bash
# Using Vercel CLI
vercel env rm PADDLE_API_KEY production
vercel env add PADDLE_API_KEY production
# Enter the new key when prompted

# Or via Vercel Dashboard
# 1. Go to: https://vercel.com/world-wide-services-62780b79/ton-18-platform/settings/environment-variables
# 2. Find PADDLE_API_KEY
# 3. Click Edit → Delete
# 4. Add new variable with the new key
```

#### Step 4: Redeploy Application

After updating the environment variable:

```bash
vercel --prod
```

This ensures the new key is used in production.

#### Step 5: Verify Everything Works

1. Check deployment logs:
   ```bash
   vercel logs --follow
   ```

2. Test Paddle integration:
   - Create a test subscription (if in sandbox)
   - Verify webhook events are received
   - Check subscription appears in database

3. Monitor for any API errors related to authentication

### If This Was Just an Example Key:

If the exposed key was just a placeholder/example and not a real production key:

1. ✅ Documentation has been updated with safe placeholders
2. ✅ No further action needed
3. GitHub alert can be dismissed as "False positive"

However, to be safe, **verify in Paddle Dashboard** if this key exists:
- Go to **Developer Tools → Authentication**
- Check if a key starting with `pdl_live_apikey_01kaeep48yxa0v0qj32bj52f5m_...` is listed
- If it exists, follow the rotation steps above

## Security Best Practices Going Forward

### 1. Never Commit Real Secrets

- ✅ Use `.env.local` for local development (already in `.gitignore`)
- ✅ Use Vercel Environment Variables for production
- ✅ Use placeholders in documentation (e.g., `YOUR_API_KEY_HERE`)

### 2. Check Before Committing

Before committing files with sensitive data:

```bash
# Check what you're about to commit
git diff --staged

# Look for patterns like:
# - API keys (pdl_, pdwhsec_, sk_, pk_)
# - Passwords
# - Database URLs with credentials
# - Private keys
```

### 3. Enable Pre-Commit Hooks

Consider adding a pre-commit hook to detect secrets:

```bash
# Install git-secrets or similar tool
npm install --save-dev @commitlint/cli husky

# Configure to scan for common secret patterns
```

### 4. Use Environment Variables Everywhere

Never hardcode:
- API keys
- Webhook secrets
- Database credentials
- OAuth client secrets
- Service account keys

Always use: `process.env.VARIABLE_NAME`

### 5. Regular Security Audits

- Review GitHub Security Alerts regularly
- Rotate API keys periodically (every 90 days recommended)
- Monitor Paddle Dashboard for suspicious activity
- Check Vercel deployment logs for unauthorized access

## What This Key Could Have Been Used For

If the exposed key was real and active, an attacker could:

❌ **Access your Paddle account data**:
- View all subscriptions
- See customer information
- Access transaction details
- View revenue data

❌ **Modify subscriptions**:
- Cancel active subscriptions
- Change subscription plans
- Pause subscriptions
- Issue refunds

❌ **Create fraudulent transactions**:
- Create fake subscriptions
- Manipulate pricing
- Generate fake invoices

**This is why immediate rotation is critical!**

## Verifying the Key Has Been Rotated

After rotation, verify:

1. Old key returns `401 Unauthorized` when used:
   ```bash
   curl -X GET https://api.paddle.com/subscriptions \
     -H "Authorization: Bearer pdl_live_apikey_01kaeep48yxa0v0qj32bj52f5m_..."

   # Should return: {"error": "unauthorized"}
   ```

2. New key works correctly:
   ```bash
   curl -X GET https://api.paddle.com/subscriptions \
     -H "Authorization: Bearer [NEW_KEY]"

   # Should return: {"data": [...]}
   ```

3. Application continues to function normally
4. No authentication errors in Vercel logs

## GitHub Alert Resolution

After rotating the key:

1. Go to GitHub repository → Security → Secret scanning alerts
2. Find the alert for commit b84bf6a4
3. Click "Dismiss alert"
4. Select reason: "Secret revoked"
5. Add note: "Key rotated on 2025-01-19, new key added to Vercel secrets"

## Timeline

- **2025-01-19 17:18**: GitHub detected secret exposure
- **2025-01-19 17:20**: Documentation fixed and pushed (commit 1ed690b91)
- **Pending**: Key rotation (if it was real)
- **Pending**: GitHub alert dismissal

## Need Help?

If you're unsure whether to rotate the key or need assistance:

1. Check Paddle Dashboard → Developer Tools → Authentication
2. Look for the key in question
3. If found, **rotate immediately**
4. If not found, it was likely just an example

**When in doubt, rotate the key.** Better safe than sorry!

## Checklist

- [ ] Verified if exposed key exists in Paddle Dashboard
- [ ] Revoked old key in Paddle (if it exists)
- [ ] Created new API key
- [ ] Updated PADDLE_API_KEY in Vercel
- [ ] Redeployed application
- [ ] Verified application works with new key
- [ ] Dismissed GitHub security alert
- [ ] Documented rotation in team communication

---

**Remember**: Secrets in git history remain forever, even after being removed from current files. This is why rotation is mandatory, not optional.
