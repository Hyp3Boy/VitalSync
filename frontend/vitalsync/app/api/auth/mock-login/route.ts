import { NextRequest, NextResponse } from 'next/server'
import { mockUsers } from '@/lib/mocks/user'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const identifier: string = body?.identifier ?? ''
  const password: string = body?.password ?? ''

  const user = mockUsers.find(
    (u) => (u.email === identifier || u.phone === identifier) && u.password === password
  )

  if (!user) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
  }

  return NextResponse.json(user)
}