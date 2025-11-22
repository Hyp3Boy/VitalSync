'use client'

import React, { useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { useSendMessage } from '@/hooks/useChat'

export default function ChatInput() {
  const [value, setValue] = useState('')
  const { send, isLoading } = useSendMessage()

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = value.trim()
    if (!text) return
    send(text)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full items-center gap-3 rounded-full bg-[#1b1b1b] px-5 py-3 text-white shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
    >
      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
        aria-label="Adjuntar archivo"
      >
        <Paperclip className="size-4" />
      </button>
      <input
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
        placeholder="Escribe tu mensaje aquí..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex size-11 items-center justify-center rounded-full bg-[#FFC400] text-[#5D4037] transition hover:bg-[#ffb300] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Enviar mensaje"
      >
        <Send className="size-4" />
      </button>
    </form>
  )
}
