# Safari Cookie Fix - Cross-Origin Authentication

## Problem
Safari is blocking authentication cookies because your frontend (Vercel) and backend (Render) are on different domains. Safari requires special cookie settings for cross-origin authentication.

## Solution

### 1. Update Backend Environment Variables (Render)

Go to your Render backend dashboard and set these environment variables:

```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

**Why these settings:**
- `COOKIE_SECURE=true` - Cookies only sent over HTTPS (required for production)
- `COOKIE_SAMESITE=none` - Allows cookies to be sent cross-origin (frontend ↔ backend)

**Note:** `SameSite=None` requires `Secure=true` to work.

### 2. Verify CORS Settings

Make sure your backend has:
```bash
BACKEND_CORS_ORIGINS=https://kinda-quiz.vercel.app
```

This should already be set from the previous production deployment fix.

### 3. Redeploy Backend

After updating the environment variables in Render:
1. Trigger a manual deploy or it will auto-deploy
2. Wait for deployment to complete

### 4. Test in Safari

1. Clear Safari cookies and cache
2. Visit https://kinda-quiz.vercel.app
3. Try logging in
4. It should work now!

## Why This Happens

- **Same-Origin:** Frontend and backend on same domain (e.g., example.com/app and example.com/api) → `SameSite=lax` works
- **Cross-Origin:** Frontend and backend on different domains (e.g., app.vercel.app and api.render.com) → Requires `SameSite=none`

Safari is more strict about cross-origin cookies than Chrome/Firefox, so it fails first.

## Current Settings vs Required Settings

### Current (doesn't work in Safari):
```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
```

### Required (works in Safari):
```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

## After Fix

Once you update these environment variables in Render and redeploy, Safari will accept the authentication cookies and login will work properly!
