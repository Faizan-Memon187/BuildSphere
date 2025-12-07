import React, {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import Splash from '../components/Splash'
import Auth from '../components/Auth'
import {useStore} from '../store/useStore'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

export default function Home(){
  const [showSplash,setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)
  const user = useStore(state=>state.user)
  const setUser = useStore(state=>state.setUser)

  useEffect(() => {
    setMounted(true)
    // Auto-login for demo purposes
    if (!user) {
      setUser({ id: 'demo_user', email: 'demo@buildsphere.com' })
    }
  }, [user, setUser])

  useEffect(()=>{
    // when splash finishes, fade out handled in CSS by adding class
  },[])

  if(showSplash){
    return <Splash onFinish={()=>setShowSplash(false)} />
  }

  // Skip auth screen - auto-login enabled
  // if(!user) return <Auth onLogin={(u)=>setUser(u)} />

  if(!mounted) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#c2d3de'}}>Loading...</div>

  return <Editor />
}
