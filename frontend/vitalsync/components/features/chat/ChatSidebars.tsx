'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  User, 
  Bot,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Hospital
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
}

interface ChatSidebarProps {
  className?: string
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { icon: <User className="w-5 h-5" />, label: 'Perfil' },
    { icon: <Activity className="w-5 h-5" />, label: 'Triaje' },
    { icon: <Stethoscope className="w-5 h-5" />, label: 'Doctores' },
    { icon: <Pill className="w-5 h-5" />, label: 'Farmacia' },
    { icon: <Hospital className="w-5 h-5" />, label: 'Centros' },
  ]

  return (
    <div className={cn("w-20 bg-white/80 backdrop-blur-sm border-r border-amber-200/50 flex flex-col items-center py-6 space-y-4", className)}>
      {/* Logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
        <Heart className="w-6 h-6 text-white" />
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-3 flex-1">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-2xl hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-all hover:scale-105"
            title={item.label}
            onClick={item.onClick}
          >
            {item.icon}
          </Button>
        ))}
      </nav>

      {/* AI Assistant Button */}
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12 rounded-2xl hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-all hover:scale-105"
          title="Asistente AI"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

interface TemplateSidebarProps {
  templates: Array<{
    id: string
    category: string
    title: string
    description: string
    content: string
    icon: React.ReactNode
  }>
  onTemplateClick: (content: string) => void
  className?: string
}

export function TemplateSidebar({ templates, onTemplateClick, className }: TemplateSidebarProps) {
  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = []
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, typeof templates>)

  return (
    <div className={cn("w-80 bg-[var(--card)]/60 backdrop-blur-sm border-l border-[var(--border)] p-6", className)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Plantillas de Ayuda</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Haz clic para usar una plantilla</p>
        </div>

        {/* Group templates by category */}
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">{category}</h4>
            <div className="space-y-2">
              {categoryTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateClick(template.content)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--primary)] bg-[var(--card)]/80 hover:bg-[var(--card)] transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <div className="text-[var(--primary-foreground)]">
                        {template.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--primary)]">{template.title}</h5>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{template.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Tips */}
        <div className="p-4 bg-[var(--secondary)] rounded-2xl border-2 border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">💡 Consejos</h4>
          <ul className="text-xs text-[var(--muted-foreground)] space-y-1">
            <li>• Usa / para comandos rápidos</li>
            <li>• Completa los campos [entre corchetes]</li>
            <li>• Sé específico con ubicaciones</li>
            <li>• Incluye síntomas detallados</li>
          </ul>
        </div>
      </div>
    </div>
  )
}