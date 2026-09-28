# Guía de Deployment - Custom Forms a Entornos

Pasos completos para deployar custom forms a entornos Bizuit BPM (clientX, clientY, etc.)

## 📋 Arquitectura de Entornos

### Entornos Disponibles

```
your-bizuit-host/
├── clientXBIZUITCustomForms/
│   ├── Runtime App (Next.js)   → Puerto 3001, Windows Service + IIS Reverse Proxy
│   ├── Backend API (.NET 9)    → IIS Virtual App (In-Process)
│   └── Forms Storage           → /public/forms/{form-name}/form.js
│
└── clientYBIZUITCustomForms/
    ├── Runtime App (Next.js)   → Puerto 3002, Windows Service + IIS Reverse Proxy
    ├── Backend API (.NET 9)    → IIS Virtual App (In-Process)
    └── Forms Storage           → /public/forms/{form-name}/form.js
```

### URLs por Entorno

| Entorno | Runtime App | Backend API | Admin Panel |
|---------|------------|-------------|-------------|
| **clientX** | `your-bizuit-host/clientXBIZUITCustomForms` | `your-bizuit-host/clientXBIZUITCustomForms/api` | `your-bizuit-host/clientXBIZUITCustomForms/admin` |
| **clientY** | `your-bizuit-host/clientYBIZUITCustomForms` | `your-bizuit-host/clientYBIZUITCustomForms/api` | `your-bizuit-host/clientYBIZUITCustomForms/admin` |

---

## 🚀 Deployment de un Form

### Paso 1: Obtener el Artifact

#### Opción A: Download desde GitHub Actions (Recomendado)

1. Ir a: https://github.com/{your-org}/bizuit-custom-form-sample/actions
2. Click en el workflow run más reciente (debe estar ✅ exitoso)
3. Scroll down a "Artifacts"
4. Download el ZIP del form deseado:
   - `example-form-deployment-1.0.8-abc1234`
   - `another-form-deployment-1.0.13-abc1234`

#### Opción B: Build Local

```bash
cd example-form
npm run build

# Crear ZIP manualmente (si es necesario)
zip -r example-form-deployment-local.zip \
  dist/form.js \
  dist/form.js.map \
  dist/form.meta.json
```

### Paso 2: Verificar Contenido del ZIP

**Descomprimir para inspeccionar:**

```bash
unzip example-form-deployment-1.0.8-abc1234.zip -d temp-inspect
tree temp-inspect/

# Estructura esperada:
# temp-inspect/
# ├── manifest.json        # Metadata del deployment
# ├── VERSION.txt          # Info de build (commit, fecha, etc.)
# └── forms/
#     └── example-form/
#         └── form.js      # Form compilado
```

**Verificar manifest.json:**

```json
{
  "packageVersion": "1.0.202511231405",
  "buildDate": "2025-11-23T14:05:30.000Z",
  "commitHash": "abc1234...",
  "forms": [
    {
      "formName": "example-form",
      "version": "1.0.8",
      "gitTag": "example-form-v1.0.8",
      "sizeBytes": 52097,
      "path": "forms/example-form/form.js"
    }
  ]
}
```

### Paso 3: Upload al Entorno

#### A. Via Admin Panel (Recomendado)

**URL Admin Panel:**
- clientX: https://your-bizuit-host/clientXBIZUITCustomForms/admin/upload-forms
- clientY: https://your-bizuit-host/clientYBIZUITCustomForms/admin/upload-forms

**Steps:**

1. **Login:** Credenciales con rol `Administrators` o `FormManager`
2. **Upload:**
   - Click "Upload New Form" o "Upload Form Package"
   - Seleccionar ZIP: `example-form-deployment-1.0.8-abc1234.zip`
   - Click "Upload"
3. **Verificación:**
   - El sistema muestra: "Form uploaded successfully: example-form v1.0.8"
   - La tabla de forms lista el nuevo form

#### B. Via API (Avanzado)

