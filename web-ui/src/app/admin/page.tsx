'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [view, setView] = useState('menu')
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  
  const [newItem, setNewItem] = useState({ name: '', category: 'Bengali', price: '' })

  useEffect(() => {
    fetch('/api/menu').then(res => res.json()).then(setMenu)
    fetch('/api/orders').then(res => res.json()).then(setOrders)
  }, [])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) })
    })
    if(res.ok) {
      const item = await res.json()
      setMenu([...menu, item] as any)
      setNewItem({ name: '', category: 'Bengali', price: '' })
    }
  }

  const handleDeleteMenu = async (id: number) => {
    const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
    if(res.ok) {
      setMenu(menu.filter((m: any) => m.id !== id))
    }
  }

  const logout = () => {
    localStorage.removeItem('username')
    router.push('/')
  }

  return (
    <div className="page-layout">
      <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-gradient" style={{ margin: 0 }}>Epicurean - Admin Hub</h2>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${view === 'menu' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('menu')}>Manage Menu</button>
          <button className={`btn ${view === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('orders')}>All Orders</button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--primary-coral)', color: 'var(--primary-coral)' }} onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem 1rem', flex: 1 }}>
        {view === 'menu' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            <div className="glass-panel" style={{ alignSelf: 'start' }}>
              <h3 style={{ color: 'var(--primary-aqua)', marginBottom: '1.5rem' }}>Add New Item</h3>
              <form onSubmit={handleAddItem}>
                <div className="input-group">
                  <label>Item Name</label>
                  <input className="input-field" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select className="input-field" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} style={{ appearance: 'none' }}>
                    <option>Bengali</option>
                    <option>Pakistani</option>
                    <option>Turkish</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" className="input-field" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add Item</button>
              </form>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--primary-yellow)', marginBottom: '1.5rem' }}>Current Menu</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {menu.map((item: any) => (
                  <div key={item.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.category}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                      <button className="btn" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleDeleteMenu(item.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div>
            <h2 style={{ color: 'var(--primary-aqua)' }}>All System Orders</h2>
            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }} className="glass-panel">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Item</th>
                    <th style={{ padding: '1rem' }}>Qty</th>
                    <th style={{ padding: '1rem' }}>Total</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{order.id}</td>
                      <td style={{ padding: '1rem' }}>{order.customerName}</td>
                      <td style={{ padding: '1rem' }}>{order.itemName}</td>
                      <td style={{ padding: '1rem' }}>{order.quantity}</td>
                      <td style={{ padding: '1rem', color: 'var(--primary-green)' }}>${order.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem',
                          backgroundColor: order.status === 'Processing' ? 'rgba(245, 158, 11, 0.2)' : order.status === 'Ready' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: order.status === 'Processing' ? 'var(--primary-yellow)' : order.status === 'Ready' ? 'var(--primary-aqua)' : 'var(--primary-green)'
                        }}>{order.status}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.orderTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
