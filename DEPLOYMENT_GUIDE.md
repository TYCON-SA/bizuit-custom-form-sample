# Guía de Deployment - Custom Forms a Entornos

Pasos completos para deployar custom forms a entornos Bizuit BPM (arielsch, recubiz, etc.)

## 📋 Arquitectura de Entornos

### Entornos Disponibles

```
test.bizuit.com/
├── arielschBIZUITCustomForms/
│   ├── Runtime App (Next.js)   → Puerto 3001, IIS Reverse Proxy
│   ├── Backend API (FastAPI)   → Puerto 8000, IIS Reverse Proxy
│   └── Forms Storage           → /public/forms/{form-name}/form.js
│
└── recubizBIZUITCustomForms/
    ├── Runtime App (Next.js)   → Puerto 3002, IIS Reverse Proxy
    ├── Backend API (FastAPI)   → Puerto 8001, IIS Reverse Proxy
    └── Forms Storage           → /public/forms/{form-name}/form.js
```

### URLs por Entorno

| Entorno | Runtime App | Backend API | Admin Panel |
|---------|------------|-------------|-------------|
| **arielsch** | `test.bizuit.com/arielschBIZUITCustomForms` | `test.bizuit.com/arielschBIZUITCustomForms/api` | `test.bizuit.com/arielschBIZUITCustomForms/admin` |
| **recubiz** | `test.bizuit.com/recubizBIZUITCustomForms` | `test.bizuit.com/recubizBIZUITCustomForms/api` | `test.bizuit.com/recubizBIZUITCustomForms/admin` |

---

## 🚀 Deployment de un Form

### Paso 1: Obtener el Artifact

#### Opción A: Download desde GitHub Actions (Recomendado)

1. Ir a: https://github.com/arielsch74/bizuit-custom-form-sample/actions
2. Click en el workflow run más reciente (debe estar ✅ exitoso)
3. Scroll down a "Artifacts"
4. Download el ZIP del form deseado:
   - `recubiz-gestion-deployment-1.0.8-abc1234`
   - `sample-form-2-deployment-1.0.13-abc1234`

#### Opción B: Build Local

```bash
cd recubiz-gestion
npm run build

# Crear ZIP manualmente (si es necesario)
zip -r recubiz-gestion-deployment-local.zip \
  dist/form.js \
  dist/form.js.map \
  dist/form.meta.json
```

### Paso 2: Verificar Contenido del ZIP

**Descomprimir para inspeccionar:**

```bash
unzip recubiz-gestion-deployment-1.0.8-abc1234.zip -d temp-inspect
tree temp-inspect/

# Estructura esperada:
# temp-inspect/
# ├── manifest.json        # Metadata del deployment
# ├── VERSION.txt          # Info de build (commit, fecha, etc.)
# └── forms/
#     └── recubiz-gestion/
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
      "formName": "recubiz-gestion",
      "version": "1.0.8",
      "gitTag": "recubiz-gestion-v1.0.8",
      "sizeBytes": 52097,
      "path": "forms/recubiz-gestion/form.js"
    }
  ]
}
```

### Paso 3: Upload al Entorno

#### A. Via Admin Panel (Recomendado)

**URL Admin Panel:**
- arielsch: https://test.bizuit.com/arielschBIZUITCustomForms/admin/upload-forms
- recubiz: https://test.bizuit.com/recubizBIZUITCustomForms/admin/upload-forms

**Steps:**

1. **Login:** Credenciales con rol `Administrators` o `FormManager`
2. **Upload:**
   - Click "Upload New Form" o "Upload Form Package"
   - Seleccionar ZIP: `recubiz-gestion-deployment-1.0.8-abc1234.zip`
   - Click "Upload"
3. **Verificación:**
   - El sistema muestra: "Form uploaded successfully: recubiz-gestion v1.0.8"
   - La tabla de forms lista el nuevo form

#### B. Via API (Avanzado)

