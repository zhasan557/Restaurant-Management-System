'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cuisineCategories } from '@/lib/menu'

export default function AdminDashboard() {
  const router = useRouter()
  const [view, setView] = useState('menu')
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  
  const [newItem, setNewItem] = useState({ name: '', category: 'Bengali', price: '', image: '' })
  const [editingItem, setEditingItem] = useState<any>(null)

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
      setNewItem({ name: '', category: 'Bengali', price: '', image: '' })
    }
  }

  const handleDeleteMenu = async (id: number) => {
    const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
    if(res.ok) {
      setMenu(menu.filter((m: any) => m.id !== id))
    }
  }

  const handleUpdateMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/menu?id=${editingItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingItem.name,
        category: editingItem.category,
        price: parseFloat(editingItem.price),
        image: editingItem.image
      })
    })

    if (res.ok) {
      const updatedItem = await res.json()
      setMenu(menu.map((item: any) => item.id === updatedItem.id ? updatedItem : item) as any)
      setEditingItem(null)
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
                    {cuisineCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" className="input-field" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Picture URL</label>
                  <input type="url" className="input-field" placeholder="https://..." value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add Item</button>
              </form>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--primary-yellow)', marginBottom: '1.5rem' }}>Current Menu</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {menu.map((item: any) => (
                  <div key={item.id} className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                    <img src={item.image ? `/api/image?url=${encodeURIComponent(item.image)}` : 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '1rem 1.25rem' }}>
                      {editingItem?.id === item.id ? (
                        <form onSubmit={handleUpdateMenu}>
                          <div className="input-group">
                            <label>Item Name</label>
                            <input className="input-field" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} required />
                          </div>
                          <div className="input-group">
                            <label>Category</label>
                            <select className="input-field" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} style={{ appearance: 'none' }}>
                              {cuisineCategories.map((category) => <option key={category}>{category}</option>)}
                            </select>
                          </div>
                          <div className="input-group">
                            <label>Price ($)</label>
                            <input type="number" step="0.01" className="input-field" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} required />
                          </div>
                          <div className="input-group">
                            <label>Picture URL</label>
                            <input type="url" className="input-field" value={editingItem.image} onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} required />
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditingItem(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h4 style={{ margin: 0 }}>{item.name}</h4>
                          <p style={{ margin: '0.2rem 0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.category}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => setEditingItem({ ...item, price: String(item.price) })}>Edit</button>
                              <button className="btn" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => handleDeleteMenu(item.id)}>Delete</button>
                            </div>
                          </div>
                        </>
                      )}
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