```bash
# Endpoint
POST https://your-bizuit-host/clientXBIZUITCustomForms/api/admin/upload-form

# Headers
Authorization: Bearer {admin-jwt-token}
Content-Type: multipart/form-data

# Body
file: example-form-deployment-1.0.8-abc1234.zip
```

**Ejemplo con curl:**

```bash
# 1. Obtener token admin (requiere login)
TOKEN=$(curl -X POST https://your-bizuit-host/clientXBIZUITCustomForms/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_admin_password"}' \
  | jq -r '.token')

# 2. Upload form
curl -X POST https://your-bizuit-host/clientXBIZUITCustomForms/api/admin/upload-form \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@example-form-deployment-1.0.8-abc1234.zip"
```

### Paso 4: Verificación Post-Deployment

#### 1. Verificar Form File en Public

**URL del form compilado:**

```bash
# clientX
https://your-bizuit-host/clientXBIZUITCustomForms/forms/example-form/form.js

# clientY
https://your-bizuit-host/clientYBIZUITCustomForms/forms/example-form/form.js
```

**Test con curl:**

```bash
curl -I https://your-bizuit-host/clientXBIZUITCustomForms/forms/example-form/form.js

# Debe retornar:
# HTTP/1.1 200 OK
# Content-Type: application/javascript
```

#### 2. Verificar Metadata en Admin Panel

**URL:** https://your-bizuit-host/clientXBIZUITCustomForms/admin/forms

**Debe mostrar:**

| Form Name | Version | Status | Last Updated | Actions |
|-----------|---------|--------|--------------|---------|
| example-form | 1.0.8 | ✅ Active | 2025-11-23 14:05 | View / Delete |

#### 3. Testing en Runtime App

**Con Token Mock (Solo si NEXT_PUBLIC_ALLOW_DEV_MODE=true):**

```
https://your-bizuit-host/clientXBIZUITCustomForms/form/example-form
  ?token=test-token
  &userName=TestUser
```

⚠️ **IMPORTANTE:** `NEXT_PUBLIC_ALLOW_DEV_MODE` debe ser `false` en producción!

**Con Token Real (Producción):**

El form se accede vía Dashboard de Bizuit BPM. El Dashboard genera URLs con token encriptado:

```
https://your-bizuit-host/clientXBIZUITCustomForms/form/example-form
  ?token={encrypted-jwt-token}
  &userName={real-user}
  &instanceId={process-instance}
  &eventName={bpm-event}
  &activityName={bpm-activity}
```

---

## 🔄 Actualizar un Form Existente

### Workflow Completo

```bash
# 1. Hacer cambios al form
cd example-form
# Editar src/index.tsx

# 2. Build local para testing
npm run build

# 3. Test en dev.html
http-server -p 8080 --cors
# Abrir: http://localhost:8080/dev.html

# 4. Commit y push
git add .
git commit -m "feat(example-form): add new feature X"
git push origin dev

# 5. Merge a main
git checkout main
git merge dev
git push origin main
git checkout dev

# 6. GitHub Actions automáticamente:
#    - Detecta el cambio
#    - Calcula nueva versión (v1.0.9)
#    - Buildea el form
#    - Crea ZIP: example-form-deployment-1.0.9-{hash}.zip
#    - Commitea ZIP a example-form/upload/
#    - Crea git tag: example-form-v1.0.9
#    - Sube artifact a GitHub Actions

# 7. Download artifact de GitHub Actions
# https://github.com/{your-org}/bizuit-custom-form-sample/actions

# 8. Upload via admin panel a cada entorno deseado
# clientX: your-bizuit-host/clientXBIZUITCustomForms/admin/upload-forms
# clientY: your-bizuit-host/clientYBIZUITCustomForms/admin/upload-forms
```

---

## 🏢 Setup de Nuevo Entorno

### Paso 1: Preparar Infraestructura

#### 1.1. Base de Datos SQL Server

Crear 2 databases:

```sql
-- Database 1: Dashboard del cliente
CREATE DATABASE clientXBizuitDashboard;

-- Database 2: Persistence Store (compartido)
-- (usar existente o crear nueva)
CREATE DATABASE clientXBizuitPersistenceStore;
```

#### 1.2. Directorios en Servidor

