'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSymptomGuide, submitSymptomAnswers } from '@/services/symptomGuideService'
import { useSymptomGuideStore } from '@/store/useSymptomGuideStore'
import { toast } from 'sonner'

export const useSymptomGuide = () => {
  const queryClient = useQueryClient()
  const selectedAreaId = useSymptomGuideStore((state) => state.selectedAreaId)
  const selectedSymptomIds = useSymptomGuideStore((state) => state.selectedSymptomIds)
  const conversationAnswers = useSymptomGuideStore((state) => state.conversationAnswers)

  const query = useQuery({
    queryKey: ['symptom-guide'],
    queryFn: fetchSymptomGuide,
    staleTime: 1000 * 60 * 5,
  })

  const mutation = useMutation({
    mutationFn: () => submitSymptomAnswers({
      areaId: selectedAreaId ?? '',
      symptomIds: selectedSymptomIds,
      conversationAnswers,
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(['symptom-guide'], data)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos generar recomendaciones, intenta nuevamente.'
      )
    },
  })

  return { query, mutation }
}
