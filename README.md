# Bizuit Custom Forms - Sample Repository

Repositorio de ejemplos para custom forms del sistema Bizuit BPM, con compilación automática y deployment offline via GitHub Actions.

## 📋 Descripción

Este repositorio demuestra cómo crear custom forms que:

1. **Se escriben** en TypeScript/React con total libertad
2. **Se compilan** automáticamente con esbuild (React como external)
3. **Se empaquetan** para deployment offline via GitHub Actions
4. **Se cargan dinámicamente** en runtime sin redeployment de IIS/Next.js

## 📚 Documentación

- **[Guía de Desarrollo](DEVELOPMENT.md)** - Desarrollo local, testing con dev.html, debugging
- **[Guía de Deployment](DEPLOYMENT_GUIDE.md)** - Setup de entornos, deployment a arielsch/recubiz, troubleshooting
- **[Versioning](VERSIONING.md)** - Sistema de versionado independiente por form
- **[Azure DevOps Setup](AZURE_DEVOPS_SETUP.md)** - Configuración de pipelines (deprecado, usar GitHub Actions)
- **[Changelog](CHANGELOG.md)** - Historial de cambios

## 🏗️ Estructura del Repositorio

```
bizuit-custom-form-sample/
├── .github/
│   └── workflows/
│       └── build-deployment-package.yml   # GitHub Actions workflow
│
├── aprobacion-gastos/                     # Example form
│   ├── src/
│   │   └── index.tsx                      # Form source code
│   ├── dist/
│   │   ├── form.js                        # Compiled IIFE bundle
│   │   ├── form.js.map                    # Source map
│   │   └── form.meta.json                 # Metadata
│   ├── package.json
│   └── tsconfig.json
│
├── build-form.js                          # Shared esbuild script
├── package.json                           # Root dependencies (esbuild)
└── README.md
```

## 🚀 Inicio Rápido

### 1. Clonar

```bash
git clone https://github.com/arielsch74/bizuit-custom-form-sample.git
cd bizuit-custom-form-sample
```

### 2. Instalar Dependencias

```bash
# esbuild (dependencia raíz)
npm install

# Dependencias del form de ejemplo
cd aprobacion-gastos
npm install
```

### 3. Compilar

```bash
npm run build
# Output: dist/form.js (3.8 KB aprox)
```

## 📝 Crear un Nuevo Form

### 1. Copiar Template

```bash
cp -r aprobacion-gastos mi-nuevo-form
cd mi-nuevo-form
```

### 2. Editar `package.json`

```json
{
  "name": "mi-nuevo-form",
  "version": "1.0.0",
  "description": "Descripción del form",
  "author": "Tu Nombre",
  "scripts": {
    "build": "node ../build-form.js"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### 3. Escribir el Form: `src/index.tsx`

```tsx
import { useState } from 'react';