```bash
# Windows Server
E:\BIZUITSites\clientX\
├── clientXBIZUITCustomForms\           # Runtime App (Next.js - Windows Service)
│   ├── .next\                            # Next.js build
│   ├── public\
│   │   └── forms\                        # Forms dinámicos
│   │       ├── example-form\
│   │       │   └── form.js
│   │       └── another-form\
│   │           └── form.js
│   ├── .env.local
│   └── package.json
│
└── clientXBIZUITCustomFormsBackEnd\    # Backend API (.NET 9 - IIS Virtual App)
    ├── BizuitCustomForms.WebApi.dll      # .NET WebAPI assembly
    ├── appsettings.json                  # Configuration
    ├── web.config                        # IIS configuration
    └── wwwroot\                          # Static files
```

### Paso 2: Configurar Backend API (.NET 9)

#### 2.1. Editar `appsettings.json`

```json
// En: E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd\appsettings.json
{
  "ConnectionStrings": {
    "DashboardDb": "Server=your-bizuit-host;Database=clientXBizuitDashboard;User Id=BIZUITclientX;Password={secure-password};TrustServerCertificate=True;",
    "PersistenceDb": "Server=your-bizuit-host;Database=clientXBizuitPersistenceStore;User Id=BIZUITclientX;Password={secure-password};TrustServerCertificate=True;"
  },
  "BizuitSettings": {
    "DashboardApiUrl": "https://your-bizuit-host/clientXBizuitDashboardapi/api",
    "JwtSecretKey": "{generate-with-openssl-rand-hex-32}",
    "EncryptionTokenKey": "{24-char-key-must-match-dashboard}",
    "AdminAllowedRoles": "Administrators,BIZUIT Admins,SuperAdmin,FormManager",
    "SessionTimeoutMinutes": 30,
    "MaxUploadSizeMB": 50,
    "TempUploadPath": "./temp-uploads"
  },
  "Cors": {
    "AllowedOrigins": ["https://your-bizuit-host"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

#### 2.2. Generar Secrets

```bash
# JWT Secret (64 caracteres hex)
openssl rand -hex 32

# Encryption Key (24 caracteres, coordinar con Dashboard)
# Debe ser el mismo que usa Dashboard para encriptar tokens
```

⚠️ **IMPORTANTE:** En producción, usar Azure Key Vault o User Secrets para almacenar credenciales, NO `appsettings.json`.

### Paso 3: Configurar Runtime App

#### 3.1. Crear `.env.local`

```bash
# En: E:\BIZUITSites\clientX\clientXBIZUITCustomForms\.env.local

# Bizuit API Configuration
NEXT_PUBLIC_BIZUIT_DASHBOARD_API_URL=https://your-bizuit-host/clientXBizuitDashboardapi/api

# Base path para IIS deployment
NEXT_PUBLIC_BASE_PATH=/clientXBIZUITCustomForms

# Backend API URL (server-side, usado por Next.js API routes)
# El backend .NET se accede vía IIS Virtual App, no puerto directo
NEXT_PUBLIC_API_URL=https://your-bizuit-host/clientXBIZUITCustomFormsBackEnd

# Timeouts
NEXT_PUBLIC_BIZUIT_TIMEOUT=30000
NEXT_PUBLIC_BIZUIT_TOKEN_EXPIRATION_MINUTES=30

# Security: MUST be false in production!
NEXT_PUBLIC_ALLOW_DEV_MODE=false
```

⚠️ **CRÍTICO:**
- `NEXT_PUBLIC_BASE_PATH` debe coincidir con el path IIS
- `NEXT_PUBLIC_ALLOW_DEV_MODE=false` en producción (seguridad)

#### 3.2. Build Next.js

```bash
cd E:\BIZUITSites\clientX\clientXBIZUITCustomForms
npm install
npm run build
```

### Paso 4: Configurar Windows Service (Solo Runtime App)

⚠️ **NOTA:** El backend .NET NO requiere Windows Service. Se ejecuta como IIS Virtual App (In-Process). Solo el runtime-app (Next.js) usa Windows Service.

#### 4.1. Crear Windows Service

```powershell
# Configuración
$serviceName = "BizuitCustomForms-clientX-Runtime"
$displayName = "BIZUIT Custom Forms Runtime (clientX)"
$description = "Next.js runtime for BIZUIT Custom Forms - clientX tenant"
$exePath = "E:\BIZUITSites\clientX\clientXBIZUITCustomForms\node.exe"
$scriptPath = "E:\BIZUITSites\clientX\clientXBIZUITCustomForms\node_modules\next\dist\bin\next"
$arguments = "start -p 3002"
$workingDir = "E:\BIZUITSites\clientX\clientXBIZUITCustomForms"

