'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChefDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState([])

  const fetchOrders = () => {
    fetch('/api/orders').then(res => res.json()).then(setOrders)
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchOrders()
  }

  const logout = () => {
    localStorage.removeItem('username')
    router.push('/')
  }

  return (
    <div className="page-layout">
      <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-gradient" style={{ margin: 0 }}>Epicurean - Kitchen</h2>
        <button className="btn btn-outline" style={{ borderColor: 'var(--primary-coral)', color: 'var(--primary-coral)' }} onClick={logout}>Logout</button>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem 1rem', flex: 1 }}>
        <h2 style={{ color: 'var(--primary-aqua)', marginBottom: '2rem' }}>Order Queue</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {orders.map((order: any, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{order.itemName} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>x{order.quantity}</span></h3>
                <span style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  backgroundColor: order.status === 'Processing' ? 'rgba(245, 158, 11, 0.2)' : order.status === 'Ready' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: order.status === 'Processing' ? 'var(--primary-yellow)' : order.status === 'Ready' ? 'var(--primary-aqua)' : 'var(--primary-green)'
                }}>
                  {order.status}
                </span>
              </div>
              
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Customer: <strong style={{ color: 'var(--text-main)' }}>{order.customerName}</strong><br/>
                Time: {new Date(order.orderTime).toLocaleTimeString()}
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: 'var(--primary-yellow)', color: 'var(--primary-yellow)' }} 
                  onClick={() => updateStatus(order.id, 'Processing')}
                  disabled={order.status === 'Processing'}
                >Processing</button>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: 'var(--primary-aqua)', color: 'var(--primary-aqua)' }} 
                  onClick={() => updateStatus(order.id, 'Ready')}
                  disabled={order.status === 'Ready'}
                >Ready</button>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem', borderColor: 'var(--primary-green)', color: 'var(--primary-green)' }} 
                  onClick={() => updateStatus(order.id, 'Delivered')}
                  disabled={order.status === 'Delivered'}
                >Delivered</button>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No orders in queue.</p>
          )}
        </div>
      </main>
    </div>
  )
}
