'use client'

import React from 'react'
import { ChatMessage as MsgType } from '@/store/useChatStore'
import { cn } from '@/lib/utils'

type Props = {
  message: MsgType
}

const roleStyles: Record<MsgType['role'], { label: string; wrapper: string; bubble: string }> = {
  user: {
    label: 'Tú',
    wrapper: 'items-end text-right',
    bubble:
      'ml-auto rounded-[24px] rounded-tr-none bg-[#1f1f1f] px-5 py-3 text-sm font-medium text-white shadow-lg',
  },
  assistant: {
    label: 'Asistente AI',
    wrapper: 'items-start text-left',
    bubble:
      'mr-auto rounded-[24px] rounded-bl-none bg-[#FFE082] px-5 py-3 text-sm text-[#5D4037] shadow-md',
  },
  system: {
    label: 'Sistema',
    wrapper: 'items-start text-left',
    bubble:
      'mr-auto rounded-[24px] rounded-bl-none border border-[#E0C097] bg-[#FDF8EB] px-5 py-3 text-sm text-[#5D4037] shadow-sm',
  },
}

export default function ChatMessage({ message }: Props) {
  const style = roleStyles[message.role] ?? roleStyles.assistant

  return (
    <div className={cn('flex flex-col gap-1 py-1', style.wrapper)}>
      <span className="text-xs font-semibold uppercase tracking-widest text-[#B08968]">
        {style.label}
      </span>
      <div className={style.bubble}>
        <p className="leading-relaxed">{message.text}</p>
        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-wide text-black/50">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
