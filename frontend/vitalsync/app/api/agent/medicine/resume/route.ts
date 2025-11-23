import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(req: NextRequest) {
  const body = await req.json()
  const thread_id = body?.thread_id ?? body?.threadId
  const resume_value = body?.resume_value ?? body?.resumeValue

  const endpoint = `${BASE_URL}/agent/medicine/resume`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread_id, resume_value }),
  })

  const json = await res.json()
  return NextResponse.json(json)
}