```bash
# Endpoint
POST https://test.bizuit.com/arielschBIZUITCustomForms/api/admin/upload-form

# Headers
Authorization: Bearer {admin-jwt-token}
Content-Type: multipart/form-data

# Body
file: recubiz-gestion-deployment-1.0.8-abc1234.zip
```

**Ejemplo con curl:**

```bash
# 1. Obtener token admin (requiere login)
TOKEN=$(curl -X POST https://test.bizuit.com/arielschBIZUITCustomForms/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 2. Upload form
curl -X POST https://test.bizuit.com/arielschBIZUITCustomForms/api/admin/upload-form \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@recubiz-gestion-deployment-1.0.8-abc1234.zip"
```

### Paso 4: Verificación Post-Deployment

#### 1. Verificar Form File en Public

**URL del form compilado:**

```bash
# arielsch
https://test.bizuit.com/arielschBIZUITCustomForms/forms/recubiz-gestion/form.js

# recubiz
https://test.bizuit.com/recubizBIZUITCustomForms/forms/recubiz-gestion/form.js
```

**Test con curl:**

```bash
curl -I https://test.bizuit.com/arielschBIZUITCustomForms/forms/recubiz-gestion/form.js

# Debe retornar:
# HTTP/1.1 200 OK
# Content-Type: application/javascript
```

#### 2. Verificar Metadata en Admin Panel

**URL:** https://test.bizuit.com/arielschBIZUITCustomForms/admin/forms

**Debe mostrar:**

| Form Name | Version | Status | Last Updated | Actions |
|-----------|---------|--------|--------------|---------|
| recubiz-gestion | 1.0.8 | ✅ Active | 2025-11-23 14:05 | View / Delete |

#### 3. Testing en Runtime App

**Con Token Mock (Solo si NEXT_PUBLIC_ALLOW_DEV_MODE=true):**

```
https://test.bizuit.com/arielschBIZUITCustomForms/form/recubiz-gestion
  ?token=test-token
  &userName=TestUser
```

⚠️ **IMPORTANTE:** `NEXT_PUBLIC_ALLOW_DEV_MODE` debe ser `false` en producción!

**Con Token Real (Producción):**

El form se accede vía Dashboard de Bizuit BPM. El Dashboard genera URLs con token encriptado:

```
https://test.bizuit.com/arielschBIZUITCustomForms/form/recubiz-gestion
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
cd recubiz-gestion
# Editar src/index.tsx

# 2. Build local para testing
npm run build

# 3. Test en dev.html
http-server -p 8080 --cors
# Abrir: http://localhost:8080/dev.html

# 4. Commit y push
git add .
git commit -m "feat(recubiz-gestion): add new feature X"
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
#    - Crea ZIP: recubiz-gestion-deployment-1.0.9-{hash}.zip
#    - Commitea ZIP a recubiz-gestion/upload/
#    - Crea git tag: recubiz-gestion-v1.0.9
#    - Sube artifact a GitHub Actions

# 7. Download artifact de GitHub Actions
# https://github.com/arielsch74/bizuit-custom-form-sample/actions

# 8. Upload via admin panel a cada entorno deseado
# arielsch: test.bizuit.com/arielschBIZUITCustomForms/admin/upload-forms
# recubiz: test.bizuit.com/recubizBIZUITCustomForms/admin/upload-forms
```

---

## 🏢 Setup de Nuevo Entorno

### Paso 1: Preparar Infraestructura

#### 1.1. Base de Datos SQL Server

Crear 2 databases:

```sql
-- Database 1: Dashboard del cliente
CREATE DATABASE clienteXBizuitDashboard;

-- Database 2: Persistence Store (compartido)
-- (usar existente: arielschBizuitPersistenceStore)
```

#### 1.2. Directorios en Servidor

```bash
# Windows Server
E:\BIZUITSites\clienteX\
├── clienteXBIZUITCustomForms\           # Runtime App
│   ├── .next\                            # Next.js build
│   ├── public\
│   │   └── forms\                        # Forms dinámicos
│   │       ├── recubiz-gestion\
│   │       │   └── form.js
│   │       └── sample-form-2\
│   │           └── form.js
│   ├── .env.local
│   └── package.json
│
└── clienteXBIZUITCustomFormsBackEnd\    # Backend API
    ├── app\                              # FastAPI app
    ├── .env.local
    └── requirements.txt
```

