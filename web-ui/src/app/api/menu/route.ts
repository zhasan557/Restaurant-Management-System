import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'

export async function GET() {
  const menu = readData('menu.json')
  return NextResponse.json(menu)
}

export async function POST(request: Request) {
  const newItem = await request.json()
  const menu = readData('menu.json')
  
  // Assign a new ID
  const newId = menu.length > 0 ? Math.max(...menu.map((i: any) => i.id)) + 1 : 1
  newItem.id = newId
  
  menu.push(newItem)
  writeData('menu.json', menu)
  
  return NextResponse.json(newItem, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  let menu = readData('menu.json')
  menu = menu.filter((item: any) => item.id !== parseInt(id))
  writeData('menu.json', menu)
  
  return NextResponse.json({ success: true })
}
