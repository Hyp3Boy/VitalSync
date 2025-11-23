import { NextRequest } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const FALLBACK_TEXT = 'No pudimos obtener una respuesta a tiempo. Intenta reformular tu pregunta o verifica tu conexión.'

function chunk(text: string, size = 24) {
  const out: string[] = []
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size))
  return out
}

function toStream(text: string) {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      const parts = chunk(String(text))
      let i = 0
      const send = () => {
        if (i >= parts.length) {
          controller.close()
          return
        }
        controller.enqueue(encoder.encode(parts[i]))
        i += 1
        setTimeout(send, 30)
      }
      send()
    },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const last = messages.length ? messages[messages.length - 1] : null
  const message = body?.message ?? last?.content ?? ''
  const thread_id = body?.thread_id ?? body?.threadId

  const endpoint = `${BASE_URL}/agent/medicine/run`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, thread_id }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const stream = toStream(FALLBACK_TEXT)
      return new StreamingTextResponse(stream, { status: 200 })
    }

    const json = await res.json().catch(() => ({}))
    const turn = json ?? {}
    const text = turn?.message?.content ?? turn?.content ?? turn?.answer ?? turn?.text ?? ''
    const tid = turn?.thread_id ?? thread_id ?? ''
    const stream = toStream(text || FALLBACK_TEXT)
    return new Response(stream, { status: 200, headers: tid ? { 'x-thread-id': tid } : undefined })
  } catch (error) {
    const stream = toStream(FALLBACK_TEXT)
    return new Response(stream, { status: 200 })
  }
}