# Bizuit Custom Forms - Sample Repository

Repositorio de ejemplos para custom forms del sistema Bizuit BPM, con compilación automática y deployment offline via GitHub Actions.

## 📋 Descripción

Este repositorio demuestra cómo crear custom forms que:

1. **Se escriben** en TypeScript/React con total libertad
2. **Se compilan** automáticamente con esbuild (React como external)
3. **Se empaquetan** para deployment offline via GitHub Actions
4. **Se cargan dinámicamente** en runtime sin redeployment de IIS/Next.js

---

## 📚 Documentación

Este repositorio contiene documentación completa para desarrollar, testear y deployar custom forms:

### 🎯 Para Empezar

- **[FORM_DEVELOPMENT_GUIDE.md](FORM_DEVELOPMENT_GUIDE.md)** - Guía completa para crear y desarrollar custom forms (basada en form-template)

### 📖 Guías Detalladas

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Desarrollo local, testing con dev.html y fat bundle, debugging
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Setup de entornos, deployment a producción, troubleshooting

### 📦 Otros Recursos

- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios del repositorio
- **[AZURE_DEVOPS_SETUP.md](AZURE_DEVOPS_SETUP.md)** - Configuración de pipelines Azure DevOps (deprecado - usar GitHub Actions)

---

## 🏗️ Estructura del Repositorio

```
bizuit-custom-form-sample/
├── .github/
│   └── workflows/
│       └── build-deployment-package.yml   # GitHub Actions workflow
│
├── form-template/                         # ⭐ Template base para nuevos forms
│   ├── src/
│   │   └── index.tsx                      # Form source code
│   ├── dist/                              # Build output (generated)
│   │   ├── form.js                        # Compiled bundle
│   │   └── dev.html                       # Test page
│   ├── upload/                            # Deployment ZIPs (generated)
│   └── package.json
│
├── example-form/                          # Example form
│   ├── src/
│   │   └── index.tsx
│   ├── dist/
│   ├── upload/
│   └── package.json
│
├── build-form.js                          # Shared esbuild script
├── package.json                           # Root dependencies (esbuild)
└── README.md                              # This file
```

---

## 🚀 Inicio Rápido

### 1. Clonar

```bash
git clone https://github.com/TYCON-SA/bizuit-custom-form-sample.git
cd bizuit-custom-form-sample
```

### 2. Instalar Dependencias

```bash
# esbuild (dependencia raíz)
npm install

# Dependencias del template
cd form-template
npm install
```

### 3. Configurar Credenciales de Desarrollo

⚠️ **IMPORTANTE:** Configura las credenciales ANTES de probar el form.

```bash
# Crear archivo de credenciales
cp ../runtime-app/dev-credentials.js.example ../runtime-app/dev-credentials.js

# Editar con tus credenciales de Bizuit
nano ../runtime-app/dev-credentials.js
```

