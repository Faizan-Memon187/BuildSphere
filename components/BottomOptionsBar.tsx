import React from 'react'

type Option = { key: string; label: string; icon: string }

type Props = {
  activeTool: 'none' | 'walls' | 'windows' | 'doors' | 'furniture' | 'roof'
  selectedKey?: string | null
  onChoose: (optionKey: string) => void
}

const optionsByTool: Record<Exclude<Props['activeTool'],'none'>, Option[]> = {
  walls: [
    {key:'wall-concrete',label:'Concrete Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23888" rx="2"/%3E%3Cpath d="M0 10h48M0 20h48M0 30h48M0 40h48" stroke="%23666" stroke-width="1"/%3E%3C/svg%3E'},
    {key:'wall-wood',label:'Wood Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23a0522d" rx="2"/%3E%3Cpath d="M5 0v48M15 0v48M25 0v48M35 0v48M45 0v48" stroke="%238B4513" stroke-width="2"/%3E%3C/svg%3E'},
    {key:'wall-steel',label:'Steel Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="steel" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0%25" stop-color="%23b0c4de"/%3E%3Cstop offset="100%25" stop-color="%23708090"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="48" height="48" fill="url(%23steel)" rx="2"/%3E%3C/svg%3E'},
    {key:'wall-brick',label:'Brick Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23a0410d"/%3E%3Cg stroke="%23222" stroke-width="1"%3E%3Crect x="1" y="1" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="14" y="1" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="27" y="1" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="40" y="1" width="7" height="8" fill="%23cd5c5c"/%3E%3Crect x="7" y="10" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="20" y="10" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="33" y="10" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="1" y="19" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="14" y="19" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="27" y="19" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="40" y="19" width="7" height="8" fill="%23cd5c5c"/%3E%3Crect x="7" y="28" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="20" y="28" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="33" y="28" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="1" y="37" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="14" y="37" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="27" y="37" width="12" height="8" fill="%23cd5c5c"/%3E%3Crect x="40" y="37" width="7" height="8" fill="%23cd5c5c"/%3E%3C/g%3E%3C/svg%3E'},
    {key:'wall-glass',label:'Glass Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="glass" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0%25" stop-color="%23e0f7ff" stop-opacity="0.8"/%3E%3Cstop offset="100%25" stop-color="%2387ceeb" stop-opacity="0.6"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="48" height="48" fill="url(%23glass)" rx="2"/%3E%3Cpath d="M8 8l32 32M40 8L8 40" stroke="%23fff" stroke-width="1" opacity="0.5"/%3E%3C/svg%3E'},
    {key:'wall-drywall',label:'Drywall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23f5f5dc" rx="2"/%3E%3Cpath d="M0 0h48v48H0z" fill="%23e8e8d0" opacity="0.3"/%3E%3C/svg%3E'},
    {key:'wall-stone',label:'Stone Wall',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23696969"/%3E%3Cg fill="%23808080" stroke="%23444" stroke-width="1"%3E%3Cellipse cx="10" cy="8" rx="8" ry="6"/%3E%3Cellipse cx="28" cy="10" rx="10" ry="7"/%3E%3Cellipse cx="38" cy="20" rx="7" ry="8"/%3E%3Cellipse cx="15" cy="25" rx="9" ry="7"/%3E%3Cellipse cx="32" cy="32" rx="8" ry="6"/%3E%3Cellipse cx="8" cy="38" rx="6" ry="7"/%3E%3Cellipse cx="25" cy="42" rx="7" ry="5"/%3E%3C/g%3E%3C/svg%3E'},
  ],
  windows: [
    {key:'window-casement',label:'Casement',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%238B4513" rx="2"/%3E%3Crect x="4" y="4" width="40" height="40" fill="%2387ceeb" opacity="0.6"/%3E%3Cpath d="M4 24h40M24 4v40" stroke="%238B4513" stroke-width="3"/%3E%3Ccircle cx="30" cy="24" r="2" fill="%23444"/%3E%3C/svg%3E'},
    {key:'window-sliding',label:'Sliding',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23696969" rx="2"/%3E%3Crect x="3" y="3" width="20" height="42" fill="%2387ceeb" opacity="0.6"/%3E%3Crect x="25" y="3" width="20" height="42" fill="%2387ceeb" opacity="0.6"/%3E%3Cpath d="M24 0v48" stroke="%23555" stroke-width="2"/%3E%3Cpath d="M3 24h20M25 24h20" stroke="%23696969" stroke-width="1"/%3E%3C/svg%3E'},
    {key:'window-fixed',label:'Fixed',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23555" rx="2"/%3E%3Crect x="6" y="6" width="36" height="36" fill="%2387ceeb" opacity="0.7"/%3E%3Cpath d="M6 24h36M24 6v36" stroke="%23555" stroke-width="2"/%3E%3C/svg%3E'},
  ],
  doors: [
    {key:'door-wood',label:'Wood Door',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%238B4513" rx="2"/%3E%3Cpath d="M5 0v48M10 0v48M15 0v48M20 0v48M25 0v48M30 0v48M35 0v48M40 0v48" stroke="%23654321" stroke-width="1"/%3E%3Crect x="8" y="10" width="32" height="14" fill="%23a0522d" stroke="%23654321" stroke-width="2"/%3E%3Crect x="8" y="28" width="32" height="14" fill="%23a0522d" stroke="%23654321" stroke-width="2"/%3E%3Ccircle cx="34" cy="24" r="2" fill="%23FFD700"/%3E%3C/svg%3E'},
    {key:'door-steel',label:'Steel Door',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="steeldoor" x1="0" y1="0" x2="1" y2="0"%3E%3Cstop offset="0%25" stop-color="%23708090"/%3E%3Cstop offset="50%25" stop-color="%23b0c4de"/%3E%3Cstop offset="100%25" stop-color="%23708090"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="48" height="48" fill="url(%23steeldoor)" rx="2"/%3E%3Cpath d="M0 10h48M0 20h48M0 30h48M0 38h48" stroke="%23556" stroke-width="2"/%3E%3Ccircle cx="38" cy="24" r="2.5" fill="%23333"/%3E%3C/svg%3E'},
    {key:'door-glass',label:'Glass Door',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="48" height="48" fill="%23444" rx="2"/%3E%3Crect x="4" y="4" width="40" height="40" fill="%2387ceeb" opacity="0.5"/%3E%3Cpath d="M4 16h40M4 32h40M16 4v40M32 4v40" stroke="%23555" stroke-width="2"/%3E%3Ccircle cx="38" cy="24" r="2" fill="%23888"/%3E%3C/svg%3E'},
  ],
  furniture: [
    {key:'furn-sofa',label:'Sofa',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="4" y="18" width="40" height="20" fill="%235d4e37" rx="3"/%3E%3Crect x="4" y="12" width="6" height="26" fill="%235d4e37" rx="2"/%3E%3Crect x="38" y="12" width="6" height="26" fill="%235d4e37" rx="2"/%3E%3Crect x="8" y="14" width="32" height="12" fill="%238B7355" rx="2"/%3E%3Crect x="6" y="38" width="4" height="6" fill="%23333" rx="1"/%3E%3Crect x="38" y="38" width="4" height="6" fill="%23333" rx="1"/%3E%3C/svg%3E'},
    {key:'furn-table',label:'Table',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="8" y="16" width="32" height="4" fill="%238B4513" rx="1"/%3E%3Crect x="10" y="20" width="2" height="24" fill="%23654321"/%3E%3Crect x="36" y="20" width="2" height="24" fill="%23654321"/%3E%3Crect x="10" y="44" width="2" height="2" fill="%23333"/%3E%3Crect x="36" y="44" width="2" height="2" fill="%23333"/%3E%3C/svg%3E'},
    {key:'furn-bed',label:'Bed',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="4" y="20" width="40" height="16" fill="%23cd853f" rx="2"/%3E%3Crect x="4" y="12" width="40" height="8" fill="%23daa520" rx="2"/%3E%3Crect x="6" y="36" width="3" height="8" fill="%23654321"/%3E%3Crect x="39" y="36" width="3" height="8" fill="%23654321"/%3E%3Ccircle cx="12" cy="16" r="4" fill="%23f0e68c"/%3E%3Ccircle cx="36" cy="16" r="4" fill="%23f0e68c"/%3E%3C/svg%3E'},
  ],
  roof: [
    {key:'roof-shingle',label:'Shingle Roof',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M24 4L4 20h40L24 4z" fill="%23654321"/%3E%3Cg stroke="%23543210" stroke-width="1"%3E%3Cpath d="M8 20h8l-2 4h-8zM16 20h8l-2 4h-8zM24 20h8l-2 4h-8zM32 20h8l-2 4h-8z"/%3E%3Cpath d="M10 24h8l-2 4h-8zM18 24h8l-2 4h-8zM26 24h8l-2 4h-8z"/%3E%3Cpath d="M12 28h8l-2 4h-8zM20 28h8l-2 4h-8zM28 28h8l-2 4h-8z"/%3E%3C/g%3E%3C/svg%3E'},
    {key:'roof-metal',label:'Metal Roof',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="metal" x1="0" y1="0" x2="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%23c0c0c0"/%3E%3Cstop offset="100%25" stop-color="%23888"/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d="M24 4L4 20h40L24 4z" fill="url(%23metal)"/%3E%3Cpath d="M12 12v16M20 8v20M28 8v20M36 12v16" stroke="%23666" stroke-width="2"/%3E%3C/svg%3E'},
    {key:'roof-tile',label:'Tile Roof',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M24 4L4 20h40L24 4z" fill="%23a0410d"/%3E%3Cg fill="%23cd5c5c"%3E%3Crect x="6" y="20" width="8" height="4" rx="1"/%3E%3Crect x="14" y="20" width="8" height="4" rx="1"/%3E%3Crect x="22" y="20" width="8" height="4" rx="1"/%3E%3Crect x="30" y="20" width="8" height="4" rx="1"/%3E%3Crect x="10" y="24" width="8" height="4" rx="1"/%3E%3Crect x="18" y="24" width="8" height="4" rx="1"/%3E%3Crect x="26" y="24" width="8" height="4" rx="1"/%3E%3Crect x="14" y="28" width="8" height="4" rx="1"/%3E%3Crect x="22" y="28" width="8" height="4" rx="1"/%3E%3C/g%3E%3C/svg%3E'},
    {key:'roof-flat',label:'Flat Roof',icon:'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="4" y="18" width="40" height="12" fill="%23696969" rx="1"/%3E%3Cpath d="M4 24h40" stroke="%23555" stroke-width="1"/%3E%3Crect x="8" y="30" width="2" height="14" fill="%23888"/%3E%3Crect x="38" y="30" width="2" height="14" fill="%23888"/%3E%3C/svg%3E'},
  ]
}

export default function BottomOptionsBar({activeTool,selectedKey,onChoose}:Props){
  if(activeTool==='none') return null
  const options = optionsByTool[activeTool]
  return (
    <div style={{position:'fixed',left:0,right:0,bottom:0,background:'linear-gradient(90deg, rgba(79,209,197,0.12), rgba(91,168,255,0.12))',borderTop:'1px solid rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',padding:'10px 16px',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',zIndex:1040}}>
      <strong style={{marginRight:8,textTransform:'capitalize',color:'white',fontSize:'16px'}}>{activeTool}</strong>
      {options.map(opt=> {
        const active = selectedKey===opt.key
        return (
          <button 
            key={opt.key} 
            className={`btn ${active? 'btn-accent':'btn-outline-light'}`} 
            onClick={()=>onChoose(opt.key)}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',padding:'10px 12px',minWidth:'100px'}}
          >
            <img src={opt.icon} alt={opt.label} style={{width:'48px',height:'48px',borderRadius:'4px'}} />
            <span style={{fontSize:'11px',textAlign:'center',lineHeight:'1.2'}}>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
