'use client'

import { useMutation } from '@tanstack/react-query'
import { sendConversationMessage } from '@/services/symptomGuideService'
import { useSymptomGuideStore } from '@/store/useSymptomGuideStore'
import { toast } from 'sonner'

export const useSymptomConversation = () => {
  const setFeedback = useSymptomGuideStore((state) => state.setConversationFeedback)

  return useMutation({
    mutationFn: sendConversationMessage,
    onSuccess: ({ blockId, message }) => {
      setFeedback(blockId, message)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos registrar tu respuesta, inténtalo nuevamente.'
      )
    },
  })
}
