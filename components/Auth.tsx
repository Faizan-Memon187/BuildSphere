import React, {useState} from 'react'

export default function Auth({onLogin}:{onLogin:(user:{id:string;email:string})=>void}){
  const [tab,setTab] = useState<'login'|'signup'>('login')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [error,setError] = useState<string | null>(null)

  function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    setError(null)
    // Basic client-side validation (no DB connected in this scaffold)
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!email || !emailRx.test(email)){
      setError('Please enter a valid email address')
      return
    }
    if(!password || password.length < 6){
      setError('Password must be at least 6 characters')
      return
    }
    if(tab==='signup' && (!name || name.trim().length < 2)){
      setError('Please enter your full name')
      return
    }
    // Succeed locally (replace with Supabase auth later)
    const id = `user_${Date.now()}`
    onLogin({id,email})
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{height:'100vh'}}>
      <div style={{width:420}} className="p-4" aria-live="polite">
        <div className="card" style={{background:'#0c1418',border:'1px solid rgba(255,255,255,0.04)'}}>
          <div className="card-body">
            <h4 className="card-title gradient-text">BuildSphere</h4>
            <p className="text-muted">Welcomes you back — please sign in to continue</p>
            <ul className="nav nav-tabs">
              <li className="nav-item"><button className={`nav-link ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Login</button></li>
              <li className="nav-item"><button className={`nav-link ${tab==='signup'?'active':''}`} onClick={()=>setTab('signup')}>Sign up</button></li>
            </ul>
            <form onSubmit={handleSubmit} className="mt-3">
              {error && <div className="alert alert-danger py-1" role="alert">{error}</div>}
              {tab==='signup' && (
                <div className="mb-2">
                  <input className="form-control form-control-dark" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
                </div>
              )}
              <div className="mb-2">
                <input type="email" className="form-control form-control-dark" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control form-control-dark" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="note">By continuing you agree to the terms</small>
                <button className="btn btn-accent" type="submit">{tab==='login'?'Login':'Create account'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
