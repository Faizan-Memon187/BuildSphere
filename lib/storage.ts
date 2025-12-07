export type Scene = {
  bounds: { width: number; depth: number; unit: 'm' }
  floors: number // Number of floors (0=ground only, 1=ground+1st, etc.)
  floorHeight: number // Height per floor in meters
  items: Array<{
    id: string
    kind: 'wall'|'window'|'door'|'furniture'
    subtype: string
    floor: number // Which floor (0=ground, 1=first, etc.)
    position: { x: number; y: number; z: number }
    dimensions: { width: number; height: number; depth: number }
    rotation: { x: number; y: number; z: number }
  }>
}

export type Project = {
  id: string
  name: string
  updatedAt: number
  scene: Scene
}

const KEY = 'buildsphere_projects_v1'

export function loadProjects(): Project[]{
  try{
    const raw = localStorage.getItem(KEY)
    if(!raw) return []
    return JSON.parse(raw)
  }catch{ return [] }
}

export function saveProjects(projects: Project[]){
  localStorage.setItem(KEY, JSON.stringify(projects))
}

export function saveProject(p: Project){
  const all = loadProjects()
  const idx = all.findIndex(x=>x.id===p.id)
  if(idx>=0) all[idx]=p; else all.unshift(p)
  saveProjects(all)
}

export function deleteProjectById(id: string){
  const all = loadProjects().filter(p => p.id !== id)
  saveProjects(all)
}

export function exportProject(p: Project){
  const json = JSON.stringify(p, null, 2)
  const blob = new Blob([json], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${p.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAllProjects(){
  const all = loadProjects()
  const json = JSON.stringify(all, null, 2)
  const blob = new Blob([json], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'buildsphere_projects.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importProject(file: File, callback: (success: boolean, message: string) => void){
  const reader = new FileReader()
  reader.onload = (e) => {
    try{
      const content = e.target?.result as string
      const data = JSON.parse(content)
      // Check if it's a single project or array of projects
      if(Array.isArray(data)){
        // Import multiple projects
        const all = loadProjects()
        let imported = 0
        data.forEach((p: any) => {
          if(p.id && p.name && p.scene){
            // Overwrite by name; if not found by name, add new
            const byNameIdx = all.findIndex(x => x.name === p.name)
            if(byNameIdx >= 0){
              all[byNameIdx] = p
              imported++
            } else {
              all.unshift(p)
              imported++
            }
          }
        })
        saveProjects(all)
        callback(true, `Imported ${imported} project(s)`)
      } else if(data.id && data.name && data.scene){
        // Import single project: overwrite by name if exists, else add
        const all = loadProjects()
        const byNameIdx = all.findIndex(x => x.name === data.name)
        if(byNameIdx >= 0){
          all[byNameIdx] = data
          saveProjects(all)
          callback(true, 'Project overwritten')
        } else {
          all.unshift(data)
          saveProjects(all)
          callback(true, 'Project imported successfully')
        }
      } else {
        callback(false, 'Invalid project file format')
      }
    } catch(err){
      callback(false, 'Failed to parse project file')
    }
  }
  reader.onerror = () => callback(false, 'Failed to read file')
  reader.readAsText(file)
}
