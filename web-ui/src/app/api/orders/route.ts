import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'

export async function GET() {
  const orders = readData('orders.json')
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const newOrder = await request.json()
  const orders = readData('orders.json')
  
  const newId = orders.length > 0 ? Math.max(...orders.map((o: any) => o.id)) + 1 : 1
  newOrder.id = newId
  newOrder.orderTime = Date.now()
  newOrder.status = 'Processing'
  
  orders.push(newOrder)
  writeData('orders.json', orders)
  
  return NextResponse.json(newOrder, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json()
  const orders = readData('orders.json')
  
  const orderIndex = orders.findIndex((o: any) => o.id === id)
  if (orderIndex === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  orders[orderIndex].status = status
  writeData('orders.json', orders)
  
  return NextResponse.json(orders[orderIndex])
}
