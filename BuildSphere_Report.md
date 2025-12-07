# BuildSphere — Project Report

**Version:** 1.0.0  
**Date:** December 7, 2025  
**Author:** Faizan Memon  
**Repository:** https://github.com/Faizan-Memon187/BuildSphere  
**Live Demo:** https://faizan-memon187.github.io/BuildSphere/

---

## Project Overview

BuildSphere is a browser-based 3D floor planner that enables users to design multi-floor buildings with walls, windows, doors, furniture, and roofs. Built with Next.js, React Three Fiber, and TypeScript, it provides an intuitive interface for architectural visualization without requiring expensive software or powerful hardware.

**Target Users:**
- Students and teachers in architectural education
- Homeowners planning renovations
- Architects doing initial concept work
- Anyone interested in 3D design and spatial planning

## Key Features

### Building Elements
- **Walls:** 5 material types (Concrete, Brick, Wood, Glass, Steel)
- **Windows:** 3 styles (Standard, Bay, Skylight)
- **Doors:** 3 types (Single, Double, Sliding)
- **Furniture:** 4 categories (Table, Chair, Sofa, Bed)
- **Roofs:** 4 styles (Shingle, Metal, Tile, Flat) with auto-elevation to ceiling height

### Editing Tools
- **Move:** Click-and-drag repositioning with visual feedback
- **Rotate:** Rotate items with visual angle indicator
- **Resize:** Separate width and length adjustment via submenu
- **Context Menu:** Right-click on items for quick actions (Move, Rotate, Resize, Delete)

### Project Management
- **Save/Load:** Named projects with timestamp tracking
- **Import/Export:** Share projects via JSON files
- **Undo/Redo:** Full action history with keyboard shortcuts (Ctrl+Z/Y)
- **Multi-Floor Support:** Design buildings with multiple floors, custom floor height

### User Interface
- **Left Sidebar:** Tool selection with icon-based buttons
- **Bottom Options Bar:** Material/type selection with visual previews
- **3D Viewport:** Interactive 3D scene with OrbitControls (rotate, pan, zoom)
- **Plot Setup:** Configure plot dimensions and floor count when creating new projects

## Technical Stack

### Core Technologies
- **Next.js 14.2.0** - React framework with static export
- **React 18.2.0** - UI component library
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Three.js 0.181.2** - 3D graphics library
- **React Three Fiber 8.15.0** - React renderer for Three.js
- **Bootstrap 5.3.2** - CSS framework for styling

### Architecture
- **State Management:** React hooks (useState, useEffect) for component state
- **Data Persistence:** localStorage for project storage
- **3D Rendering:** WebGL via Three.js with React Three Fiber
- **Project Structure:** Component-based with separation of concerns (Editor, Viewport3D, Storage)

## Installation & Setup

### Prerequisites
- Node.js v18.0+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

```bash
# Clone repository
git clone https://github.com/Faizan-Memon187/BuildSphere.git
cd BuildSphere

# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build

# Export static site (for deployment)
npm run export
```

## Deployment

The project is deployed on **GitHub Pages** at: https://faizan-memon187.github.io/BuildSphere/

### Deployment Steps
1. Build static site: `NODE_ENV=production npm run export`
2. Commit and push: `git add docs && git commit -m "Deploy" && git push`
3. Enable GitHub Pages in repository Settings → Pages (Source: main branch, /docs folder)
4. Wait 1-3 minutes for deployment

## Project Structure

```
BuildSphere/
├── components/          # React components
│   ├── Editor.tsx      # Main editor with state management
│   ├── Viewport3D.tsx  # 3D scene renderer
│   ├── BottomOptionsBar.tsx  # Material selection
│   ├── ProjectModal.tsx      # Save/load projects
│   └── ...
├── lib/
│   └── storage.ts      # localStorage and import/export
├── pages/
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Main page
├── styles/
│   └── globals.css     # Styling
├── docs/               # Static site output (GitHub Pages)
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies
```

## Future Enhancements

- **Texture mapping** for realistic materials
- **Multi-select** and copy/paste functionality
- **Snap-to-grid** for precise alignment
- **3D model export** (.obj, .gltf formats)
- **2D floor plan export** (PDF/PNG)
- **Real-time collaboration** features
- **Cost estimation** based on materials

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit: `git commit -m "feat: your description"`
5. Push and create a Pull Request

## License

MIT License - see LICENSE file for details

## Contact

- **Repository:** https://github.com/Faizan-Memon187/BuildSphere
- **Live Demo:** https://faizan-memon187.github.io/BuildSphere/
- **Issues:** https://github.com/Faizan-Memon187/BuildSphere/issues

---

**Version:** 1.0.0 | **Status:** Production Ready