export default function MiNuevoForm() {
  const [valor, setValor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', valor);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Nuevo Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Ingresa un valor"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
```

**Requisitos del Form:**
- ✅ Exportar componente React **por defecto**
- ✅ Usar `react` y `react-dom` libremente (son external)
- ✅ Cualquier feature de React (hooks, context, etc.)
- ❌ NO importar React globalmente (ya está en `window.React`)

### 4. Compilar

```bash
npm run build
```

Genera:
- **`dist/form.js`** - Bundle IIFE listo para carga dinámica
- **`dist/form.meta.json`** - Metadata (nombre, versión, tamaño, fecha)

## 📦 Deployment Offline

### Flujo Completo

```
1. Desarrollo → Editar forms en directorios individuales
2. Push → git push origin main
3. GitHub Actions → Compila todos los forms automáticamente
4. Descarga → Artifacts → bizuit-custom-forms-deployment-{version}.zip
5. Transferencia → USB/Red interna al servidor offline
6. Upload → Interfaz web: /admin/upload-forms
7. Runtime → Forms disponibles inmediatamente (hot reload)
```

### Trigger Manual del Workflow

Para crear un deployment con versión específica:

1. **Actions** → **Build Deployment Package (Offline)**
2. **Run workflow**
3. Ingresa versión (ej: `1.2.0`)
4. Descarga el artifact `.zip` (retención: 90 días)

### Estructura del Package `.zip`

```
bizuit-custom-forms-deployment-1.0.0.zip
├── manifest.json
└── forms/
    ├── aprobacion-gastos/
    │   └── form.js
    └── otro-form/
        └── form.js
```

**`manifest.json` contiene:**

```json
{
  "packageVersion": "1.0.202501121530",
  "buildDate": "2025-01-12T15:30:00.000Z",
  "commitHash": "a1b2c3d",
  "forms": [
    {
      "formName": "aprobacion-gastos",
      "processName": "AprobacionGastos",
      "version": "1.0.0",
      "author": "Bizuit Team",
      "description": "Form para aprobación de gastos",
      "sizeBytes": 3940,
      "path": "forms/aprobacion-gastos/form.js"
    }
  ]
}
```

## 🔧 Cómo Funciona

### Build Script: `build-form.js`

```javascript
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  format: 'iife',
  globalName: 'CustomForm',

  // React como external (runtime lo proporciona)
  external: ['react', 'react-dom'],

  // Inyectar referencias globales
  banner: {
    js: `
      const React = window.React;
      const ReactDOM = window.ReactDOM;
    `.trim(),
  },

  outfile: './dist/form.js',
  sourcemap: true,
  minify: false,
});
```

### ¿Por Qué React es External?

El runtime app (Next.js) expone React globalmente para **evitar múltiples instancias**:

```tsx
// runtime-app/components/ReactGlobalExposer.tsx
useEffect(() => {
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.__REACT_READY__ = true;
}, []);
```

Si cada form bundlea React → **Error: "Invalid hook call"**

### GitHub Actions Workflow

Ejecuta automáticamente cuando:
- Push a `main` con cambios en forms
- Trigger manual desde GitHub Actions UI

**Pasos del Workflow:**

1. ✅ Checkout código
2. ✅ Instalar dependencias (`npm install`)
3. ✅ Compilar TODOS los forms (busca directorios con `package.json`)
4. ✅ Generar `manifest.json` dinámicamente
5. ✅ Crear estructura `forms/{formName}/form.js`
6. ✅ Comprimir en `.zip`
7. ✅ Subir como artifact (retención: 90 días)
8. ✅ (Opcional) Crear GitHub Release

## 🗄️ Backend: FastAPI + SQL Server

### API Endpoint: `/api/deployment/upload`

Recibe el `.zip` y:

1. Extrae y valida `manifest.json`
2. Lee cada `form.js` compilado
3. Ejecuta `sp_UpsertCustomForm` en SQL Server
4. Retorna resultados por form (inserted/updated/failed)

### SQL Server

**Tablas:**

- **CustomForms**: Metadata (FormId, FormName, CurrentVersion, Status)
- **CustomFormVersions**: Historial (VersionId, FormId, Version, CompiledCode, IsCurrent)

**Stored Procedure:**

```sql
EXEC sp_UpsertCustomForm
  @FormName = 'aprobacion-gastos',
  @ProcessName = 'AprobacionGastos',
  @Version = '1.0.0',
  @Description = 'Form para aprobación de gastos',
  @Author = 'Bizuit Team',
  @CompiledCode = '/* código JS compilado */',
  @SizeBytes = 3940,
  @PackageVersion = '1.0.202501121530',
  @CommitHash = 'a1b2c3d',
  @BuildDate = '2025-01-12T15:30:00'