# Crear servicio
New-Service -Name $serviceName `
  -DisplayName $displayName `
  -Description $description `
  -BinaryPathName "$exePath $scriptPath $arguments" `
  -StartupType Automatic `
  -WorkingDirectory $workingDir

# Iniciar servicio
Start-Service -Name $serviceName

# Verificar estado
Get-Service -Name $serviceName
```

#### 4.2. Verificar Runtime App

```powershell
# Ver estado del servicio
Get-Service -Name "BizuitCustomForms-clientX-Runtime"

# Verificar puerto está activo
netstat -ano | findstr :3002

# Ver logs en Event Viewer
Get-EventLog -LogName Application -Source "*Bizuit*" -Newest 20
```

### Paso 5: Configurar IIS

#### 5.1. Site Configuration

**Site:** `your-bizuit-host`

**Application Pool:** DefaultAppPool (.NET CLR Version: No Managed Code)

#### 5.2. Virtual Applications y URL Rewrite Rules

**Backend API - Virtual Application:**

1. IIS Manager → your-bizuit-host → Add Application
2. Alias: `clientXBIZUITCustomFormsBackEnd`
3. Physical Path: `E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd`
4. Application Pool: DefaultAppPool (No Managed Code)

**Runtime App - URL Rewrite:**

```xml
<!-- Web.config en E:\DevSites\your-bizuit-host -->
<rule name="clientX-CustomForms-Runtime" stopProcessing="true">
  <match url="^clientXBIZUITCustomForms/(.*)$" />
  <action type="Rewrite" url="http://localhost:3002/{R:1}" />
</rule>
```

⚠️ **NOTA:** El backend .NET NO requiere URL Rewrite - es una Virtual Application directa en IIS.

#### 5.3. Application Request Routing (ARR)

**Enable Proxy:**

1. IIS Manager → Server → Application Request Routing
2. Server Proxy Settings → Enable proxy ✅
3. Set timeout: 300 seconds

### Paso 6: Deployment del Form

#### 6.1. Upload via Admin Panel

**URL:** https://your-bizuit-host/clientXBIZUITCustomForms/admin/upload-forms

**Login:** Usuario con rol `Administrators` o `FormManager`

**Upload:**
1. Click "Upload New Form"
2. Select: `example-form-deployment-1.0.8-abc1234.zip`
3. Click "Upload"

**Resultado:**
- Form extraído a: `E:\BIZUITSites\clientX\clientXBIZUITCustomForms\public\forms\example-form\form.js`
- Metadata guardada en DB (tabla FormMetadata)

#### 6.2. Verificación

**Check 1: File System**

```bash
# Verificar que existe
ls E:\BIZUITSites\clientX\clientXBIZUITCustomForms\public\forms\example-form\form.js

# Verificar tamaño
# Debe ser ~50 KB para example-form
```

**Check 2: HTTP Request**

```bash
curl -I https://your-bizuit-host/clientXBIZUITCustomForms/forms/example-form/form.js

# Esperar: HTTP/1.1 200 OK
```

**Check 3: Admin Panel**

Ir a: https://your-bizuit-host/clientXBIZUITCustomForms/admin/forms

Debe listar:
- **Form:** example-form
- **Version:** 1.0.8
- **Status:** Active ✅

**Check 4: Runtime Loading**

