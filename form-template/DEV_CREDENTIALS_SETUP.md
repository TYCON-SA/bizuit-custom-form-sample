# 🔑 Development Credentials Setup

> **Quick guide for setting up dev credentials**

---

## Why Dev Credentials?

Development credentials allow you to test forms **locally without Dashboard access**:

❌ Without dev credentials:
- Can't test forms locally
- Always need Dashboard running
- Can't work offline
- Slow iteration

✅ With dev credentials:
- Test forms instantly
- No Dashboard dependency
- Work offline
- Fast iteration

---

## Setup Steps

### Step 1: Enable Dev Mode

Edit `../../runtime-app/.env.local`:

```env
ALLOW_DEV_MODE=true  # ← Add or uncomment this line
```

### Step 2: Create Credentials File

```bash
cd ../../runtime-app
cp dev-credentials.example.js dev-credentials.js
```

### Step 3: Add Your Credentials

Edit `dev-credentials.js`:

```javascript
export const DEV_CREDENTIALS = {
  // Your Dashboard login email
  username: 'your.email@company.com',

  // Your Dashboard password
  password: 'YourDashboardPassword',

  // Dashboard API URL for your tenant
  apiUrl: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/'
  //                                    ^^^^^^^^^^^^
  //                                    Replace with your tenant name
}
```

### Step 4: Find Your Tenant Name

**Ask your team lead** for your tenant name, or check:

- If your Dashboard URL is: `https://test.bizuit.com/arielsch/`
- Then your tenant is: `arielsch`
- API URL pattern: `https://test.bizuit.com/{tenant}BizuitDashboardapi/api/`
- Full API URL: `https://test.bizuit.com/arielschBizuitDashboardapi/api/`

**Common tenant examples**:
- `arielsch` → `arielschBizuitDashboardapi/api/`
- `recubiz` → `recubizBizuitDashboardapi/api/`

### Step 5: Verify Setup

```bash
# Start runtime app
cd ../../runtime-app
npm run dev

# Open browser (should NOT ask for token)
open http://localhost:3001/form/form-template

# Check console
# Should see: "✅ Authenticated with dev credentials"
# Should NOT see: "❌ Token validation failed"
```

---

## Security Checklist

- ✅ `dev-credentials.js` is in `.gitignore` (already done)
- ✅ Never commit real credentials to git
- ✅ Use test/dev accounts ONLY (NOT production accounts)
- ✅ `ALLOW_DEV_MODE=true` only in local `.env.local`
- ✅ Production deployments must have `ALLOW_DEV_MODE=false`

---

## Troubleshooting

### "Authentication failed"

```bash
# Checklist:
1. Check ALLOW_DEV_MODE is true
   grep ALLOW_DEV_MODE ../../runtime-app/.env.local

2. Check dev-credentials.js exists
   ls ../../runtime-app/dev-credentials.js

3. Check credentials format
   cat ../../runtime-app/dev-credentials.js
   # Must export object with: username, password, apiUrl

4. Test credentials manually
   # Try logging into Dashboard with same credentials
   open https://test.bizuit.com/yourTenant
```

### "TypeError: Cannot read property 'username'"

```bash
# dev-credentials.js has wrong format
# Must be:
export const DEV_CREDENTIALS = {
  username: '...',
  password: '...',
  apiUrl: '...'
}

# NOT:
export default { ... }  # ❌ Wrong
```

---

## Alternative: Use Your Own Test Account

If you don't have team-provided credentials:

1. **Create test Dashboard account** (ask admin)
2. **Get your tenant name** (from URL or ask admin)
3. **Use your credentials**:

```javascript
export const DEV_CREDENTIALS = {
  username: 'yourname@company.com',  // Your email
  password: 'YourPassword',          // Your password
  apiUrl: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/'
}
```

---

**Need help?** Check the main documentation at `http://localhost:3001/docs`
