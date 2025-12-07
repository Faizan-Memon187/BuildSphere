# BuildSphere — Project Report

**Date:** 2025-12-07

## Introduction
BuildSphere is a browser-based 3D floor planner built with Next.js and React Three Fiber. It is designed for quick architectural ideation: place core elements (walls, windows, doors, furniture, roofs), apply materials, and adjust layout via intuitive move/rotate/resize tools. The UI favors clarity: a slim tools panel, rich SVG previews for materials, and context menus for precise actions. Roofs are automatically elevated to wall height to keep scenes realistic.

## What the app enables
- Draft simple floor layouts with walls, windows, doors, furniture, and roofs
- Manipulate items in-scene: move, rotate, and resize with width/length control
- Preview materials/types visually (concrete, wood, steel, glass, shingles, etc.)
- Manage projects: save/load named projects plus undo/redo history
- Keep interactions tidy: click a tool to show options; click again to hide

## Interaction model
- **Tool selection:** Pick a tool in the left panel; its options appear in the bottom bar.
- **Placement:** Click in the viewport to place; roofs auto-align to wall-top height.
- **Context menu:** Move / Rotate / Resize; resize opens a submenu to choose width or length.
- **Option toggling:** Clicking the same tool again hides its options bar for a clean workspace.

## Tech stack
- Next.js + TypeScript (SPA with server-side support)
- React Three Fiber / three.js (3D scene and interactions)
- React hooks for state (scene, selection, undo/redo, resize mode)

## Running the project (development)
1) `npm install`
2) `npm run dev`
3) Open http://localhost:3000

## Collaboration notes
- Repository: https://github.com/Faizan-Memon187/BuildSphere
- Branch: `main`
- License: MIT
- Add collaborators: GitHub → Settings → Collaborators

## Current testing status
Manual interaction testing: placement, move/rotate, resize submenu, options bar toggle.