```bash
# Con NEXT_PUBLIC_ALLOW_DEV_MODE=true (solo desarrollo)
https://your-bizuit-host/clientXBIZUITCustomForms/form/example-form?token=test&userName=Test

# Con token real (producción)
# El Dashboard genera la URL completa con token encriptado
```

---

## 🔄 Actualizar Form Existente

### Proceso de Actualización

```bash
# 1. Download nuevo artifact de GitHub Actions
# example-form-deployment-1.0.9-xyz7890.zip

# 2. Upload via admin panel (mismo proceso que deployment inicial)
https://your-bizuit-host/clientXBIZUITCustomForms/admin/upload-forms

# 3. El sistema automáticamente:
#    - Reemplaza form.js anterior
#    - Actualiza versión en DB
#    - Mantiene historial (si está configurado)

# 4. Verificar nueva versión
curl https://your-bizuit-host/clientXBIZUITCustomForms/forms/example-form/form.js | head -n 5
# Debe mostrar: /* Bizuit Custom Form: example-form */
#               /* Built: 2025-11-23T15:30:00.000Z */
```

### Rollback a Versión Anterior

**Opción A: Via Admin Panel**

1. Admin Panel → Forms
2. Select form: example-form
3. View History
4. Select versión anterior (ej: 1.0.8)
5. Click "Restore"

**Opción B: Re-upload ZIP Anterior**

```bash
# Download artifact antiguo de GitHub
# https://github.com/{your-org}/bizuit-custom-form-sample/actions

# Upload via admin panel
# El sistema reemplaza con la versión antigua
```

---

## 🌍 Deployment a Múltiples Entornos

### Mismo Form, Diferentes Clientes

**Escenario:** Deploy `example-form` a ambos entornos (clientX y clientY)

```bash
# 1. Download artifact UNA VEZ desde GitHub Actions
example-form-deployment-1.0.8-abc1234.zip

# 2. Upload a CADA entorno

# Entorno 1: clientX
https://your-bizuit-host/clientXBIZUITCustomForms/admin/upload-forms
→ Upload ZIP

# Entorno 2: clientY
https://your-bizuit-host/clientYBIZUITCustomForms/admin/upload-forms
→ Upload ZIP

# 3. Verificar en cada entorno
curl https://your-bizuit-host/clientXBIZUITCustomForms/forms/example-form/form.js
curl https://your-bizuit-host/clientYBIZUITCustomForms/forms/example-form/form.js
```

**Resultado:**
- ✅ Mismo código (`form.js` idéntico)
- ✅ Misma versión (1.0.8)
- ✅ Diferentes configuraciones (cada entorno tiene su `.env.local`)

### Configuraciones Específicas por Entorno

**NEXT_PUBLIC_BASE_PATH (Build-time Only):**

⚠️ **PROBLEMA CONOCIDO:** Variables `NEXT_PUBLIC_*` son build-time, no runtime!

**Solución:** Runtime app usa parseo dinámico del basePath:

```typescript
// En useLoginForm.ts, useLogout.ts, etc.
const getBasePath = () => {
  try {
    const scripts = document.querySelectorAll('script')
    for (const script of scripts) {
      const content = script.textContent || ''
      const match = content.match(/\\"p\\":\\"(\/[^\\]+)\\"/)
      if (match && match[1]) return match[1]
    }
  } catch {}
  return process.env.NEXT_PUBLIC_BASE_PATH || '/'
}

const basePath = getBasePath()  // Detecta runtime basePath
```

Esto permite usar **un único build** para múltiples entornos con diferentes basePaths.

---

## 🔧 Configuración Avanzada

### Custom Forms con Procesos Específicos

**Ejemplo:** Form `example-form` que llama a proceso `CustomProcess`

```typescript
// src/index.tsx
const SDK_CONFIG = {
  apiUrl: 'https://your-bizuit-host/clientXBizuitDashboardapi/api/',
  processName: 'CustomProcess',
  username: 'your_username',
  password: 'your_password'
};

// El SDK se conecta al API del Dashboard del entorno
const sdk = new BizuitSDK({ apiUrl: SDK_CONFIG.apiUrl });
```

**Deployment:**