### Paso 2: Configurar Backend API

#### 2.1. Crear `.env.local`

```bash
# En: E:\BIZUITSites\clienteX\clienteXBIZUITCustomFormsBackEnd\.env.local

# SQL Server - Main Database
DB_SERVER=test.bizuit.com
DB_DATABASE=clienteXBizuitDashboard
DB_USER=BIZUITclienteX
DB_PASSWORD={secure-password}

# SQL Server - Persistence Store
PERSISTENCE_DB_SERVER=test.bizuit.com
PERSISTENCE_DB_DATABASE=arielschBizuitPersistenceStore
PERSISTENCE_DB_USER=BIZUITarielsch
PERSISTENCE_DB_PASSWORD=Th3Qu33n1sD34d$

# Bizuit Dashboard API
BIZUIT_DASHBOARD_API_URL=https://test.bizuit.com/clienteXBizuitDashboardapi/api

# Security
JWT_SECRET_KEY={generate-with-openssl-rand-hex-32}
ENCRYPTION_TOKEN_KEY={24-char-key-must-match-dashboard}

# Admin Access
ADMIN_ALLOWED_ROLES=Administrators,BIZUIT Admins,SuperAdmin,FormManager

# API Configuration
API_PORT=8002  # ⚠️ Unique port per environment!
MAX_UPLOAD_SIZE_MB=50
TEMP_UPLOAD_PATH=./temp-uploads

# CORS
CORS_ORIGINS=https://test.bizuit.com
```

#### 2.2. Generar Secrets

```bash
# JWT Secret (32 bytes hex)
openssl rand -hex 32

# Encryption Key (24 caracteres, coordinar con Dashboard)
# Debe ser el mismo que usa Dashboard para encriptar tokens
```

### Paso 3: Configurar Runtime App

#### 3.1. Crear `.env.local`

```bash
# En: E:\BIZUITSites\clienteX\clienteXBIZUITCustomForms\.env.local

# Bizuit API Configuration
NEXT_PUBLIC_BIZUIT_DASHBOARD_API_URL=https://test.bizuit.com/clienteXBizuitDashboardapi/api

# Base path para IIS deployment
NEXT_PUBLIC_BASE_PATH=/clienteXBIZUITCustomForms

# FastAPI backend URL (server-side)
FASTAPI_URL=http://localhost:8002

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
cd E:\BIZUITSites\clienteX\clienteXBIZUITCustomForms
npm install
npm run build
```

### Paso 4: Configurar PM2

#### 4.1. PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'clienteX-runtime',
      cwd: 'E:\\BIZUITSites\\clienteX\\clienteXBIZUITCustomForms',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    {
      name: 'clienteX-backend',
      cwd: 'E:\\BIZUITSites\\clienteX\\clienteXBIZUITCustomFormsBackEnd',
      script: 'main.py',
      interpreter: 'python',
      env: {
        PYTHONPATH: 'E:\\BIZUITSites\\clienteX\\clienteXBIZUITCustomFormsBackEnd'
      }
    }
  ]
};
```

#### 4.2. Iniciar Servicios

```bash
# Start apps
pm2 start ecosystem.config.js

# Verificar
pm2 list
pm2 logs clienteX-runtime
pm2 logs clienteX-backend

# Save PM2 config
pm2 save

