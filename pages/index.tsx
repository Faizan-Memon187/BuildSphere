import React, {useEffect, useState} from 'react'
import Splash from '../components/Splash'
import Auth from '../components/Auth'
import Editor from '../components/Editor'
import {useStore} from '../store/useStore'

export default function Home(){
  const [showSplash,setShowSplash] = useState(true)
  const setUser = useStore(state=>state.setUser)

  useEffect(() => {
    // Auto-login for demo purposes
    setUser({ id: 'demo_user', email: 'demo@buildsphere.com' })
  }, [setUser])

  if(showSplash){
    return <Splash onFinish={()=>setShowSplash(false)} />
  }

  return <Editor />
}