Ver [DEVELOPMENT.md#setup-de-credenciales-de-desarrollo](DEVELOPMENT.md#setup-de-credenciales-de-desarrollo) para configuración detallada.

### 4. Testing Rápido con Fat Bundle

```bash
# Compilar fat bundle (incluye dev-credentials y dev.html)
npm run build:dev

# Servir localmente
cd dist
python3 -m http.server 8080

# Abrir en navegador
open http://localhost:8080/dev.html
```

**¿Qué es el fat bundle?** Es un bundle que incluye todas las dependencias (SDK + UI components) en un solo archivo, permitiendo testing completamente standalone sin CDNs ni backend. Perfecto para desarrollo UI.

**Nota:** `npm run build:dev` crea `form.dev.js` (fat bundle) y copia `dev-credentials.js` + `dev.html` a dist/. Para producción usa `npm run build` (crea `form.js` sin dependencias).

---

## 📝 Crear un Nuevo Form

### Opción 1: Copiar el Template

```bash
cp -r form-template mi-nuevo-form
cd mi-nuevo-form
```

Luego sigue la [guía de customización](form-template/README.md#-customization-guide) para adaptar el template a tu caso de uso.

### Opción 2: Copiar un Form Existente

```bash
cp -r example-form mi-nuevo-form
cd mi-nuevo-form
```

### Siguiente Paso: Editar el Form

1. **Actualizar `package.json`:**
   ```json
   {
     "name": "@tyconsa/bizuit-form-mi-nuevo-form",
     "version": "1.0.0",
     "description": "Descripción del form",
     "author": "TuNombre",  // ⚠️ Sin espacios
     "scripts": {
       "build": "node ../build-form.js"
     }
   }
   ```

2. **Escribir el Form: `src/index.tsx`**
   - Exportar componente React **por defecto**
   - Usar `react` y `react-dom` libremente (son external)
   - Ver [template README](form-template/README.md) para ejemplos

3. **Compilar:**
   ```bash
   npm run build
   ```

---

## 🧪 Testing

### Testing Local (Recomendado para UI)

```bash
cd mi-nuevo-form
npm run build:dev  # Crea fat bundle + copia dev-credentials + dev.html

# Servir fat bundle
cd dist
python3 -m http.server 8080

# Abrir en navegador
open http://localhost:8080/dev.html
```

### Testing en Runtime (Producción-like)

Para testing completo con SDK calls y database (credenciales ya configuradas en paso 3):

1. **Habilitar dev mode** en `runtime-app/.env.local`:
   ```env
   ALLOW_DEV_MODE=true
   ```

2. **Start runtime services:**
   ```bash
   cd ../../  # Volver al root del proyecto principal
   ./start-all.sh
   ```

3. **Upload form via admin:**
   ```
   http://localhost:3001/admin/upload-forms
   ```

4. **Test form:**
   ```
   http://localhost:3001/form/mi-nuevo-form
   ```

**Nota:** Los dev credentials y .env.local están en `runtime-app/`, NO en el directorio del form.

---

## 📦 Deployment & Versioning

### Versionado Automático

**IMPORTANTE:** El versionado es completamente automático - no necesitas especificar versiones manualmente.

**Cómo funciona:**

Cada push a `main` branch:
1. ✅ Detecta forms cambiados (src/ o package.json)
2. ✅ Lee versión actual de `package.json`
3. ✅ Incrementa PATCH automáticamente (e.g., `1.0.0` → `1.0.1`)
4. ✅ Actualiza `package.json` con nueva versión
5. ✅ Compila cada form con esbuild
6. ✅ Crea ZIP: `{form}-deployment-{version}-{hash}.zip`
7. ✅ Commitea ZIPs a `{form}/upload/`
8. ✅ Crea git tag: `{form}-v{version}`
9. ✅ Sube artifacts a GitHub Actions

**Nota:** Este sistema funciona idénticamente en GitHub Actions y Azure DevOps.

### Release Notes

Las release notes aparecen en el panel admin al ver el historial de versiones. Se extraen automáticamente del mensaje de commit.

**Método recomendado - Conventional Commits:**

```bash
git commit -m "feat: nueva funcionalidad de aprobación

- Agregado soporte para 3 niveles de aprobación
- Mejorada validación de campos obligatorios
- Corregido bug en cálculo de totales"
```

**Tipos de commit reconocidos:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `chore:` - Tareas de mantenimiento
- `docs:` - Documentación
- `refactor:` - Refactorización
- `perf:` - Mejoras de performance

**Formato simple:**

```bash
git commit -m "Mejoras en formulario de aprobación

- Agregado soporte para múltiples niveles
- Validación mejorada de campos
- Fix en cálculos"
```

### Manual Version Override (Avanzado)

Si necesitas cambiar MAJOR o MINOR versiones (para breaking changes), edita `package.json` manualmente:

```bash
# Editar version en package.json
nano form-template/package.json
# Cambiar: "version": "1.0.5" → "2.0.0"

git add form-template/package.json
git commit -m "chore: bump to v2.0.0 for breaking changes"
git push

# El próximo auto-increment será: 2.0.0 → 2.0.1
```

### Deployment Automático (GitHub Actions)

**Trigger:** Push a `main` branch

**Workflow:** `.github/workflows/build-deployment-package.yml`

**Descargar artifacts:**

1. Ir a: https://github.com/TYCON-SA/bizuit-custom-form-sample/actions
2. Click en el workflow run exitoso
3. Scroll down a "Artifacts"
4. Download ZIP del form deseado

**Upload a entorno:**

- **URL Admin Panel:** `https://{server}/{tenant}BIZUITCustomForms/admin/upload-forms`
- **Drag & drop** el ZIP descargado
- El form estará disponible inmediatamente

Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para setup completo de entornos.

### Configuración de package.json

**Estructura requerida:**

```json
{
  "name": "form-template",
  "version": "1.0.0",
  "description": "Descripción del formulario",
  "author": "NombreAutor",  // ⚠️ SIN ESPACIOS
  "scripts": {
    "build": "node ../build-form.js"
  }
}
```

**Reglas importantes:**

1. **`author` NO debe contener espacios**
   - ✅ `"author": "JohnDoe"` o `"author": "John_Doe"`
   - ❌ `"author": "John Doe"` (rechazado por backend)

2. **`version` es auto-gestionada**
   - NO edites manualmente (salvo para cambios MAJOR/MINOR)
   - El workflow actualiza automáticamente el PATCH
   - Formato: `MAJOR.MINOR.PATCH` (ej: `1.0.0`)

3. **`description` y `author` aparecen en admin panel**
   - Escribe descripciones claras y concisas
   - Se muestran en la lista de formularios

---

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
  external: ['react', 'react-dom', '@tyconsa/bizuit-form-sdk', '@tyconsa/bizuit-ui-components'],

  // Inyectar referencias globales
  banner: {
    js: `
      const React = window.React;
      const ReactDOM = window.ReactDOM;
      const BizuitSDK = window.BizuitSDK;
      const BizuitUIComponents = window.BizuitUIComponents;
    `.trim(),
  },

  outfile: './dist/form.js',
  sourcemap: true,
  minify: false,
});
```

### ¿Por Qué React es External?

El runtime app (Next.js) expone React globalmente para **evitar múltiples instancias**. Si cada form bundlea React → **Error: "Invalid hook call"**

### Estructura del Deployment Package ZIP

```
mi-form-deployment-1.0.5-abc1234.zip
├── manifest.json
├── VERSION.txt
└── forms/
    └── mi-form/
        └── form.js
