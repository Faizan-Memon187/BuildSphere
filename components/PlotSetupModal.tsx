import React, { useState } from 'react'

type Props = {
  show: boolean
  onClose: () => void
  onConfirm: (config: { width: number; depth: number; floors: number; floorHeight: number; unit: 'm' }) => void
}

export default function PlotSetupModal({show,onClose,onConfirm}:Props){
  const [width,setWidth] = useState<string>('20')
  const [depth,setDepth] = useState<string>('20')
  const [floors,setFloors] = useState<number>(0)

  if(!show) return null
  return (
    <div className="modal d-block" tabIndex={-1} role="dialog" style={{background:'rgba(0,0,0,0.35)'}}>
      <div className="modal-dialog modal-md modal-dialog-centered" role="document">
        <div className="modal-content" style={{background:'#071821',border:'1px solid rgba(255,255,255,0.08)',color:'#fff'}}>
          <div className="modal-header" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            <h5 className="modal-title text-white">New Project • Building Dimensions</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 mb-3">
              <div className="col">
                <label className="form-label">Width (m)</label>
                <input type="number" min={1} className="form-control form-control-dark" value={width} onChange={e=>setWidth(e.target.value)} />
              </div>
              <div className="col">
                <label className="form-label">Depth (m)</label>
                <input type="number" min={1} className="form-control form-control-dark" value={depth} onChange={e=>setDepth(e.target.value)} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Floors</label>
              <select className="form-select form-control-dark" value={floors} onChange={e=>setFloors(Number(e.target.value))}>
                <option value={0}>Ground Floor Only</option>
                <option value={1}>Ground + 1st Floor</option>
                <option value={2}>Ground + 1st + 2nd Floor</option>
                <option value={3}>Ground + 1st + 2nd + 3rd Floor</option>
                <option value={4}>Ground + 4 Floors</option>
                <option value={5}>Ground + 5 Floors</option>
              </select>
            </div>
            <small className="note">Floor area: Width × Depth • Each floor: 3m height</small>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-accent" onClick={()=>onConfirm({width:Number(width)||20,depth:Number(depth)||20,floors,floorHeight:3,unit:'m'})}>Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}