```

## 🔄 Hot Reload

El runtime hace polling cada **10 segundos** a `/api/custom-forms/versions`:

```typescript
const checkForUpdates = async () => {
  const res = await fetch('/api/custom-forms/versions');
  const versions = await res.json();

  if (versions[formName] !== currentVersion) {
    // Nueva versión → recargar
    const code = await fetch(`/api/custom-forms/${formName}/code`);
    loadDynamicForm(await code.text());
    setCurrentVersion(versions[formName]);
  }
};
```

**Ventaja**: Forms se actualizan SIN reiniciar IIS ni Next.js.

## 🛠️ Desarrollo Local

### Servir Forms Localmente

```bash
# Terminal 1: Runtime App
cd custom-forms/runtime-app
npm run dev  # Puerto 3001

# Terminal 2: Backend API
cd custom-forms/backend-api
python main.py  # Puerto 8000

# Acceder: http://localhost:3001/form/aprobacion-gastos
```

### Compilar en Watch Mode

```bash
cd aprobacion-gastos
npx nodemon --watch src --ext tsx,ts --exec "npm run build"
```

## 🧪 Testing

### Probar Upload Manual

1. Ejecuta workflow manualmente o descarga artifact de run anterior
2. Descarga el `.zip`
3. Accede a `http://localhost:3001/admin/upload-forms`
4. Arrastra el `.zip` y suelta
5. Verifica resultados en la UI

### Verificar en SQL Server

```sql
-- Forms activos
SELECT * FROM CustomForms WHERE Status = 'active';

-- Versiones de un form
SELECT * FROM CustomFormVersions
WHERE FormId = (SELECT FormId FROM CustomForms WHERE FormName = 'aprobacion-gastos')
ORDER BY PublishedAt DESC;

-- Código compilado actual
SELECT TOP 1 CompiledCode FROM CustomFormVersions
WHERE FormId = (SELECT FormId FROM CustomForms WHERE FormName = 'aprobacion-gastos')
  AND IsCurrent = 1;
```

## 🚨 Troubleshooting

### Error: "Invalid hook call"

**Causa**: Form bundlea React internamente

**Solución**: Verifica `build-form.js` tenga `external: ['react', 'react-dom']`

### Form no aparece en `/forms`

**Checklist**:
1. ✅ Form en SQL Server: `SELECT * FROM CustomForms`
2. ✅ CompiledCode no es NULL
3. ✅ IsCurrent = 1 en CustomFormVersions
4. ✅ API `/api/custom-forms/{formName}/code` devuelve código

### GitHub Action falla

**Errores comunes**:
- Form sin `package.json` o sin script `"build"`
- `npm install` falla (dependencias incorrectas)
- Error de TypeScript en `src/index.tsx`
- `dist/form.js` no se genera

**Revisar**: Logs del workflow en **Actions** → build step

### Upload `.zip` falla

**Checklist**:
1. ✅ `.zip` tiene `manifest.json` en raíz
2. ✅ Estructura correcta: `forms/{formName}/form.js`
3. ✅ Tamaño < 50 MB
4. ✅ Backend FastAPI corriendo (puerto 8000)
5. ✅ SQL Server accesible desde FastAPI

## 📚 Documentación Relacionada

En el proyecto principal (`BIZUITFormTemplate`):

- **[DYNAMIC_FORMS.md](../custom-forms/docs/DYNAMIC_FORMS.md)** - Arquitectura completa
- **[BACKEND_IMPLEMENTATION.md](../custom-forms/docs/BACKEND_IMPLEMENTATION.md)** - API y DB
- **[OFFLINE_DEPLOYMENT.md](../custom-forms/docs/OFFLINE_DEPLOYMENT.md)** - Guía offline
- **[IIS_DEPLOYMENT.md](../custom-forms/docs/IIS_DEPLOYMENT.md)** - IIS + reverse proxy

## 🤝 Contribuir

1. Fork el repositorio
2. Crea branch: `git checkout -b feature/mi-form`
3. Agrega form en directorio nuevo (estructura como `aprobacion-gastos/`)
4. Verifica que compile: `cd mi-form && npm run build`
5. Commit: `git commit -m "Add: mi-form custom form"`
6. Push: `git push origin feature/mi-form`
7. Abre Pull Request

## 📄 Licencia

ISC
