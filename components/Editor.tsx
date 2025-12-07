import React, {useEffect, useMemo, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
import ProjectModal from './ProjectModal'
import PlotSetupModal from './PlotSetupModal'
import BottomOptionsBar from './BottomOptionsBar'
import ItemContextMenu from './ItemContextMenu'
import ResizeMenu from './ResizeMenu'
import { loadProjects, saveProject, exportProject, exportAllProjects, importProject, deleteProjectById, type Project, type Scene } from '../lib/storage'

const Viewport3D = dynamic(() => import('./Viewport3D'), { ssr: false })

export default function Editor(){
  const [showProjects,setShowProjects] = useState(false)
  const [showPlotSetup,setShowPlotSetup] = useState(false)
  const [saved,setSaved] = useState<Project[]>([])
  const [activeTool,setActiveTool] = useState<'none'|'walls'|'windows'|'doors'|'furniture'|'roof'>('none')
  const [selectedSubtype,setSelectedSubtype] = useState<string | null>(null)
  const [currentToolIndex, setCurrentToolIndex] = useState(0)
  const [scene,setScene] = useState<Scene|null>(null)
  const [undoStack,setUndoStack] = useState<Scene[]>([])
  const [redoStack,setRedoStack] = useState<Scene[]>([])
  const [projectId,setProjectId] = useState<string>('')
  const [projectName,setProjectName] = useState<string>('')
  const [placingItem, setPlacingItem] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDimension, setResizeDimension] = useState<'width' | 'depth' | null>(null)
  const [resizeMenu, setResizeMenu] = useState<{itemId: string; x: number; y: number} | null>(null)
  const [contextMenu, setContextMenu] = useState<{itemId: string; x: number; y: number} | null>(null)

  const tools: Array<'walls'|'windows'|'doors'|'furniture'|'roof'> = ['walls','windows','doors','furniture','roof']

  useEffect(()=>{ setSaved(loadProjects()) },[])

  function handleCreate(){
    setShowProjects(false)
    setShowPlotSetup(true)
  }

  function confirmPlot(config:{width:number;depth:number;floors:number;floorHeight:number;unit:'m'}){
    const id = `p_${Date.now()}`
    const name = `Project ${saved.length+1}`
    const newScene: Scene = { 
      bounds: { width: config.width, depth: config.depth, unit: config.unit },
      floors: config.floors,
      floorHeight: config.floorHeight,
      items: [] 
    }
    if(scene) setUndoStack(prev=>[...prev, scene])
    setScene(newScene)
    setProjectId(id)
    setProjectName(name)
    setShowPlotSetup(false)
    setRedoStack([])
  }

  function chooseOption(key:string){
    setSelectedSubtype(key)
    setPlacingItem(true)
  }

  function placeItemAtPosition(position: { x: number; z: number }) {
    if(!scene || !selectedSubtype) return
    try {
      const { x, z } = position
      const kind = selectedSubtype.split('-')[0] as 'wall'|'window'|'door'|'furniture'|'roof'
      const subtype = selectedSubtype.split('-').slice(1).join('-')
      
      const defaultDims: Record<string, { width: number; height: number; depth: number }> = {
        wall: { width: 5, height: scene.floorHeight || 3, depth: 0.2 },
        window: { width: 1.5, height: 1.5, depth: 0.15 },
        door: { width: 1, height: 2.2, depth: 0.1 },
        furniture: { width: 1.5, height: 0.8, depth: 1 },
        roof: { width: 3, height: 0.2, depth: 3 }
      }
      
      const dims = defaultDims[kind] || defaultDims.furniture
      
      if (!dims || dims.width <= 0 || dims.height <= 0 || dims.depth <= 0) {
        console.error('Invalid dimensions:', dims)
        return
      }
      
      const item = {
        id: `it_${Date.now()}_${Math.random()}`,
        kind,
        subtype,
        floor: 0,
        position: { x, y: kind === 'roof' ? (scene.floorHeight || 3) + dims.height / 2 : dims.height / 2, z },
        dimensions: dims,
        rotation: { x: 0, y: 0, z: 0 }
      }
      
      setUndoStack(prev=>[...prev, scene])
      setScene({...scene, items:[...scene.items, item]})
      setRedoStack([])
      setPlacingItem(false)
    } catch (err) {
      console.error('Error placing item:', err)
    }
  }



  function handleSave(){
    if(!scene) return
    const name = prompt('Project name:', projectName || 'Untitled') || 'Untitled'
    // Versioning rule: on the second save with the same name, change id and prepend (Updated).
    // After that, keep the same id and name.
    let nextName = name
    let nextId = projectId || `p_${Date.now()}`
    if(projectId && name === projectName){
      // If the name does not yet include (Updated), this is the second save
      if(!/\(Updated\)\s/.test(projectName)){
        nextId = `p_${Date.now()}`
        nextName = `(Updated) ${name}`
      } else {
        // Subsequent saves keep id and name as-is
        nextId = projectId
        nextName = projectName
      }
    }
    const p: Project = { id: nextId, name: nextName, updatedAt: Date.now(), scene }
    saveProject(p)
    setSaved(loadProjects())
    setProjectId(p.id); setProjectName(p.name)
    alert('Project saved')
  }

  function loadProject(p:Project){
    if(scene) setUndoStack(prev=>[...prev, scene])
    setScene(p.scene); setProjectId(p.id); setProjectName(p.name)
    setRedoStack([])
    setShowProjects(false)
  }

  function handleUndo(){
    if(!scene || undoStack.length===0) return
    const prev = undoStack[undoStack.length-1]
    setUndoStack(undoStack.slice(0,-1))
    setRedoStack(r=>[...r, scene])
    setScene(prev)
  }

  function handleRedo(){
    if(redoStack.length===0 || !scene) return
    const next = redoStack[redoStack.length-1]
    setRedoStack(redoStack.slice(0,-1))
    setUndoStack(u=>[...u, scene])
    setScene(next)
  }

  function handleToolClick(tool: 'walls'|'windows'|'doors'|'furniture'|'roof'){
    const toggled = activeTool === tool ? 'none' : tool
    setActiveTool(toggled)
    setSelectedSubtype(null)
    setPlacingItem(false)
    const idx = tools.indexOf(tool)
    if(idx >= 0) setCurrentToolIndex(idx)
  }

  function handleExportProject(id: string){
    const p = saved.find(x => x.id === id)
    if(p) exportProject(p)
  }

  function handleExportAll(){
    exportAllProjects()
  }

  function handleItemClick(itemId: string, screenX: number, screenY: number) {
    setSelectedItemId(itemId)
    setContextMenu({ itemId, x: screenX, y: screenY })
  }

  function handleMoveItem(itemId: string) {
    if (scene) setUndoStack(prev => [...prev, scene])
    setSelectedItemId(itemId)
    setIsMoving(true)
    setContextMenu(null)
  }

  function moveItemTo(x: number, z: number) {
    if (!scene || !selectedItemId || !isMoving) {
      return
    }
    if (isNaN(x) || isNaN(z)) {
      return
    }
    setScene(current => {
      if (!current) return current
      const clampedX = Math.min(Math.max(x, 0), current.bounds.width)
      const clampedZ = Math.min(Math.max(z, 0), current.bounds.depth)
      const updatedItems = current.items.map(item =>
        item.id === selectedItemId
          ? { ...item, position: { x: clampedX, y: item.position.y, z: clampedZ } }
          : item
      )
      console.log('Scene updated, new position for item:', clampedX, clampedZ)
      return { ...current, items: updatedItems }
    })
    setRedoStack([])
  }

  function finishMoving() {
    setIsMoving(false)
  }

  function finishResizing() {
    setIsResizing(false)
    setResizeDimension(null)
  }

  function resizeItem(newWidth: number, newDepth: number) {
    if (!scene || !selectedItemId || !isResizing || !resizeDimension) return
    if (isNaN(newWidth) || isNaN(newDepth)) return
    
    setScene(current => {
      if (!current) return current
      const updatedItems = current.items.map(item => {
        if (item.id !== selectedItemId) return item
        
        let newDimensions = { ...item.dimensions }
        
        // Resize based on selected dimension
        if (resizeDimension === 'width') {
          const clampedWidth = Math.min(Math.max(newWidth, 0.5), scene.bounds.width)
          newDimensions.width = clampedWidth
        } else if (resizeDimension === 'depth') {
          const clampedDepth = Math.min(Math.max(newDepth, 0.5), scene.bounds.depth)
          newDimensions.depth = clampedDepth
        }
        
        return { ...item, dimensions: newDimensions }
      })
      return { ...current, items: updatedItems }
    })
  }

  function handleRotateItem(itemId: string) {
    if (!scene) return
    setUndoStack(prev=>[...prev, scene])
    const updatedItems = scene.items.map(item =>
      item.id === itemId
        ? { 
            ...item, 
            rotation: { 
              ...item.rotation, 
              y: (item.rotation.y + Math.PI / 2) % (Math.PI * 2) 
            } 
          }
        : item
    )
    setScene({ ...scene, items: updatedItems })
    setRedoStack([])
    setContextMenu(null)
    setSelectedItemId(null)
  }

  function handleResizeItem(itemId: string) {
    // Show resize dimension menu instead of directly activating resize
    const menu = contextMenu
    setContextMenu(null)
    if (menu) {
      setResizeMenu({itemId: menu.itemId, x: menu.x, y: menu.y})
    }
  }

  function startResizeWithDimension(itemId: string, dimension: 'width' | 'depth') {
    setSelectedItemId(itemId)
    setResizeDimension(dimension)
    setIsResizing(true)
    setResizeMenu(null)
  }

  function handleImportProject(file: File){
    // Read file name to attempt name conflict confirmation
    importProject(file, (success, message) => {
      // If a project with the same name exists, confirm overwrite before reflecting changes
      try{
        // Peek name from file contents for better UX
        const fr = new FileReader()
        fr.onload = (e) => {
          try{
            const parsed = JSON.parse(String(e.target?.result || '{}'))
            const existing = parsed && parsed.name ? loadProjects().find(x=>x.name===parsed.name) : undefined
            if(existing){
              const ok = window.confirm('The project you are trying to import already exists. Do you want to replace it?')
              if(!ok){
                alert('Import cancelled')
                return
              }
            }
            alert(message)
            if(success) setSaved(loadProjects())
          }catch{
            alert(message)
            if(success) setSaved(loadProjects())
          }
        }
        fr.readAsText(file)
      }catch{
        alert(message)
        if(success) setSaved(loadProjects())
      }
    })
  }

  function handleDeleteProject(id: string){
    const ok = window.confirm('Do you want to delete this project?')
    if(!ok) return
    deleteProjectById(id)
    setSaved(loadProjects())
    // If deleting the currently loaded project, clear current scene
    if(projectId === id){ setScene(null); setProjectId(''); setProjectName('') }
  }



  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h5>BuildSphere</h5>
        <div className="mt-3">
          <div className="mb-2"><strong>Tools</strong></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={()=>setCurrentToolIndex(prev=>Math.max(0,prev-1))}
                disabled={currentToolIndex===0}
                style={{padding:'16px 18px',fontSize:'22px',lineHeight:'1',minWidth:'56px',borderRadius:'8px'}}
              >
                ↑
              </button>
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={()=>setCurrentToolIndex(prev=>Math.min(4,prev+1))}
                disabled={currentToolIndex===4}
                style={{padding:'16px 18px',fontSize:'22px',lineHeight:'1',minWidth:'56px',borderRadius:'8px'}}
              >
                ↓
              </button>
            </div>
            <div style={{flex:1,overflow:'hidden',position:'relative',height:'420px'}}>
              <div style={{display:'flex',flexDirection:'column',transition:'transform 0.3s ease',transform:`translateY(-${currentToolIndex*84}px)`}}>
                <div style={{marginBottom:'6px'}}>
                  <button className="btn btn-outline-light w-100" onClick={()=>handleToolClick('walls')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px',borderRadius:'10px'}}><img src="data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='44' height='44' fill='%234fd1c5' rx='3'/%3E%3Cpath d='M0 8h44M0 16h44M0 24h44M0 32h44' stroke='%23fff' stroke-width='1' opacity='0.55'/%3E%3C/svg%3E" alt="Walls" style={{width:'44px',height:'44px'}} /><span style={{fontSize:'13px'}}>Walls</span></button>
                </div>
                <div style={{marginBottom:'6px'}}>
                  <button className="btn btn-outline-light w-100" onClick={()=>handleToolClick('windows')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px',borderRadius:'10px'}}><img src="data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='44' height='44' fill='%238B4513' rx='3'/%3E%3Crect x='4' y='4' width='36' height='36' fill='%2387ceeb' opacity='0.6'/%3E%3Cpath d='M4 22h36M22 4v36' stroke='%238B4513' stroke-width='3'/%3E%3C/svg%3E" alt="Windows" style={{width:'44px',height:'44px'}} /><span style={{fontSize:'13px'}}>Windows</span></button>
                </div>
                <div style={{marginBottom:'6px'}}>
                  <button className="btn btn-outline-light w-100" onClick={()=>handleToolClick('doors')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px',borderRadius:'10px'}}><img src="data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='44' height='44' fill='%238B4513' rx='3'/%3E%3Crect x='6' y='8' width='32' height='12' fill='%23a0522d' stroke='%23654321' stroke-width='2'/%3E%3Crect x='6' y='24' width='32' height='12' fill='%23a0522d' stroke='%23654321' stroke-width='2'/%3E%3Ccircle cx='32' cy='22' r='2.5' fill='%23FFD700'/%3E%3C/svg%3E" alt="Doors" style={{width:'44px',height:'44px'}} /><span style={{fontSize:'13px'}}>Doors</span></button>
                </div>
                <div style={{marginBottom:'6px'}}>
                  <button className="btn btn-outline-light w-100" onClick={()=>handleToolClick('furniture')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px',borderRadius:'10px'}}><img src="data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='3' y='16' width='38' height='18' fill='%235d4e37' rx='4'/%3E%3Crect x='3' y='10' width='6' height='24' fill='%235d4e37' rx='3'/%3E%3Crect x='35' y='10' width='6' height='24' fill='%235d4e37' rx='3'/%3E%3Crect x='8' y='12' width='28' height='11' fill='%238B7355' rx='3'/%3E%3C/svg%3E" alt="Furniture" style={{width:'44px',height:'44px'}} /><span style={{fontSize:'13px'}}>Furniture</span></button>
                </div>
                <div style={{marginBottom:'6px'}}>
                  <button className="btn btn-outline-light w-100" onClick={()=>handleToolClick('roof')} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px',borderRadius:'10px'}}><img src="data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 3L4 18h36L22 3z' fill='%23654321'/%3E%3Cg fill='%23cd5c5c'%3E%3Crect x='6' y='18' width='7' height='3' rx='1'/%3E%3Crect x='13' y='18' width='7' height='3' rx='1'/%3E%3Crect x='20' y='18' width='7' height='3' rx='1'/%3E%3Crect x='27' y='18' width='7' height='3' rx='1'/%3E%3Crect x='34' y='18' width='7' height='3' rx='1'/%3E%3C/g%3E%3C/svg%3E" alt="Roof" style={{width:'44px',height:'44px'}} /><span style={{fontSize:'13px'}}>Roof</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:18,left:18,right:18}}>
          <small style={{color:'white'}}>Logged in — Single-user mode</small>
        </div>
      </aside>
      <main className="main">
        <div className="toolbar">
          <button className="btn btn-outline-light" onClick={()=>setShowProjects(true)}>Projects</button>
          <button className="btn btn-outline-light" disabled={undoStack.length===0} onClick={handleUndo}>Undo</button>
          <button className="btn btn-outline-light" disabled={redoStack.length===0} onClick={handleRedo}>Redo</button>
          <button className="btn btn-accent" onClick={handleSave}>Save Project</button>
        </div>
        <div className="canvas-placeholder" style={{position:'relative',width:'100%',height:'100%'}}>
          <Viewport3D 
            scene={scene} 
            selectedItemId={selectedItemId}
            isMoving={isMoving}
            isResizing={isResizing}
            onResizeItem={resizeItem}
            onFinishResize={finishResizing}
            onItemClick={handleItemClick}
            onPlaceItem={placingItem ? placeItemAtPosition : undefined}
            onMoveItem={moveItemTo}
            onFinishMove={finishMoving}
          />
          <ItemContextMenu
            contextMenu={contextMenu}
            onMove={handleMoveItem}
            onRotate={handleRotateItem}
            onResize={handleResizeItem}
            onClose={() => setContextMenu(null)}
          />
          <ResizeMenu
            resizeMenu={resizeMenu}
            onResizeWidth={(itemId) => startResizeWithDimension(itemId, 'width')}
            onResizeLength={(itemId) => startResizeWithDimension(itemId, 'depth')}
            onClose={() => setResizeMenu(null)}
          />
          {placingItem && <div style={{position:'absolute',top:10,left:10,background:'rgba(0,0,0,0.7)',color:'#4fd1c5',padding:'10px 15px',borderRadius:'6px',fontSize:'14px',zIndex:100}}>Click on ground to place {selectedSubtype?.split('-').slice(1).join(' ')}</div>}
        </div>
      </main>
      <ProjectModal
        show={showProjects}
        onClose={()=>setShowProjects(false)}
        onCreate={handleCreate}
        projects={saved.map(p=>({id:p.id,name:p.name}))}
        onOpen={(id)=>{ const p = saved.find(x=>x.id===id); if(p) loadProject(p) }}
        onExport={handleExportProject}
        onExportAll={handleExportAll}
        onImport={handleImportProject}
        onDelete={handleDeleteProject}
      />
      <PlotSetupModal show={showPlotSetup} onClose={()=>setShowPlotSetup(false)} onConfirm={confirmPlot} />
      <BottomOptionsBar activeTool={activeTool} selectedKey={selectedSubtype} onChoose={chooseOption} />
    </div>
  )
}
