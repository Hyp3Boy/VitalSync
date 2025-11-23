'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: string
  onClick: (content: string) => void
  className?: string
}

export function TemplateCard({ 
  title, 
  description, 
  icon, 
  content, 
  onClick, 
  className 
}: TemplateCardProps) {
  return (
    <Card
      onClick={() => onClick(content)}
      className={cn(
        "p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-amber-200/30 hover:border-amber-300/50 bg-white/80 group",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-semibold text-amber-900 text-sm group-hover:text-amber-800">{title}</h5>
          <p className="text-xs text-amber-700 mt-1">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  )
}

interface QuickActionChipsProps {
  actions: Array<{
    id: string
    label: string
    icon: React.ReactNode
    content: string
    color: string
  }>
  onActionClick: (content: string) => void
}

export function QuickActionChips({ actions, onActionClick }: QuickActionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.content)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium text-sm transition-all hover:scale-105 hover:shadow-md",
            "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          )}
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}