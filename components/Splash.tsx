import React, {useEffect, useState} from 'react'

export default function Splash({onFinish}:{onFinish:()=>void}){
  const [fading,setFading] = useState(false)

  useEffect(()=>{
    // Show briefly, then fade slowly, then finish
    const startFade = setTimeout(()=> setFading(true), 1600)
    const endAll = setTimeout(()=> onFinish(), 1600 + 1600) // match CSS 1.6s fade
    return ()=>{ clearTimeout(startFade); clearTimeout(endAll) }
  },[onFinish])

  const basePath = process.env.NODE_ENV === 'production' ? '/BuildSphere' : ''
  
  return (
    <div className={`splash-root ${fading? 'splash-fade':''}`}>
      <div className="logo-wrap">
        <img src={`${basePath}/logo.svg`} className="logo" alt="BuildSphere" />
      </div>
      <div style={{marginTop:18,color:'#d2e6ee'}}>Design your space in 3D — simple, fast, beautiful</div>
    </div>
  )
}