```

**`manifest.json` contiene:**

```json
{
  "packageVersion": "1.0.202501231530",
  "buildDate": "2025-01-23T15:30:00.000Z",
  "commitHash": "abc1234",
  "forms": [
    {
      "formName": "mi-form",
      "version": "1.0.5",
      "author": "TuNombre",
      "description": "Descripción del form",
      "sizeBytes": 52000,
      "path": "forms/mi-form/form.js"
    }
  ]
}
```

---

## 🔄 Hot Reload

El runtime hace polling cada **10 segundos** a `/api/custom-forms/versions`. Si detecta una nueva versión, recarga el form automáticamente **SIN reiniciar** IIS ni Next.js.

---

## 🛠️ Troubleshooting

### Error: "Invalid hook call"

**Causa**: Form bundlea React internamente

**Solución**: Verifica `build-form.js` tenga `external: ['react', 'react-dom']`

### Form no aparece en runtime

**Checklist**:
1. ✅ Form compilado: `ls -la dist/form.js`
2. ✅ ZIP uploaded via admin panel
3. ✅ Form en database (ver admin panel → Forms)
4. ✅ Runtime app corriendo (`./start-all.sh`)

### GitHub Action falla

**Errores comunes**:
- Form sin `package.json` o sin script `"build"`
- `npm install` falla (dependencias incorrectas)
- Error de TypeScript en `src/index.tsx`
- `dist/form.js` no se genera

**Revisar**: Logs del workflow en **Actions** → build step

### "Invalid author format" en Upload

**Error**: `Invalid author format: Tycon S.A.`

**Solución**: El autor NO puede contener espacios. Usar:
- ✅ `"author": "Tyconsa"`
- ✅ `"author": "John-Doe"`
- ✅ `"author": "admin@bizuit"`
- ❌ `"author": "Tycon SA"` (tiene espacio)

---

## 📚 Documentación Relacionada

En el proyecto principal (`BIZUITCustomForms`):

- **[DYNAMIC_FORMS.md](../docs/DYNAMIC_FORMS.md)** - Arquitectura completa
- **[BACKEND_IMPLEMENTATION.md](../docs/BACKEND_IMPLEMENTATION.md)** - API y DB
- **[OFFLINE_DEPLOYMENT.md](../docs/OFFLINE_DEPLOYMENT.md)** - Guía offline
- **[IIS_DEPLOYMENT.md](../docs/IIS_DEPLOYMENT.md)** - IIS + reverse proxy

Documentación interactiva:
- **`http://localhost:3001/docs`** - Developer documentation web UI

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea branch: `git checkout -b feature/mi-form`
3. Agrega form en directorio nuevo (estructura como `form-template/`)
4. Verifica que compile: `cd mi-form && npm run build`
5. Commit: `git commit -m "feat: add mi-form custom form"`
6. Push: `git push origin feature/mi-form`
7. Abre Pull Request

---

## 📄 Licencia

ISC

---

**Tycon S.A.** - Custom Forms Development Team
