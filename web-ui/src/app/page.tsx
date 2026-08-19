'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('Customer')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const action = isLogin ? 'login' : 'register'
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...formData, role })
    })
    
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('username', data.user.username)
      if (role === 'Admin') router.push('/admin')
      else if (role === 'Chef') router.push('/chef')
      else router.push('/customer')
    } else {
      const err = await res.json()
      alert(err.error || 'Authentication failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value)
    if (e.target.value === 'Admin') {
      setIsLogin(true)
    }
  }

  return (
    <main className="page-layout flex-center">
      <div className="container flex-center animate-fade-in" style={{ minHeight: '100vh' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Epicurean
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Restaurant Management System</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Role</label>
              <select 
                className="input-field" 
                value={role} 
                onChange={handleRoleChange}
                style={{ appearance: 'none' }}
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Chef">Chef / Kitchen Staff</option>
              </select>
            </div>

            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                className="input-field" 
                placeholder="Enter your username" 
                required 
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input-field" 
                    placeholder="Enter your email" 
                    required={!isLogin}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="input-field" 
                    placeholder="11 digit phone number" 
                    pattern="\d{11}"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                className="input-field" 
                placeholder="Enter your password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            {role !== 'Admin' && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--primary-aqua)', 
                    cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' 
                  }}
                >
                  {isLogin ? 'Register now' : 'Sign in'}
                </button>
              </>
            )}
            {role === 'Admin' && (
              <span style={{ color: 'var(--text-muted)' }}>
                Admin registration is restricted.
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
