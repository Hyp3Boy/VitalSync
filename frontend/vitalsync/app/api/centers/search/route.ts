import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(req: NextRequest) {
  const body = await req.json()
  const payload = body?.body ?? body
  const endpoint = `${BASE_URL}/centers/search`
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    return NextResponse.json(json)
  } catch (error) {
    return NextResponse.json({ code: 200, data: [] })
  }
}