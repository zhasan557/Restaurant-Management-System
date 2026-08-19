'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomerDashboard() {
  const router = useRouter()
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([])
  const [view, setView] = useState('menu') // 'menu' or 'orders'
  const [username, setUsername] = useState('Guest')

  useEffect(() => {
    // In a real app we'd get this from a session/context
    setUsername(localStorage.getItem('username') || 'Customer1')
    
    fetch('/api/menu').then(res => res.json()).then(setMenu)
    fetch('/api/orders').then(res => res.json()).then(data => {
      // Filter orders for this customer
      const myOrders = data.filter((o: any) => o.customerName === (localStorage.getItem('username') || 'Customer1'))
      setOrders(myOrders)
    })
  }, [])

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.item.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
    } else {
      setCart([...cart, { item, quantity: 1 }])
    }
  }

  const placeOrder = async () => {
    if (cart.length === 0) return
    
    for (const cartItem of cart) {
      const orderData = {
        customerName: username,
        itemName: cartItem.item.name,
        quantity: cartItem.quantity,
        totalAmount: cartItem.item.price * cartItem.quantity
      }
      
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
    }
    
    setCart([])
    setView('orders')
    
    // Refresh orders
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(data.filter((o: any) => o.customerName === username))
  }

  const logout = () => {
    localStorage.removeItem('username')
    router.push('/')
  }

  return (
    <div className="page-layout">
      <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-gradient" style={{ margin: 0 }}>Epicurean</h2>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${view === 'menu' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('menu')}>Menu</button>
          <button className={`btn ${view === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('orders')}>My Orders</button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--primary-coral)', color: 'var(--primary-coral)' }} onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem 1rem', flex: 1 }}>
        {view === 'menu' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
            <div>
              <h2 style={{ color: 'var(--primary-aqua)' }}>Delicious Menu</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {menu.map((item: any) => (
                  <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h3>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--primary-green)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{item.category}</p>
                    <button className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }} onClick={() => addToCart(item)}>Add to Order</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel" style={{ alignSelf: 'start', position: 'sticky', top: '2rem' }}>
              <h3 style={{ color: 'var(--primary-yellow)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Current Order</h3>
              {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Your order is empty</p>
              ) : (
                <>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map((c, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{c.item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {c.quantity} x ${c.item.price}</div>
                        </div>
                        <div style={{ fontWeight: 600 }}>${(c.item.price * c.quantity).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary-green)' }}>${cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0).toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={placeOrder}>Place Order</button>
                </>
              )}
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div>
            <h2 style={{ color: 'var(--primary-aqua)' }}>Order History</h2>
            {orders.length === 0 ? (
              <p className="glass-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No past orders found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {orders.map((order: any, idx) => (
                  <div key={idx} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{order.itemName}</h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Qty: {order.quantity} | Total: <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.4rem 1rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem', 
                        fontWeight: 600,
                        backgroundColor: order.status === 'Processing' ? 'rgba(245, 158, 11, 0.2)' : order.status === 'Ready' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: order.status === 'Processing' ? 'var(--primary-yellow)' : order.status === 'Ready' ? 'var(--primary-aqua)' : 'var(--primary-green)'
                      }}>
                        {order.status}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {new Date(order.orderTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
