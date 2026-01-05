# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bizuit Custom Form Sample** - Template repository for creating custom forms for Bizuit BPM with offline deployment.

Forms are written in TypeScript/React, compiled with esbuild marking React as external, and loaded dynamically at runtime without redeploying the host Next.js application.

---

## Build Commands

### Build Individual Form

**Two build modes available:**

```bash
cd form-template

# 1. Production bundle (slim - dependencies external)
npm run build
# Output: dist/form.js (minified, React/Bizuit packages external)
#         dist/form.js.map
#         dist/form.meta.json
# Uses: build-form.js
# For: Runtime app deployment

# 2. Development bundle (fat - all dependencies included)
npm run build:dev
# Output: dist/form.dev.js (unminified, all deps bundled)
#         dist/form.dev.js.map
# Uses: build-form-dev.js
# For: Local testing with dev.html

# 3. Build both
npm run build:all
```

**Key difference:**
- **`form.js`** (production): Dependencies are external, loaded from runtime app globals
- **`form.dev.js`** (development): Fat bundle with all dependencies included for standalone testing

---

## Levantar el Entorno de Desarrollo

### PASO A PASO CORRECTO

```bash
# 1. Compilar el fat bundle
cd form-template
npm run build:dev

# 2. Levantar servidor DESDE LA CARPETA DEL FORM con "." explicito
cd form-template
npx http-server . -p 8080 --cors

# 3. Abrir en browser
# http://localhost:8080/dev.html
```

### ERRORES COMUNES

```bash
# ERROR 1: Sin el "." - sirve ./public en vez de ./
npx http-server -p 8080 --cors
# Resultado: "serving ./public" - dev.html no existe ahi

# ERROR 2: Desde la raiz del repo
cd bizuit-custom-form-sample
npx http-server . -p 8080 --cors
# Resultado: paths relativos de dev.html no resuelven
```

### CORRECTO

```bash
# CORRECTO - desde la carpeta del form CON EL PUNTO
cd form-template
npx http-server . -p 8080 --cors
#                 ^ ESTE PUNTO ES CRITICO

# Debe mostrar: "Starting up http-server, serving ."
# URL: http://localhost:8080/dev.html
```

---

## Llamadas a Plugins API (Backend Host)

### URL Base
```
http://localhost:8000/api/plugins/{pluginName}/{endpoint}
```

### CRITICO: Rutas en DevHost vs Production

**DevHost (desarrollo local)** usa rutas SIMPLIFICADAS sin el prefijo `/plugins/{pluginName}`:
- DevHost: `/api/acciones`
- Production: `/api/plugins/mybackend/acciones`

**dev-credentials.js debe usar:**
```javascript
pluginApiUrl: 'http://localhost:8082/api',  // SIN /plugins/mybackend
```

**NUNCA agregar `/v1` ni `/plugins/mybackend`** a las rutas en desarrollo local.

### Autenticacion

**IMPORTANTE:** Los endpoints de plugins usan `Bearer` token, NO `Basic`.

El `authToken` que viene del SDK de Bizuit tiene formato `Basic {token}`. Para llamar a plugins API hay que convertirlo a `Bearer`:

```typescript
// authToken viene como "Basic ZMdufWTdCsS..."
const tokenValue = authToken.replace(/^Basic\s+/i, '');
const authHeader = `Bearer ${tokenValue}`;

const response = await fetch('http://localhost:8000/api/plugins/myplugin/endpoint', {
  method: 'GET',
  headers: {
    'Authorization': authHeader,  // "Bearer ZMdufWTdCsS..."
    'Content-Type': 'application/json'
  }
});
```

### ERROR COMUN
```typescript
// MAL - pone "Bearer Basic ..."
headers: { 'Authorization': `Bearer ${authToken}` }

// BIEN - extrae solo el token
headers: { 'Authorization': `Bearer ${authToken.replace(/^Basic\s+/i, '')}` }
```

---

## REGLAS CRITICAS

### REGLA #0: SIEMPRE USAR ICONOS PLANOS (FLAT)

**NUNCA** usar emojis 3D, con sombras, o realistas. **SIEMPRE** usar iconos planos/flat.

```tsx
// MAL - emoji 3D
<div>📡</div>

// BIEN - SVG plano
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
  <path d="M12 2v4M12 18v4..." />
</svg>
```

### REGLA #1: CUANDO ALGO NO FUNCIONA, CREAR COMPONENTE NUEVO

