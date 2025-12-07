# 3D Upgrade Migration Guide

## Changes Made (Dec 6, 2025)

### Dependencies Added
- `three` - Core 3D rendering library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers (OrbitControls, Grid, Sky, etc.)

### Data Model Changes
**Before (2D):**
```typescript
Scene = {
  plot: { width, height, unit }
  items: [{
    x, y, w, h, angle?, height?
  }]
}
```

**After (3D):**
```typescript
Scene = {
  bounds: { width, height, depth, unit }
  items: [{
    position: { x, y, z }
    dimensions: { width, height, depth }
    rotation: { x, y, z }
  }]
}
```

### Component Changes
1. **Viewport3D.tsx** (new)
   - Full 3D canvas with Three.js
   - OrbitControls for camera (drag to rotate, scroll to zoom)
   - Dynamic lighting (ambient + directional + point)
   - Sky and ground grid
   - Items rendered as 3D boxes with color by kind

2. **Editor.tsx**
   - Removed 2D drawing logic (pointer handlers, pxToScene)
   - Items now added at scene center with default 3D dimensions
   - Viewport dynamically imported to avoid SSR issues

3. **PlotSetupModal.tsx**
   - Added `depth` field
   - Updated to create 3D bounds

4. **storage.ts**
   - Scene type upgraded to 3D coordinate system

### Interaction Changes
- **Before**: Click and drag on 2D canvas to draw items
- **After**: Click tool option to place item at center of scene; use OrbitControls to navigate 3D space

### What's Next
- Add TransformControls for moving/rotating/scaling items in 3D
- Implement raycasting for clicking items in 3D space
- Add texture/material options
- Ground plane collision/snapping
- Top-down and side view presets
- Import 3D models (GLTF/GLB)

### Known Limitations
- Existing 2D projects in localStorage won't load (incompatible schema)
- No item editing/deletion UI yet
- Items always placed at center (no click-to-place)
- No collision detection

### Testing
Server running at: http://localhost:3002
1. Create new project with 3D dimensions
2. Select tool and click option to place items
3. Use mouse to orbit camera, scroll to zoom
4. Test save/load/export/import with new 3D format
