"use client"

import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useChatStore, { ChatMessage } from '@/store/useChatStore'
import { fetchChatHistory, sendMessageToBackend } from '@/services/chatService'
import { toast } from 'sonner'

export function useChatHistory() {
  const setMessages = useChatStore((s) => s.addMessage)
  const clear = useChatStore((s) => s.clear)

  const q = useQuery({
    queryKey: ['chat', 'history'],
    queryFn: async () => {
      const h = await fetchChatHistory()
      return h
    },
    onSuccess(data) {
      clear()
      data.forEach(setMessages)
    },
    onError() {
      toast.error('No pudimos cargar tu historial. Intenta nuevamente más tarde.')
    },
  })

  return q
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  const addMessage = useChatStore((s) => s.addMessage)
  const setTyping = useChatStore((s) => s.setTyping)

  const m = useMutation({
    mutationFn: (text: string) => sendMessageToBackend(text),
    onMutate() {
      setTyping(true)
    },
    onSuccess(data: ChatMessage) {
      addMessage(data)
      setTyping(false)
      queryClient.invalidateQueries({ queryKey: ['chat', 'history'] })
    },
    onError() {
      setTyping(false)
      toast.error('Hubo un problema al enviar tu mensaje. Revisa tu conexión.')
    },
  })

  const send = useCallback((text: string) => {
    // add optimistic user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      createdAt: Date.now(),
    }

    addMessage(userMsg)
    m.mutate(text)
  }, [addMessage, m])

  return { ...m, send }
}
