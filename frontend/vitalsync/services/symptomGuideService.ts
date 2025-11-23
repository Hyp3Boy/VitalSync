import {
  SymptomConversationPayload,
  SymptomConversationResponse,
  SymptomGuideResponse,
  SymptomSubmissionPayload,
} from '@/types/symptom'

export const fetchSymptomGuide = async (): Promise<SymptomGuideResponse> => {
  const response = await fetch('/api/symptoms')
  if (!response.ok) {
    throw new Error('No se pudo cargar la guía de síntomas')
  }
  return (await response.json()) as SymptomGuideResponse
}

export const submitSymptomAnswers = async (
  payload: SymptomSubmissionPayload
): Promise<SymptomGuideResponse> => {
  const response = await fetch('/api/symptoms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('No se pudo enviar tus síntomas')
  }
  return (await response.json()) as SymptomGuideResponse
}

export const sendConversationMessage = async (
  payload: SymptomConversationPayload
): Promise<SymptomConversationResponse> => {
  const response = await fetch('/api/symptoms/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('La IA no pudo responder, intenta nuevamente.')
  }

  return (await response.json()) as SymptomConversationResponse
}
