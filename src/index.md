# Flux3D Engine “Spatial-Dynamic” (vFinal.Pro)

Repositorio generado con React + Vite + React Three Fiber, Zustand y exportación PDF client-side.

## Estructura del proyecto
```
.
├── Dockerfile
├── cloudbuild.yaml
├── index.html
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    └── app
        ├── assets
        │   └── assetPipeline.ts
        ├── components
        │   ├── AnchorPoints.tsx
        │   ├── CameraControls.tsx
        │   ├── Edge3D.tsx
        │   ├── LayerPanel.tsx
        │   ├── Node3D.tsx
        │   ├── Scene.tsx
        │   ├── Symbol2D.tsx
        │   └── Toolbar.tsx
        ├── export
        │   ├── exportPdf.ts
        │   └── viewportCapture.ts
        ├── persistence
        │   ├── flow3dMigrator.ts
        │   ├── flow3dSchema.ts
        │   └── flow3dSerializer.ts
        ├── store
        │   └── useFluxStore.ts
        └── types
            └── flow3d.ts
```

## Módulos

### 1) UI/3D
- Viewport con cámara órbita/zoom/pan (`CameraControls`).
- Drag XY y Shift+Drag Z en `Node3D`.
- Nodos 3D (bloque 3:1) + símbolos 2D.
- Flechas punto a punto con grosor dependiente del zoom.

**Criterios de aceptación**
- [ ] Drag XY por defecto y Z por Shift+Drag.
- [ ] Bloques 3:1, rotación vertical ↑/↓.
- [ ] 10,000 objetos visibles como objetivo de diseño.

### 2) Smart Connect
- Tool “Flecha” activa puntos de anclaje.
- 15 puntos por cara (rejilla 5x3) visibles solo al hover.
- Conexiones directas punto a punto.

**Criterios de aceptación**
- [ ] Puntos visibles solo con tool Flecha.
- [ ] 15 puntos por cara.
- [ ] Grosor de línea mantiene proporción con zoom.

### 3) Media
- Importación y persistencia Base64 (`assetPipeline`).
- Handlers preparados para acciones de click/context menu.

**Criterios de aceptación**
- [ ] Clicks por tipo de media (lightbox, ficha, reproducción).
- [ ] Menú contextual con descargar/eliminar/editar.

### 4) Persistencia .flow3d
- UUID inmutable por entidad.
- Versionado + migrador.
- Checksum SHA-256.

**Criterios de aceptación**
- [ ] Export/Import válido.
- [ ] Checksum consistente.
- [ ] Assets embebidos en Base64.

### 5) Export PDF Pro
- Página 1: captura High-DPI del canvas.
- Anexos cronológicos con fichas de objetos.
- YouTube con miniatura + QR.

**Criterios de aceptación**
- [ ] Portada con captura High-DPI.
- [ ] Anexos ordenados por fecha.
- [ ] YouTube incluye QR.

### 6) DevOps
- Dockerfile multistage (Vite build + nginx:alpine).
- cloudbuild.yaml con build, push y deploy Cloud Run.

**Criterios de aceptación**
- [ ] Build local de imagen.
- [ ] Deploy a Cloud Run exitoso.
- [ ] Respuesta 200 con assets estáticos.
