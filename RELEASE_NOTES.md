# Release Notes Guide

Este documento explica cómo agregar notas de versión (release notes) a tus formularios personalizados.

## 📝 ¿Qué son las Release Notes?

Las release notes son descripciones de los cambios realizados en cada versión de un formulario. Aparecen en el panel de administración cuando visualizas el historial de versiones, ayudando a los administradores a entender qué cambió en cada actualización.

## ⚙️ Versionado Automático

**IMPORTANTE:** El versionado de formularios es **completamente automático**. No necesitas especificar versiones manualmente.

- Cada push a `main` incrementa automáticamente la versión PATCH (ej: 1.0.0 → 1.0.1)
- El sistema lee la versión anterior del `package.json` y la incrementa
- Aplica tanto para GitHub Actions como para Azure DevOps pipelines

**Ver detalles completos:** [VERSIONING.md](VERSIONING.md)

## 🚀 Métodos para Agregar Release Notes

### Método 1: Mensaje de Commit (Recomendado)

El método más simple es escribir un buen mensaje de commit. El workflow lo extraerá automáticamente como release notes.

#### Formato Conventional Commits (Recomendado)

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
- `test:` - Tests

#### Formato Simple

```bash
git commit -m "Mejoras en formulario de aprobación de gastos

- Agregado soporte para 3 niveles
- Validación mejorada
- Bug fix en totales"
```

### Método 2: Workflow Manual (GitHub Actions / Azure DevOps)

Si ejecutas el workflow manualmente, puedes especificar release notes en el campo correspondiente.

**GitHub Actions:**
1. Ve a **Actions** → **Build Deployment Package**
2. Haz clic en **Run workflow**
3. Completa el campo **Release notes** (opcional)

**Azure DevOps:**
1. Ve a **Pipelines** → **Run pipeline**
2. Completa el campo **Release notes** (opcional)

### Método 3: Por Defecto (Automático)

Si no se proporciona release notes (ni por commit ni por input manual), se usará:
```
Build automático - Pipeline #{número}
```

## 📋 Buenas Prácticas

### ✅ Recomendado

```
- Descripción clara y concisa
- Usar viñetas para listar cambios
- Mencionar breaking changes si aplica
- Incluir números de issue si corresponde
```

**Ejemplo completo:**
```
Versión 2.1.0 - Mejoras de seguridad y UX

Nuevas funcionalidades:
- Validación de archivos adjuntos (tamaño máx 10MB)
- Auto-guardado cada 30 segundos
- Modo dark para formularios

Correcciones:
- Fixed: Error al subir archivos grandes (#123)
- Fixed: Pérdida de datos en navegadores antiguos

Breaking Changes:
- Requiere @tyconsa/bizuit-form-sdk ^2.0.0
```

### ❌ Evitar

```
# Muy genérico
"Bug fixes and improvements"

# Sin contexto
"Updated code"

# Demasiado técnico
"Refactored handleSubmit() to use async/await pattern with Promise.all() for parallel validation"
```

## 🎯 Ejemplos por Tipo de Cambio

### Nueva Funcionalidad
```
feat: soporte para aprobación delegada

- Los aprobadores pueden delegar su aprobación a otros usuarios
- Agregado campo de comentarios obligatorio en delegaciones
- Notificación automática al usuario delegado
```

### Corrección de Bug
```
fix: cálculo incorrecto de impuestos

- Corregido redondeo de decimales en IVA
- Fixed: Error cuando monto es $0
- Mejorada precisión en cálculos
```

### Mejora de Performance
```
perf: optimización de carga de datos

- Reducido tiempo de carga inicial en 60%
- Implementado lazy loading para archivos adjuntos
- Cache de datos de usuario
```

## 📊 Visualización en el Panel Admin

Las release notes aparecen en el **Panel de Administración → Gestión de Formularios → Versiones**:

```
┌─────────────────────────────────────────────────┐
│ v1.2.0  [ACTUAL]                                │
│                                                  │
│ 📝 Cambios en esta versión:                     │
│ Nueva funcionalidad de aprobación multi-nivel   │
│ - Agregado soporte para 3 niveles               │
│ - Mejorada validación de campos                 │
│ - Corregido bug en cálculo de totales           │
│                                                  │
│ Publicado: 19 nov 2025    Tamaño: 11 KB        │
└─────────────────────────────────────────────────┘
```

## ⚙️ Configuración del package.json

El archivo `package.json` de cada formulario contiene metadata que se usa en el deployment. Aquí están las **reglas importantes**:

### Estructura Requerida

```json
{
  "name": "form-template",
  "version": "1.0.0",
  "description": "Descripción del formulario",
  "author": "NombreAutor",
  "scripts": {
    "build": "node ../build-form.js"
  }
}
```

### ⚠️ Restricciones Importantes

1. **`author` NO DEBE contener espacios**
   ```json
   ❌ "author": "John Doe"        // INCORRECTO
   ✅ "author": "JohnDoe"          // CORRECTO
   ✅ "author": "John_Doe"         // CORRECTO
   ✅ "author": "Bizuit Team"      // Aceptable (se convierte a BizuitTeam)
   ```

2. **`name` debe ser un identificador válido**
   - Solo letras minúsculas, números, guiones
   - Sin espacios
   - Ejemplo: `form-template`, `aprobacion-gastos`, `solicitud-vacaciones`

3. **`version` es auto-gestionada**
   - **NO edites manualmente** (salvo para cambios MAJOR/MINOR)
   - El workflow actualiza automáticamente el PATCH
   - Formato: `MAJOR.MINOR.PATCH` (ej: `1.0.0`)

4. **`description` y `author` aparecen en el panel admin**
   - Escribe descripciones claras y concisas
   - Se muestran en la lista de formularios

### Ejemplo Completo

```json
{
  "name": "aprobacion-gastos",
  "version": "1.2.5",
  "description": "Formulario de aprobación de gastos empresariales",
  "author": "BizuitTeam",
  "scripts": {
    "build": "node ../build-form.js",
    "build:dev": "node ../build-form.js --dev"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## 🔄 Workflow Completo

1. **Desarrollo**: Haces cambios en tu formulario
2. **Commit**: Usas conventional commits o mensaje descriptivo
3. **Push**: GitHub Actions/Azure DevOps se ejecuta automáticamente
4. **Auto-version**: El workflow incrementa la versión en `package.json`
5. **Build**: Se genera el deployment package con release notes
6. **Deploy**: Subes el ZIP al panel admin
7. **Historial**: Las release notes aparecen en el panel de versiones

## 📚 Recursos Adicionales

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [VERSIONING.md](VERSIONING.md) - Detalles completos del sistema de versionado