- **clientX:** ✅ Deploy (tiene el proceso CustomProcess)
- **clientY:** Evaluar si tiene el mismo proceso o requiere variación

### Forms Agnósticos de Entorno

**Ejemplo:** Form `another-form` que usa parámetros del Dashboard

```typescript
// No hardcodear API URL, usar dashboardParams
export default function AnotherForm({ dashboardParams }: FormProps) {
  // SDK usa el token del Dashboard
  const { token, userName } = dashboardParams || {};

  // Process name puede venir de dashboardParams o ser configurable
}
```

Este form **funciona en cualquier entorno** sin cambios.

---

## 📊 Monitoreo y Logs

### Logs del Runtime App (Windows Service)

```powershell
# Ver logs del servicio en Event Viewer
Get-EventLog -LogName Application -Source "*Bizuit*" -Newest 50

# Filtrar por errores
Get-EventLog -LogName Application -Source "*Bizuit*" -EntryType Error -Newest 20

# Ver en tiempo real
Get-EventLog -LogName Application -Source "*Bizuit*" -Newest 1 -After (Get-Date).AddMinutes(-5)
```

### Logs del Backend .NET

**Ubicación:** Configurado en `appsettings.json` → Serilog

```bash
# Logs del backend (ejemplo)
E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd\logs\api-{date}.log
```

**Ver logs en tiempo real (PowerShell):**
```powershell
Get-Content -Path "E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd\logs\api-*.log" -Tail 50 -Wait
```

### Logs de IIS

```
C:\inetpub\logs\LogFiles\W3SVC1\
├── u_ex{date}.log    # Access logs
└── Failed Request Tracing (si está habilitado)
```

### Application Insights (si está configurado)

```bash
# Next.js automaticamente loggea errores si está configurado
# Ver: Azure Portal → Application Insights → Failures
```

---

## 🐛 Troubleshooting

### Form no carga - Error 404

**Síntoma:** `GET /forms/example-form/form.js → 404 Not Found`

**Checklist:**

1. **Verificar archivo existe:**
   ```bash
   ls E:\BIZUITSites\clientX\clientXBIZUITCustomForms\public\forms\example-form\form.js
   ```

2. **Verificar permisos:**
   - IIS App Pool user debe tener READ en `public/forms/`

3. **Verificar IIS serving static files:**
   - Static Content feature instalado
   - MIME type `.js` → `application/javascript`

4. **Re-upload via admin panel:**
   - Puede haber fallado el upload anterior

### Form carga pero no funciona

**Síntoma:** Página blanca o errores en console

**Debug:**

1. **Abrir DevTools (F12) → Console:**
   ```
   Uncaught ReferenceError: React is not defined
   ```

   **Solución:** Runtime app debe cargar React antes del form.

   Verificar en `runtime-app/app/layout.tsx`:
   ```typescript
   <Script src="https://unpkg.com/react@18/umd/react.production.min.js" />
   <Script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" />
   ```

2. **Error: "Cannot resolve module":**
   ```
   Error: Cannot find module '@tyconsa/bizuit-form-sdk'
   ```

   **Solución:** Runtime app debe cargar los packages antes del form.

   Verificar en `runtime-app/app/form/[formName]/page.tsx`:
   ```typescript
   <Script src="https://unpkg.com/@tyconsa/bizuit-form-sdk@2.0.1/dist/index.umd.js" />
   <Script src="https://unpkg.com/@tyconsa/bizuit-ui-components@1.7.0/dist/index.umd.js" />
   ```

3. **Network errors / CORS:**

   **Verificar backend CORS:**
   ```bash
   # En .env.local del backend
   CORS_ORIGINS=https://your-bizuit-host,http://localhost:3001
   ```

### Token inválido / Authentication failed

**Síntoma:** "Token validation failed" o "Unauthorized"

**Checklist:**

1. **Verificar ENCRYPTION_TOKEN_KEY coincide:**
   - Backend `.env.local` → `ENCRYPTION_TOKEN_KEY`
   - Dashboard config → mismo valor (24 caracteres)

