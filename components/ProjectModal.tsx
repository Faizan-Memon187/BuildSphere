import React, {useRef} from 'react'

type ProjectRef = { id: string; name: string }
type Props = {show:boolean;onClose:()=>void;onCreate:()=>void;projects:ProjectRef[]; onOpen?:(id:string)=>void; onExport?:(id:string)=>void; onExportAll?:()=>void; onImport?:(file:File)=>void; onDelete?:(id:string)=>void}

export default function ProjectModal({show,onClose,onCreate,projects,onOpen,onExport,onExportAll,onImport,onDelete}:Props){
  const fileInputRef = useRef<HTMLInputElement>(null)
  if(!show) return null
  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" style={{background:'rgba(0,0,0,0.35)'}}>
      <div className="modal-dialog modal-md modal-dialog-centered" role="document">
        <div className="modal-content" style={{background:'#071821',border:'1px solid rgba(255,255,255,0.08)',color:'#fff'}}>
          <div className="modal-header" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            <h5 className="modal-title text-white">Projects</h5>
            <button type="button" className="btn-close-custom" aria-label="Close projects modal" onClick={onClose}>X</button>
          </div>
          <div className="modal-body" style={{color:'#fff'}}>
            <p className="text-muted">Choose an option</p>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-light" onClick={()=>alert('Open previous projects (stub)')}>See previous projects</button>
              <button className="btn btn-accent" onClick={onCreate}>Create new project</button>
              <button className="btn btn-outline-light" onClick={()=>fileInputRef.current?.click()}>Import Project</button>
              <input ref={fileInputRef} type="file" accept=".json" style={{display:'none'}} onChange={(e)=>{if(e.target.files?.[0] && onImport) onImport(e.target.files[0]); e.target.value=''}} />
            </div>
            <hr style={{borderColor:'rgba(255,255,255,0.04)'}} />
            <h6>Recent</h6>
            {projects.length===0 ? (
              <div className="text-muted">No recent projects</div>
            ):(
              <ul className="list-group list-group-flush mt-2">
                {projects.map(p=> (
                  <li key={p.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center" style={{color:'#fff',borderColor:'rgba(255,255,255,0.08)'}}>
                    <span>{p.name}</span>
                    <div className="d-flex gap-2">
                      {onOpen && <button className="btn btn-outline-light btn-sm" onClick={()=>onOpen(p.id)}>Open</button>}
                      {onExport && <button className="btn btn-outline-light btn-sm" onClick={()=>onExport(p.id)}>Export</button>}
                      {onDelete && <button className="btn btn-outline-light btn-sm" onClick={()=>onDelete(p.id)}>Delete</button>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            {onExportAll && projects.length > 0 && <button className="btn btn-outline-light" onClick={onExportAll}>Export All</button>}
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
