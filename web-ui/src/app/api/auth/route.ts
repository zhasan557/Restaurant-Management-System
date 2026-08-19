import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'

export async function POST(request: Request) {
  const { action, username, password, role, email, phone } = await request.json()
  const users = readData('users.json')

  if (action === 'login') {
    if (role === 'Admin') {
      if (username === 'admin' && password === 'admin123') {
        return NextResponse.json({ success: true, user: { username: 'admin', role: 'Admin' } })
      }
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const user = users.find((u: any) => u.username === username && u.password === password && u.role === role)
    if (user) {
      return NextResponse.json({ success: true, user })
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (action === 'register') {
    if (role === 'Admin') {
      return NextResponse.json({ error: 'Cannot register additional admin users' }, { status: 403 })
    }

    if (users.find((u: any) => u.username === username)) {
      return NextResponse.json({ error: 'Username taken' }, { status: 400 })
    }
    const newUser = { username, password, role, email, phone }
    users.push(newUser)
    writeData('users.json', users)
    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