Cuando renderizas datos inline en un `.map()` y no funciona (muestra IDs en vez de valores, datos incorrectos, etc.), **NO sigas editando el codigo inline**.

**CREAR UN COMPONENTE NUEVO** que encapsule esa logica. Aunque el codigo sea IDENTICO, el componente nuevo fuerza a esbuild a regenerar el modulo completo.

```tsx
// NO FUNCIONABA (codigo inline en map):
contactos.map((c) => (
  <div>{c.nombre || 'Sin nombre'}</div>  // Mostraba ID en vez del nombre
))

// FUNCIONO (componente nuevo):
// ContactoCard.tsx - ARCHIVO NUEVO
export function ContactoCard({ contacto }) {
  return <p>{contacto.nombre || 'Sin nombre'}</p>;
}

// En el archivo original:
contactos.map((c) => <ContactoCard contacto={c} />)
```

### REGLA #2: NUNCA ASUMIR - SIEMPRE VERIFICAR EN CODIGO

**ANTES de responder cualquier pregunta tecnica sobre el codigo, SIEMPRE buscar y verificar en el codigo fuente.**

**PROHIBIDO:**
- "Probablemente funciona asi..."
- "Creo que este token..."
- "Normalmente los tokens se validan..."

**CORRECTO:**
```bash
# Usar Grep para encontrar implementacion
Grep: "ValidateDashboardToken"

# Leer archivo completo
Read: /path/to/file.cs
```

**Si tenes acceso al codigo fuente, NO HAY EXCUSA para asumir.**

---

## Build Architecture

### Two Build Scripts

**1. Production Build: `build-form.js`**
- **Purpose:** Production deployment to runtime app
- **Externals:** React, ReactDOM, Bizuit packages (loaded from `window.*`)
- **Output:** `dist/form.js` (minified)
- **Use case:** Upload to admin panel, loaded by runtime Next.js app