# Setup auto-startup (Windows)
pm2 startup
```

### Paso 5: Configurar IIS

#### 5.1. Site Configuration

**Site:** `test.bizuit.com`

**Application Pool:** DefaultAppPool (.NET CLR Version: No Managed Code)

#### 5.2. URL Rewrite Rules

**Para:** `/clienteXBIZUITCustomForms/*`

```xml
<!-- Web.config en E:\DevSites\test.bizuit.com -->
<rule name="clienteX-CustomForms-API" stopProcessing="true">
  <match url="^clienteXBIZUITCustomForms/api/(.*)$" />
  <action type="Rewrite" url="http://localhost:8002/api/{R:1}" />
</rule>

<rule name="clienteX-CustomForms-Runtime" stopProcessing="true">
  <match url="^clienteXBIZUITCustomForms/(.*)$" />
  <action type="Rewrite" url="http://localhost:3002/{R:1}" />
</rule>
```

#### 5.3. Application Request Routing (ARR)

**Enable Proxy:**

1. IIS Manager → Server → Application Request Routing
2. Server Proxy Settings → Enable proxy ✅
3. Set timeout: 300 seconds

### Paso 6: Deployment del Form

#### 6.1. Upload via Admin Panel

**URL:** https://test.bizuit.com/clienteXBIZUITCustomForms/admin/upload-forms

**Login:** Usuario con rol `Administrators` o `FormManager`

**Upload:**
1. Click "Upload New Form"
2. Select: `recubiz-gestion-deployment-1.0.8-abc1234.zip`
3. Click "Upload"

**Resultado:**
- Form extraído a: `E:\BIZUITSites\clienteX\clienteXBIZUITCustomForms\public\forms\recubiz-gestion\form.js`
- Metadata guardada en DB (tabla FormMetadata)

#### 6.2. Verificación

**Check 1: File System**

```bash
# Verificar que existe
ls E:\BIZUITSites\clienteX\clienteXBIZUITCustomForms\public\forms\recubiz-gestion\form.js

# Verificar tamaño
# Debe ser ~50 KB para recubiz-gestion
```

**Check 2: HTTP Request**

```bash
curl -I https://test.bizuit.com/clienteXBIZUITCustomForms/forms/recubiz-gestion/form.js

# Esperar: HTTP/1.1 200 OK
```

**Check 3: Admin Panel**

Ir a: https://test.bizuit.com/clienteXBIZUITCustomForms/admin/forms

Debe listar:
- **Form:** recubiz-gestion
- **Version:** 1.0.8
- **Status:** Active ✅

**Check 4: Runtime Loading**

```bash
# Con NEXT_PUBLIC_ALLOW_DEV_MODE=true (solo desarrollo)
https://test.bizuit.com/clienteXBIZUITCustomForms/form/recubiz-gestion?token=test&userName=Test

# Con token real (producción)
# El Dashboard genera la URL completa con token encriptado
```

---

## 🔄 Actualizar Form Existente

### Proceso de Actualización

```bash
# 1. Download nuevo artifact de GitHub Actions
# recubiz-gestion-deployment-1.0.9-xyz7890.zip

# 2. Upload via admin panel (mismo proceso que deployment inicial)
https://test.bizuit.com/clienteXBIZUITCustomForms/admin/upload-forms

# 3. El sistema automáticamente:
#    - Reemplaza form.js anterior
#    - Actualiza versión en DB
#    - Mantiene historial (si está configurado)

# 4. Verificar nueva versión
curl https://test.bizuit.com/clienteXBIZUITCustomForms/forms/recubiz-gestion/form.js | head -n 5
# Debe mostrar: /* Bizuit Custom Form: recubiz-gestion */
#               /* Built: 2025-11-23T15:30:00.000Z */
```

### Rollback a Versión Anterior

**Opción A: Via Admin Panel**

1. Admin Panel → Forms
2. Select form: recubiz-gestion
3. View History
4. Select versión anterior (ej: 1.0.8)
5. Click "Restore"

**Opción B: Re-upload ZIP Anterior**

```bash
# Download artifact antiguo de GitHub
# https://github.com/arielsch74/bizuit-custom-form-sample/actions

# Upload via admin panel
# El sistema reemplaza con la versión antigua
```

---

## 🌍 Deployment a Múltiples Entornos

### Mismo Form, Diferentes Clientes

**Escenario:** Deploy `recubiz-gestion` a ambos entornos (arielsch y recubiz)

```bash
# 1. Download artifact UNA VEZ desde GitHub Actions
recubiz-gestion-deployment-1.0.8-abc1234.zip

