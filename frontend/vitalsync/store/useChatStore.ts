import { create } from 'zustand'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  createdAt: number
}

type ChatState = {
  messages: ChatMessage[]
  typing: boolean
  addMessage: (m: ChatMessage) => void
  clear: () => void
  setTyping: (v: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typing: false,
  addMessage: (m) =>
    set((s) => ({ messages: [...s.messages, m] })),
  clear: () => set({ messages: [] }),
  setTyping: (v) => set({ typing: v }),
}))

export default useChatStore
