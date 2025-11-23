import { SymptomConversationPayload } from '@/types/symptom'
import { NextRequest, NextResponse } from 'next/server'

const dynamicMessages: Record<string, Record<string, string>> = {
  'pain-quality': {
    sharp: 'Anotado: el dolor punzante suele relacionarse con episodios migrañosos agudos.',
    pressure: 'Gracias. Un dolor como presión constante puede indicar tensión muscular o sinusitis.',
  },
  'other-symptoms': {
    nausea: 'Registraré las náuseas para priorizar causas como migraña o infecciones virales.',
    photophobia: 'La sensibilidad a la luz es típica en migrañas. Te ofreceré recomendaciones específicas.',
    none: 'Perfecto, sin síntomas adicionales enfocaremos la guía en el dolor de cabeza.',
  },
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as SymptomConversationPayload

  const defaultMessage = `Listo, registré "${payload.label}" para continuar con el análisis.`
  const message =
    dynamicMessages[payload.blockId]?.[payload.optionId] ?? defaultMessage

  console.log('AI conversation update', payload)

  return NextResponse.json({
    blockId: payload.blockId,
    message,
  })
}