# 2. Upload a CADA entorno

# Entorno 1: arielsch
https://test.bizuit.com/arielschBIZUITCustomForms/admin/upload-forms
→ Upload ZIP

# Entorno 2: recubiz
https://test.bizuit.com/recubizBIZUITCustomForms/admin/upload-forms
→ Upload ZIP

# 3. Verificar en cada entorno
curl https://test.bizuit.com/arielschBIZUITCustomForms/forms/recubiz-gestion/form.js
curl https://test.bizuit.com/recubizBIZUITCustomForms/forms/recubiz-gestion/form.js
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

**Ejemplo:** Form `recubiz-gestion` que llama a proceso `RB_ObtenerProximaGestion`

```typescript
// src/index.tsx
const SDK_CONFIG = {
  apiUrl: 'https://test.bizuit.com/recubizBizuitDashboardapi/api/',
  processName: 'RB_ObtenerProximaGestion',
  username: 'admin',
  password: 'admin123'
};

// El SDK se conecta al API del Dashboard del entorno
const sdk = new BizuitSDK({ apiUrl: SDK_CONFIG.apiUrl });
```

**Deployment:**

- **arielsch:** No usar este form (no tiene proceso RB_ObtenerProximaGestion)
- **recubiz:** ✅ Deploy (tiene el proceso configurado)

### Forms Agnósticos de Entorno

**Ejemplo:** Form `sample-form-2` que usa parámetros del Dashboard

```typescript
// No hardcodear API URL, usar dashboardParams
export default function SampleForm2({ dashboardParams }: FormProps) {
  // SDK usa el token del Dashboard
  const { token, userName } = dashboardParams || {};

  // Process name puede venir de dashboardParams o ser configurable
}
```

Este form **funciona en cualquier entorno** sin cambios.

---

## 📊 Monitoreo y Logs

### Logs de PM2

```bash
# Ver logs en tiempo real
pm2 logs clienteX-runtime
pm2 logs clienteX-backend

# Ver últimas 100 líneas
pm2 logs clienteX-runtime --lines 100

# Logs por fecha
pm2 logs --timestamp
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

**Síntoma:** `GET /forms/recubiz-gestion/form.js → 404 Not Found`

**Checklist:**

1. **Verificar archivo existe:**
   ```bash
   ls E:\BIZUITSites\clienteX\clienteXBIZUITCustomForms\public\forms\recubiz-gestion\form.js
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
   CORS_ORIGINS=https://test.bizuit.com,http://localhost:3001
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
   unzip -p recubiz-gestion-deployment-1.0.8-abc1234.zip manifest.json | jq .
   ```

3. **form.js faltante:**

   ```bash
   unzip -l recubiz-gestion-deployment-1.0.8-abc1234.zip | grep form.js
   ```

### PM2 Process crashed

**Síntoma:** `pm2 list` muestra status `errored` o `stopped`

**Debug:**

```bash
# Ver logs del crash
pm2 logs clienteX-runtime --err

# Reiniciar
pm2 restart clienteX-runtime

# Si falla persistentemente, verificar:
# 1. Puerto no está en uso
netstat -ano | findstr :3002

# 2. .env.local existe y es válido
cat .env.local

# 3. Build de Next.js completó correctamente
ls -la .next/standalone/
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
- [ ] PM2 logs no muestran errores
- [ ] IIS logs no muestran errores 500

---

## 🔗 Referencias

- **Repositorio:** https://github.com/arielsch74/bizuit-custom-form-sample
- **GitHub Actions:** https://github.com/arielsch74/bizuit-custom-form-sample/actions
- **SDK npm:** https://www.npmjs.com/package/@tyconsa/bizuit-form-sdk
- **UI Components npm:** https://www.npmjs.com/package/@tyconsa/bizuit-ui-components
- **Guía de Desarrollo:** [DEVELOPMENT.md](DEVELOPMENT.md)
- **Versioning:** [VERSIONING.md](VERSIONING.md)

---

**Última actualización:** 2025-11-23
**Mantenedor:** Tyconsa Team
