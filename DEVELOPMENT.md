# Guía de Desarrollo - Bizuit Custom Forms

Guía completa para desarrollar, testear y deployar custom forms en el ecosistema Bizuit BPM.

## 📋 Tabla de Contenidos

- [Setup Inicial](#setup-inicial)
- [Desarrollo Local](#desarrollo-local)
- [Testing en Dev Mode](#testing-en-dev-mode)
- [Build y Deployment](#build-y-deployment)
- [Deployment a Entornos](#deployment-a-entornos)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Inicial

### Prerrequisitos

- Node.js 18+ y npm
- Git
- Editor de código (VS Code recomendado)
- HTTP server local (ej: `http-server` de npm)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/arielsch74/bizuit-custom-form-sample.git
cd bizuit-custom-form-sample
```

### 2. Instalar Dependencias

```bash
# Dependencia raíz (esbuild)
npm install

# Instalar dependencias de cada form (opcional, solo para IDE)
cd recubiz-gestion
npm install
cd ..
```

### 3. Instalar HTTP Server (para dev mode)

```bash
npm install -g http-server
```

---

## 💻 Desarrollo Local

### Estructura de un Form

```
recubiz-gestion/
├── src/
│   └── index.tsx          # Código fuente del form
├── dist/
│   ├── form.js            # Bundle compilado
│   ├── form.js.map        # Source map
│   └── form.meta.json     # Metadata
├── upload/                # ZIPs de deployment (generado por CI/CD)
├── dev.html               # Página de testing local
├── package.json           # Dependencias y versión
└── tsconfig.json          # Configuración TypeScript
```

### Crear un Nuevo Form

1. **Copiar estructura de form existente:**

```bash
cp -r recubiz-gestion my-new-form
cd my-new-form
```

2. **Actualizar `package.json`:**

```json
{
  "name": "@tyconsa/bizuit-form-my-new-form",
  "version": "1.0.0",
  "description": "Mi nuevo formulario",
  "scripts": {
    "build": "node ../build-form.js ./src/index.tsx ./dist/form.js my-new-form"
  },
  "dependencies": {
    "@tyconsa/bizuit-form-sdk": "^2.0.1",
    "@tyconsa/bizuit-ui-components": "^1.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

3. **Crear `src/index.tsx`:**

```typescript
/**
 * My New Form - Description
 */

import { useState } from 'react';
import { BizuitCard, Button, BizuitThemeProvider } from '@tyconsa/bizuit-ui-components';
import { BizuitSDK } from '@tyconsa/bizuit-form-sdk';

interface FormProps {
  dashboardParams?: any;
}

export default function MyNewForm({ dashboardParams }: FormProps) {
  const [data, setData] = useState({});

  return (
    <BizuitThemeProvider>
      <div className="min-h-screen bg-background p-4">
        <BizuitCard>
          <h1 className="text-2xl font-bold">My New Form</h1>
          {/* Tu form aquí */}
        </BizuitCard>
      </div>
    </BizuitThemeProvider>
  );
}
```

4. **Crear `dev.html`** (copiar de otro form y ajustar):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>My New Form - Dev Mode</title>
  <!-- CDNs: Tailwind, React, ReactDOM -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import MyNewForm from './dist/form.js';
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(MyNewForm, {
      dashboardParams: {
        userName: 'Test User',
        token: 'mock-token'
      }
    }));
  </script>
</body>
</html>
```

---

## 🧪 Testing en Dev Mode

### 1. Build del Form

```bash
cd recubiz-gestion
npm run build
```

**Output:**
```
🔨 Building Bizuit Custom Form...
📄 Entry: ./src/index.tsx
📦 Output: ./dist/form.js
🏷️  Name: recubiz-gestion
✅ Build successful!
📊 Size: 50.88 KB
```

### 2. Levantar HTTP Server

**En el directorio del form:**

```bash
http-server -p 8080 --cors
```

**URLs disponibles:**
- **Dev Page:** http://localhost:8080/dev.html
- **Form JS:** http://localhost:8080/dist/form.js
- **Source Map:** http://localhost:8080/dist/form.js.map

### 3. Workflow de Desarrollo

```bash
# Terminal 1: Watch mode (rebuild automático)
cd recubiz-gestion
while true; do
  inotifywait -e modify src/index.tsx && npm run build
done

# Terminal 2: HTTP server
http-server -p 8080 --cors
```

**Alternativa con `nodemon`:**

```bash
npm install -g nodemon

# Watch y rebuild automático
nodemon --watch src --ext tsx --exec "npm run build"
```

### 4. Testing con Mock Data

Editar `dev.html` para simular diferentes escenarios:

```javascript
// Escenario 1: Nuevo proceso
const mockDashboardParams = {
  userName: 'Test User',
  eventName: 'StartProcess',
  activityName: 'InitialActivity',
  token: 'mock-token-123'
};

// Escenario 2: Continuar instancia existente
const mockDashboardParams = {
  userName: 'Test User',
  instanceId: 'INST-12345',
  eventName: 'ContinueProcess',
  activityName: 'SecondActivity',
  token: 'mock-token-123'
};
```

### 5. Debugging

**En el navegador:**

1. Abrir DevTools (F12)
2. Tab "Sources"
3. Los source maps permiten debuggear el código TypeScript original
4. Poner breakpoints en `src/index.tsx`

**Logs del SDK:**

```typescript
// En tu form
console.log('SDK Config:', sdk.getConfig());
console.log('Dashboard Params:', dashboardParams);
```

---

## 📦 Build y Deployment

### Build Manual

```bash
cd recubiz-gestion
npm run build
```

### Build Automático (GitHub Actions)

**Trigger:** Push a `main` branch

**Workflow:** `.github/workflows/build-deployment-package.yml`

**Proceso:**

1. **Detección:** Detecta forms cambiados (src/ o package.json)
2. **Versioning:** Calcula nueva versión basada en git tags
3. **Build:** Compila cada form con esbuild
4. **Packaging:** Crea ZIP por form: `{form}-deployment-{version}-{hash}.zip`
5. **Commit:** Commitea ZIPs a `{form}/upload/`
6. **Git Tags:** Crea tag `{form}-v{version}`
7. **Artifacts:** Sube artifacts a GitHub Actions

**Artifacts generados:**

- **Nombre:** `recubiz-gestion-deployment-1.0.8-abc1234`
- **Contenido:** ZIP con form compilado, manifest.json, VERSION.txt
- **Duración:** 90 días

### Descargar Artifacts

1. Ir a: https://github.com/arielsch74/bizuit-custom-form-sample/actions
2. Click en el workflow run exitoso
3. Scroll down a "Artifacts"
4. Download ZIP del form deseado

---

## 🚀 Deployment a Entornos

### Arquitectura de Entornos

```
test.bizuit.com/
├── arielschBIZUITCustomForms/     # Cliente: arielsch
│   ├── runtime-app (Next.js)       # Puerto 3001
│   └── backend-api (FastAPI)       # Puerto 8000
│
└── recubizBIZUITCustomForms/      # Cliente: recubiz
    ├── runtime-app (Next.js)       # Puerto 3002
    └── backend-api (FastAPI)       # Puerto 8001
```

### Deployment a un Entorno (ej: arielsch)

#### 1. Preparar el ZIP

**Descargar artifact de GitHub Actions o usar ZIP local:**

```bash
# Desde GitHub Actions
# Download: recubiz-gestion-deployment-1.0.8-abc1234.zip

# Descomprimir para ver contenido (opcional)
unzip recubiz-gestion-deployment-1.0.8-abc1234.zip -d temp
tree temp/
# temp/
# ├── manifest.json
# ├── VERSION.txt
# └── forms/
#     └── recubiz-gestion/
#         └── form.js
```

#### 2. Upload via Admin Panel

**URL:** https://test.bizuit.com/arielschBIZUITCustomForms/admin/upload-forms

**Steps:**

1. Login con credenciales admin
2. Click "Upload New Form"
3. Seleccionar ZIP: `recubiz-gestion-deployment-1.0.8-abc1234.zip`
4. Click "Upload"
5. El sistema:
   - Extrae el ZIP
   - Valida manifest.json
   - Copia `form.js` a `/public/forms/recubiz-gestion/`
   - Actualiza metadata en DB

#### 3. Verificación Post-Deployment

**Check 1: Form File**

```bash
# En el servidor
curl https://test.bizuit.com/arielschBIZUITCustomForms/forms/recubiz-gestion/form.js
# Debe retornar el JavaScript compilado
```

**Check 2: Metadata**

```bash
# Verificar en admin panel
https://test.bizuit.com/arielschBIZUITCustomForms/admin/forms
# Debe listar: recubiz-gestion v1.0.8
```

**Check 3: Runtime Loading**

```bash
# URL de testing (si NEXT_PUBLIC_ALLOW_DEV_MODE=true)
https://test.bizuit.com/arielschBIZUITCustomForms/form/recubiz-gestion?token=test-token&userName=TestUser
# Debe cargar el form correctamente
```

#### 4. Integración con Dashboard

El form se carga automáticamente cuando el proceso Bizuit BPM lo invoca:

**URL generada por Dashboard:**
```
https://test.bizuit.com/arielschBIZUITCustomForms/form/recubiz-gestion
  ?token={encrypted-token}
  &userName={user}
  &instanceId={instance-id}
  &eventName={event}
  &activityName={activity}
```

**Runtime App carga dinámicamente:**

```typescript
// runtime-app/app/form/[formName]/page.tsx
const formModule = await import(`/forms/${formName}/form.js`);
```

### Deployment a Múltiples Entornos

**Mismo form, diferentes entornos:**

```bash
# 1. Upload a arielsch
https://test.bizuit.com/arielschBIZUITCustomForms/admin/upload-forms
→ recubiz-gestion-deployment-1.0.8-abc1234.zip

# 2. Upload a recubiz
https://test.bizuit.com/recubizBIZUITCustomForms/admin/upload-forms
→ recubiz-gestion-deployment-1.0.8-abc1234.zip
```

**IMPORTANTE:** Cada entorno tiene su propia base de datos y configuración:

- **arielsch:**
  - DB: `arielschBizuitDashboard`
  - API: `test.bizuit.com/arielschBIZUITDashboardapi/api`

- **recubiz:**
  - DB: `recubizBizuitDashboard`
  - API: `test.bizuit.com/recubizBizuitDashboardapi/api`

### Variables de Entorno

#### Runtime App (Next.js)

**Archivo:** `custom-forms/runtime-app/.env.local`

```bash
# Bizuit API Configuration
NEXT_PUBLIC_BIZUIT_DASHBOARD_API_URL=https://test.bizuit.com/arielschBIZUITDashboardapi/api

# Base path para IIS deployment
NEXT_PUBLIC_BASE_PATH=/arielschBIZUITCustomForms

# FastAPI backend URL (server-side only)
FASTAPI_URL=http://localhost:8000

# Timeouts
NEXT_PUBLIC_BIZUIT_TIMEOUT=30000
NEXT_PUBLIC_BIZUIT_TOKEN_EXPIRATION_MINUTES=30

# CRITICAL: Dev mode (MUST be false in production!)
NEXT_PUBLIC_ALLOW_DEV_MODE=false
```

#### Backend API (FastAPI)

**Archivo:** `custom-forms/backend-api/.env.local`

```bash
# SQL Server - Main Database
DB_SERVER=test.bizuit.com
DB_DATABASE=arielschBizuitDashboard
DB_USER=BIZUITarielsch
DB_PASSWORD=Th3Qu33n1sD34d$

# SQL Server - Persistence Store (Token Validation)
PERSISTENCE_DB_SERVER=test.bizuit.com
PERSISTENCE_DB_DATABASE=arielschBizuitPersistenceStore
PERSISTENCE_DB_USER=BIZUITarielsch
PERSISTENCE_DB_PASSWORD=Th3Qu33n1sD34d$

# Bizuit Dashboard API
BIZUIT_DASHBOARD_API_URL=https://test.bizuit.com/arielschBIZUITDashboardapi/api

# Security
JWT_SECRET_KEY=2332766b40b156b794e91a8aee048c0cc80ce786acf66e353988e6cc83309532
ENCRYPTION_TOKEN_KEY=Vq2ixrmV6oUGhQfIPWiCBk0S

# Admin Access
ADMIN_ALLOWED_ROLES=Administrators,BIZUIT Admins,SuperAdmin,FormManager

# API Configuration
API_PORT=8000
MAX_UPLOAD_SIZE_MB=50
TEMP_UPLOAD_PATH=./temp-uploads

# CORS
CORS_ORIGINS=https://test.bizuit.com,http://localhost:3001
```

---

## 🔧 Troubleshooting

### Form no carga en dev.html

**Error:** "Failed to resolve module specifier"

**Solución:**

```bash
# Verificar que el form está buildeado
ls -la dist/form.js

# Si no existe, buildear
npm run build

# Verificar HTTP server está corriendo
netstat -an | grep 8080
```

### Build falla con "Cannot resolve @tyconsa/..."

**Error:** `Could not resolve "@tyconsa/bizuit-form-sdk"`

**Causa:** Las dependencias `@tyconsa/*` deben estar marcadas como `external` en esbuild.

**Solución:** Ya está configurado en `build-form.js`. Si el error persiste:

```bash
# Verificar build-form.js
grep -A 5 "external:" ../build-form.js

# Debe incluir:
# external: [
#   '@tyconsa/bizuit-form-sdk',
#   '@tyconsa/bizuit-ui-components',
# ],
```

### Form se ve sin estilos

**Causa:** Tailwind CSS o theme no están cargados.

**Solución:** Verificar `dev.html` incluye:

```html
<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Theme styles -->
<style>
  :root {
    --primary: 24.6 95% 53.1%;
    /* ... más variables ... */
  }
</style>
```

### Artifact en GitHub no tiene la versión correcta

**Síntoma:** Artifact `recubiz-gestion-deployment-1.0.7-xxx` contiene ZIP con versión 1.0.6.

**Causa:** El workflow está subiendo ZIPs viejos del directorio `upload/`.

**Solución:** Ya está resuelto con staging. Si ocurre:

1. Verificar workflow usa `artifact-staging/` (no `.artifact-staging/`)
2. Verificar step "Stage new ZIPs for upload" ejecuta correctamente
3. Ver logs: https://github.com/arielsch74/bizuit-custom-form-sample/actions

### Deployment en entorno no refleja cambios

**Causa:** Cache del navegador o versión vieja en servidor.

**Solución:**

```bash
# 1. Hard refresh en navegador
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# 2. Verificar versión en servidor
curl https://test.bizuit.com/arielschBIZUITCustomForms/forms/recubiz-gestion/form.js | head -n 5

# 3. Verificar metadata en DB
# Conectarse a SQL Server y verificar tabla FormMetadata
```

### "Module not found" en runtime

**Error:** Runtime app no encuentra `/forms/recubiz-gestion/form.js`

**Causa:** El archivo no está en `/public/forms/`

**Solución:**

```bash
# Verificar estructura en runtime-app
ls -la custom-forms/runtime-app/public/forms/recubiz-gestion/

# Debe existir: form.js

# Si no existe, re-upload via admin panel
```

---

## 📚 Referencias

- **Repositorio:** https://github.com/arielsch74/bizuit-custom-form-sample
- **Workflow:** `.github/workflows/build-deployment-package.yml`
- **SDK Docs:** `@tyconsa/bizuit-form-sdk` README
- **UI Components:** `@tyconsa/bizuit-ui-components` README
- **Versioning:** `VERSIONING.md`

---

## 🎯 Checklist de Desarrollo

### Antes de Commitear

- [ ] Form buildea sin errores (`npm run build`)
- [ ] Testing en dev.html funciona
- [ ] No hay console.errors en DevTools
- [ ] Estilos se ven correctamente
- [ ] Form responde a diferentes tamaños de pantalla

### Antes de Pushear

- [ ] Commit tiene mensaje descriptivo (conventional commits)
- [ ] Form funciona en `dev` branch
- [ ] No hay conflictos con `main`

### Después del Deployment

- [ ] Artifact en GitHub tiene versión correcta
- [ ] ZIP contiene files correctos
- [ ] Upload a entorno exitoso
- [ ] Form carga en runtime app
- [ ] Testing con usuario real (si es posible)

---

**Última actualización:** 2025-11-23
**Versión:** 1.0.0