2. **Verificar Persistence DB:**
   ```sql
   SELECT TOP 10 * FROM SecurityTokens
   WHERE UserName = 'test-user'
   ORDER BY CreatedDate DESC
   ```

3. **Token expirado:**
   - Los tokens tienen tiempo de expiración (default: 30 min)
   - Verificar `NEXT_PUBLIC_BIZUIT_TOKEN_EXPIRATION_MINUTES`

### Deployment Package ZIP inválido

**Síntoma:** "Invalid deployment package" al hacer upload

**Causas posibles:**

1. **Estructura incorrecta:**

   Verificar ZIP contiene:
   ```
   manifest.json
   VERSION.txt
   forms/{form-name}/form.js
   ```

2. **manifest.json corrupto:**

   ```bash
   unzip -p example-form-deployment-1.0.8-abc1234.zip manifest.json | jq .
   ```

3. **form.js faltante:**

   ```bash
   unzip -l example-form-deployment-1.0.8-abc1234.zip | grep form.js
   ```

### Runtime App (Windows Service) crashed

**Síntoma:** Servicio muestra status `Stopped` o no responde

**Debug:**

```powershell
# Ver estado del servicio
Get-Service -Name "BizuitCustomForms-clientX-Runtime"

# Ver logs de errores
Get-EventLog -LogName Application -Source "*Bizuit*" -EntryType Error -Newest 20

# Reiniciar servicio
Restart-Service -Name "BizuitCustomForms-clientX-Runtime"

# Si falla persistentemente, verificar:
# 1. Puerto no está en uso
netstat -ano | findstr :3002

# 2. .env.local existe y es válido
Get-Content .env.local

# 3. Build de Next.js completó correctamente
Get-ChildItem .next\standalone\ -Recurse
```

### Backend .NET no responde

**Síntoma:** HTTP 503 o 500 en requests al backend

**Debug:**

```bash
# 1. Verificar IIS Virtual App existe
# IIS Manager → your-bizuit-host → Applications → clientXBIZUITCustomFormsBackEnd

# 2. Verificar Application Pool
# Application Pools → DefaultAppPool → Status: Started

# 3. Verificar logs de Serilog
Get-Content -Path "E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd\logs\api-*.log" -Tail 50

# 4. Verificar web.config existe
ls E:\BIZUITSites\clientX\clientXBIZUITCustomFormsBackEnd\web.config

# 5. Reciclar Application Pool
# IIS Manager → Application Pools → DefaultAppPool → Recycle
```

---

## 📋 Checklist de Deployment

### Pre-Deployment

- [ ] Form buildeado exitosamente en local
- [ ] Testing en `dev.html` funciona
- [ ] Artifact descargado de GitHub Actions
- [ ] ZIP verificado (manifest.json, form.js presentes)

### Deployment

- [ ] Login al admin panel exitoso
- [ ] ZIP uploaded correctamente
- [ ] Admin panel muestra nueva versión
- [ ] File system tiene `form.js` en `/public/forms/`
- [ ] HTTP request a `/forms/{form}/form.js` retorna 200

### Post-Deployment

- [ ] Form carga en runtime app
- [ ] No hay errores en browser console
- [ ] Form funciona con datos mock (si dev mode habilitado)
- [ ] Integration con Dashboard funciona (con token real)
- [ ] Windows Service logs (Event Viewer) no muestran errores
- [ ] Backend .NET logs (Serilog) no muestran errores
- [ ] IIS logs no muestran errores 500

---

## 🔗 Referencias

- **Repositorio:** https://github.com/{your-org}/bizuit-custom-form-sample
- **GitHub Actions:** https://github.com/{your-org}/bizuit-custom-form-sample/actions
- **SDK npm:** https://www.npmjs.com/package/@tyconsa/bizuit-form-sdk
- **UI Components npm:** https://www.npmjs.com/package/@tyconsa/bizuit-ui-components
- **Guía de Desarrollo:** [DEVELOPMENT.md](DEVELOPMENT.md)
- **Versioning:** See [README.md](README.md#deployment--versioning)

---

**Última actualización:** 2025-11-23
**Mantenedor:** Tyconsa Team