**2. Development Build: `build-form-dev.js`**
- **Purpose:** Local testing with `dev.html`
- **Externals:** Only React and ReactDOM (loaded from CDN in dev.html)
- **Bundles:** All Bizuit packages (@tyconsa/*) included as fat bundle
- **Output:** `dist/form.dev.js` (unminified)
- **Use case:** Standalone testing without runtime app

### esbuild Configuration

**Critical externals (production):**
```javascript
// These are provided by runtime app (window.*)
- react                              # window.React
- react-dom                          # window.ReactDOM
- react/jsx-runtime                  # Custom wrapper
- @tyconsa/bizuit-form-sdk          # window.BizuitFormSDK
- @tyconsa/bizuit-ui-components     # window.BizuitUIComponents
```

---

## CRITICO: jsx-runtime vs React.createElement

### EL PROBLEMA

Los `<option>` de un `<select>` muestran el `value` (IDs numericos) en vez del texto (`children`).

**Sintomas:**
- Console logs muestran datos correctos
- El codigo es correcto: `<option value={tipo.id}>{tipo.nombre}</option>`
- Pero el dropdown muestra: "75, 71, 88..." en vez de nombres

### ROOT CAUSE

Mapeo INCORRECTO de `jsx-runtime` a `React.createElement`:

```javascript
// INCORRECTO - Las firmas son INCOMPATIBLES:
module.exports = {
  jsx: window.React.createElement,    // WRONG!
  jsxs: window.React.createElement,   // WRONG!
}
```

**El problema de las firmas:**
```javascript
// jsx-runtime (nueva API):
jsx(type, { children: "texto", value: 1 }, key)
//                                         ^ KEY va como 3er argumento

// React.createElement (API clasica):
createElement(type, props, ...children)
//                         ^ 3er argumento es un CHILD, no key!
```

### LA SOLUCION

Funcion wrapper que traduce correctamente entre las dos APIs:

```javascript
// CORRECTO:
function createElementWithKey(type, props, key) {
  if (key !== undefined && props) {
    props = Object.assign({}, props, { key: key });
  }
  var children = props && props.children;
  delete props.children;
  if (Array.isArray(children)) {
    return window.React.createElement.apply(null, [type, props].concat(children));
  } else if (children !== undefined) {
    return window.React.createElement(type, props, children);
  }
  return window.React.createElement(type, props);
}
module.exports = {
  jsx: createElementWithKey,
  jsxs: createElementWithKey,
  Fragment: window.React.Fragment
};
```

### COMO DETECTAR ESTE PROBLEMA

1. El codigo fuente es correcto
2. Los console.log muestran datos correctos
3. Pero el rendering es incorrecto
4. **PISTA CLAVE:** El valor renderizado coincide con el `key` o `value` del elemento

---

## Form Structure

```
form-template/
├── src/
│   └── index.tsx           # Form source (must export default)
├── dist/                   # Build output (gitignored)
├── upload/                 # Deployment ZIPs (force tracked)
├── package.json            # Form version + dependencies
├── tsconfig.json
├── dev.html                # Local testing page
├── dev-credentials.js      # Local creds (gitignored)
└── dev-credentials.example.js  # Template
```

### Form Entry Point Requirements

**src/index.tsx must:**
- Export a React component as default: `export default function MyForm()`
- Accept `dashboardParams` prop with runtime context
- Use SDK for authentication and process calls
- Wrap UI in `<BizuitThemeProvider>` for consistent styling

```typescript
import { BizuitSDK } from '@tyconsa/bizuit-form-sdk';
import { BizuitThemeProvider, BizuitCard } from '@tyconsa/bizuit-ui-components';

interface FormProps {
  dashboardParams?: {
    token?: string;
    userName?: string;
    instanceId?: string;
    apiUrl?: string;
    devUsername?: string;  // Dev mode only
    devPassword?: string;  // Dev mode only
  };
}

export default function MyForm({ dashboardParams }: FormProps) {
  return (
    <BizuitThemeProvider>
      <BizuitCard>
        {/* Your UI */}
      </BizuitCard>
    </BizuitThemeProvider>
  );
}
```

---

## Dev Credentials Pattern

**Security:** Credentials are NEVER committed to the repository.

**Workflow:**
1. Copy template: `cp dev-credentials.example.js dev-credentials.js`
2. Edit with actual credentials
3. Use in `dev.html` for local testing
4. Form detects dev mode via `dashboardParams.devUsername`

**In production:** Form receives encrypted JWT token from Dashboard, not credentials.

---

## Common Issues

### dev.html Shows Blank Page or Module Errors

**Cause 1:** Used `npm run build` instead of `npm run build:dev`

**Fix:** Build the fat bundle for dev.html:
```bash
npm run build:dev  # NOT npm run build
```

**Cause 2:** Missing `dev-credentials.js`

**Fix:** Copy template and add credentials:
```bash
cp dev-credentials.example.js dev-credentials.js
```

### "Invalid hook call" Error

**Cause:** Form is bundling its own React instance.

**Fix:** Verify build scripts have proper external plugin configuration. React must come from `window.React`.

### Form no carga en runtime

**Checklist:**
1. Is `form.js` in `public/forms/{form-name}/` ?
2. Does manifest.json exist and have correct path?
3. Check browser console for module resolution errors

---

## Working with This Codebase

### Creating a New Form from Template

1. Copy the form-template directory: `cp -r form-template my-new-form`
2. Update `package.json` (name, version, description)
3. Implement `src/index.tsx`
4. Setup dev credentials:
   ```bash
   cd my-new-form
   cp dev-credentials.example.js dev-credentials.js
   # Edit with your credentials
   ```
5. Build and test locally:
   ```bash
   npm run build:dev
   npx http-server . -p 8080 --cors
   # Open: http://localhost:8080/dev.html
   ```
6. Commit and push - pipeline handles the rest

### Modifying Existing Form

1. Edit `src/index.tsx`
2. Test locally:
   ```bash
   npm run build:dev
   npx http-server . -p 8080 --cors
   ```
3. Commit with conventional message: `feat(form-template): add feature X`

---

## External Dependencies

**Runtime-provided (external):**
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `@tyconsa/bizuit-form-sdk` latest
- `@tyconsa/bizuit-ui-components` latest

**Build-time:**
- `esbuild` latest
- `typescript` ^5.0.0

Forms should **not bundle** runtime-provided packages - they're injected globally by the runtime app.

---

## CI/CD Pipeline

### Azure DevOps Pipeline

**File:** `azure-pipelines.yml`

**Process:**
1. **Detect changed forms** - Git diff analysis
2. **Auto-increment versions** - Per-form patch bump in `package.json`
3. **Build forms** - Run `npm run build` for each
4. **Create deployment ZIPs** - Individual ZIPs per form with manifest.json
5. **Commit back** - Update `package.json` and add ZIPs to `*/upload/`
6. **Publish artifacts** - Upload to Azure DevOps artifacts

### Deployment Package Structure

```
{form-name}-deployment-{version}-{hash}.zip
├── manifest.json           # Package metadata
└── forms/
    └── {form-name}/
        └── form.js         # Compiled bundle
```
