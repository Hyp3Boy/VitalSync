import { SymptomConversationAnswer } from '@/types/symptom'
import { create } from 'zustand'

interface SymptomGuideState {
  currentStepIndex: number
  maxStepIndex: number
  selectedAreaId?: string
  selectedSymptomIds: string[]
  conversationAnswers: SymptomConversationAnswer[]
  conversationFeedback: Record<string, string>
  setMaxStepIndex: (value: number) => void
  setArea: (id: string) => void
  toggleSymptom: (id: string) => void
  saveConversationAnswer: (answer: SymptomConversationAnswer) => void
  setConversationFeedback: (blockId: string, message: string) => void
  goNext: () => void
  goBack: () => void
  reset: () => void
}

export const useSymptomGuideStore = create<SymptomGuideState>((set) => ({
  currentStepIndex: 0,
  maxStepIndex: 3,
  selectedAreaId: undefined,
  selectedSymptomIds: [],
  conversationAnswers: [],
  conversationFeedback: {},
  setMaxStepIndex: (value) => set({ maxStepIndex: value }),
  setArea: (id) => set({ selectedAreaId: id }),
  toggleSymptom: (id) =>
    set((state) => ({
      selectedSymptomIds: state.selectedSymptomIds.includes(id)
        ? state.selectedSymptomIds.filter((symptomId) => symptomId !== id)
        : [...state.selectedSymptomIds, id],
    })),
  saveConversationAnswer: (answer) =>
    set((state) => {
      const filtered = state.conversationAnswers.filter((item) => item.blockId !== answer.blockId)
      return { conversationAnswers: [...filtered, answer] }
    }),
  setConversationFeedback: (blockId, message) =>
    set((state) => ({
      conversationFeedback: {
        ...state.conversationFeedback,
        [blockId]: message,
      },
    })),
  goNext: () =>
    set((state) => ({ currentStepIndex: Math.min(state.currentStepIndex + 1, state.maxStepIndex) })),
  goBack: () =>
    set((state) => ({ currentStepIndex: Math.max(state.currentStepIndex - 1, 0) })),
  reset: () =>
    set((state) => ({
      currentStepIndex: 0,
      selectedAreaId: undefined,
      selectedSymptomIds: [],
      conversationAnswers: [],
      conversationFeedback: {},
      maxStepIndex: state.maxStepIndex,
    })),
}))
