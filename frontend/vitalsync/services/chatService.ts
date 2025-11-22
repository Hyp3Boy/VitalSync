import type { ChatMessage } from '@/store/useChatStore'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  await wait(200)
  return [
    {
      id: 'sys-1',
      role: 'system',
      text: 'Bienvenido al asistente de VitalSync. ¿En qué puedo ayudarte?',
      createdAt: Date.now() - 1000 * 60,
    },
  ]
}

export async function sendMessageToBackend(
  text: string
): Promise<ChatMessage> {
  // Simulate network / processing delay
  await wait(600 + Math.random() * 800)

  const reply = {
    id: `assistant-${Date.now()}`,
    role: 'assistant' as const,
    text: generateReply(text),
    createdAt: Date.now(),
  }

  return reply
}

function generateReply(userText: string) {
  // Very small deterministic mock reply logic to feel alive
  const lower = userText.toLowerCase()
  if (lower.includes('hola') || lower.includes('hi')) return '¡Hola! ¿Cómo puedo ayudarte hoy?'
  if (lower.includes('doctor')) return 'Puedo buscar médicos por especialidad o ubicación. ¿Cuál prefieres?'
  if (lower.includes('gracias')) return 'De nada — estoy aquí para ayudar.'
  return `He recibido tu mensaje: "${userText}". ¿Quieres que haga algo más con esto?`
}
