/**
 * Development Credentials - EXAMPLE FILE
 *
 * Copy this file to: dev-credentials.js
 * Then update with your actual credentials
 *
 * IMPORTANT: dev-credentials.js is gitignored and will NOT be committed
 */

export const DEV_CREDENTIALS = {
  username: 'your-username',
  password: 'your-password',
  apiUrl: 'https://test.bizuit.com/yourTenantBizuitDashboardapi/api/',

  // Plugin API URL (for backend plugins)
  // Local development: Point directly to your local .NET backend
  pluginApiUrl: 'http://localhost:8000/api/plugins/yourplugin',

  // Production URL example (when deployed):
  // pluginApiUrl: 'https://test.bizuit.com/yourTenantBIZUITCustomFormsBackEnd/api/plugins/yourplugin'

  // Role settings (emulates what runtime-app sends from Dashboard)
  // Get your settings from UserRoleSettings table in Dashboard DB
  roles: ['YourRole'],
  roleSettings: [
    // Example: { roleName: 'Gestores', settingName: 'IdGestor', settingValue: '3' }
  ]
};
