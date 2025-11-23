import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { blockId, optionId, label, history, thread_id } = body
  const message = `Paso ${blockId}: ${label}`
  const endpoint = `${BASE_URL}/agent/medicine/resume`
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id, resume_value: { blockId, optionId, label, history } }),
    })
    const json = await res.json()
    return NextResponse.json({ blockId, message: json?.message ?? json?.content ?? 'Recibido' })
  } catch (error) {
    return NextResponse.json({ blockId, message: 'Muchas gracias. Continuemos.' })
  }
}
