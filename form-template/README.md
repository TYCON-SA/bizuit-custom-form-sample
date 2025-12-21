# BIZUIT Custom Form Template

> **This is the base template for creating new custom forms**

## 📖 Documentation

The complete documentation for creating and developing custom forms has been moved to the root of the repository:

👉 **[FORM_DEVELOPMENT_GUIDE.md](../FORM_DEVELOPMENT_GUIDE.md)**

This guide includes:
- ✅ Template setup and customization
- ✅ Local development with fat bundle
- ✅ Testing workflows
- ✅ Environment configuration
- ✅ Deployment instructions
- ✅ Troubleshooting

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup dev credentials (REQUIRED for local testing)
cp dev-credentials.example.js dev-credentials.js
# Edit dev-credentials.js with your Dashboard credentials

# 3. Build form
npm run build

# 4. Serve locally
cd dist
python3 -m http.server 8080

# 5. Open browser
open http://localhost:8080/dev.html
```

⚠️ **Important:** The form needs `dev-credentials.js` for authentication during local testing.

For detailed instructions, see [FORM_DEVELOPMENT_GUIDE.md](../FORM_DEVELOPMENT_GUIDE.md).

---

## Using Plugin API (Backend Plugins)

If your form needs to call backend plugin endpoints, configure `pluginApiUrl` in your credentials.

### Local Development (Recommended)

When running the .NET backend locally on port 8000:

```javascript
// dev-credentials.js
export const DEV_CREDENTIALS = {
  username: 'your-username',
  password: 'your-password',
  apiUrl: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/',
  // Point directly to local .NET backend
  pluginApiUrl: 'http://localhost:8000/api/plugins/yourplugin'
};
```

Then run:

```bash
# Terminal 1: Start .NET backend (from backend-api-dotnet directory)
dotnet run  # Runs on port 8000

# Terminal 2: Build and serve the form
npm run build:dev
npx http-server . -p 8080 --cors

# Terminal 3: Open browser
open http://localhost:8080/dev.html
```

### Production

In production, the form receives `pluginApiUrl` from the Dashboard/FormLoader, which points to the deployed backend:

```
https://yourserver.com/yourTenantBIZUITCustomFormsBackEnd/api/plugins/yourplugin
```

### Using pluginApiUrl in Your Form

```typescript
export default function MyForm({ dashboardParams }) {
  // Get plugin API URL (works in both dev and production)
  const pluginApiUrl = dashboardParams.devPluginApiUrl || dashboardParams.pluginApiUrl;

  const fetchData = async () => {
    const response = await fetch(`${pluginApiUrl}/my-endpoint`, {
      headers: {
        'Authorization': `Bearer ${dashboardParams.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  };

  // ... rest of form
}
```

---

## Using Roles and RoleSettings

In production, `runtime-app` passes user roles and role settings from Dashboard to your form via `dashboardParams`. For local development, you can emulate this by configuring them in `dev-credentials.js`.

### Configuration

```javascript
// dev-credentials.js
export const DEV_CREDENTIALS = {
  username: 'your-username',
  password: 'your-password',
  apiUrl: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/',
  pluginApiUrl: 'http://localhost:8000/api/plugins/yourplugin',

  // Emulate what runtime-app sends from Dashboard
  roles: ['Gestores', 'Administrators'],
  roleSettings: [
    { roleName: 'Gestores', settingName: 'IdGestor', settingValue: '3' }
  ]
};
```

### Finding Your Role Settings

Role settings are stored in Dashboard database tables:
- `UserRoleSettings` - User-specific settings
- `UserRoleSettingsDefinition` - Setting definitions

Ask your Dashboard admin for your specific settings, or query the database directly.

### Using roleSettings in Your Form

```typescript
interface RoleSetting {
  roleName: string;
  settingName: string;
  settingValue: string;
}

export default function MyForm({ dashboardParams }) {
  // Extract a specific setting
  const idGestorSetting = dashboardParams.roleSettings?.find(
    (s: RoleSetting) => s.settingName === 'IdGestor' && s.roleName === 'Gestores'
  );

  const idGestor = idGestorSetting
    ? parseInt(idGestorSetting.settingValue, 10)
    : null;

  // Check user roles
  const isAdmin = dashboardParams.roles?.includes('Administrators');

  // ... rest of form
}
```

### Available in dashboardParams

| Property | Type | Description |
|----------|------|-------------|
| `roles` | `string[]` | User's Dashboard roles |
| `roleSettings` | `RoleSetting[]` | User's role-specific settings |
| `userName` | `string` | Authenticated username |
| `displayName` | `string` | User's display name |
