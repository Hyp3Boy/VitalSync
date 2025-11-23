'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  LayoutDashboard,
  Settings,
  User,
  Heart,
  Pill,
  Stethoscope,
  Hospital,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Send,
  Search,
  Bot,
  Clock,
  Activity,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Template types
interface Template {
  id: string
  category: string
  title: string
  description: string
  content: string
  icon: React.ReactNode
}

// Quick action types
interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  content: string
  color: string
}

// Slash command types
interface SlashCommand {
  id: string
  command: string
  description: string
  content: string
}

const templates: Template[] = [
  {
    id: '1',
    category: 'Triaje y Ubicación',
    title: 'Urgencia Menor (Cat I-4)',
    description: 'Buscar centro de salud con atención de parto/internamiento',
    content: 'Busco un centro de salud con atención de parto/internamiento cerca de [Tu Distrito].',
    icon: <Activity className="w-4 h-4" />
  },
  {
    id: '2',
    category: 'Triaje y Ubicación',
    title: 'Consulta General',
    description: 'Encontrar posta médica para atención de síntomas',
    content: 'Necesito una posta médica cerca de [Ubicación] para atención de [Síntoma].',
    icon: <Stethoscope className="w-4 h-4" />
  },
  {
    id: '3',
    category: 'Farmacia',
    title: 'Buscar Stock',
    description: 'Encontrar medicamentos específicos en tu área',
    content: 'Quiero saber dónde encontrar [Medicamento] de [Dosis] en [Distrito].',
    icon: <Pill className="w-4 h-4" />
  },
  {
    id: '4',
    category: 'Farmacia',
    title: 'Genéricos',
    description: 'Encontrar equivalentes genéricos y precios',
    content: '¿Cuál es el equivalente genérico de [Marca] y precio?',
    icon: <Search className="w-4 h-4" />
  },
  {
    id: '5',
    category: 'Doctores',
    title: 'Por Especialidad',
    description: 'Buscar especialistas por horario disponible',
    content: 'Busco un [Especialista] que atienda los [Día].',
    icon: <Users className="w-4 h-4" />
  }
]

const quickActions: QuickAction[] = [
  {
    id: 'emergency',
    label: '🚑 Emergencia',
    icon: <Activity className="w-4 h-4" />,
    content: 'Necesito atención de emergencia médica cerca de [mi ubicación]',
    color: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200'
  },
  {
    id: 'drug-search',
    label: '💊 Buscar Fármaco',
    icon: <Pill className="w-4 h-4" />,
    content: 'Busco [medicamento] en [ubicación]',
    color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200'
  },
  {
    id: 'doctor-search',
    label: '👨‍⚕️ Buscar Doctor',
    icon: <Stethoscope className="w-4 h-4" />,
    content: 'Busco un [especialista] en [ubicación]',
    color: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-200'
  },
  {
    id: 'centers',
    label: '🏥 Ver Centros',
    icon: <Hospital className="w-4 h-4" />,
    content: 'Mostrar centros de salud cerca de [ubicación]',
    color: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200'
  }
]

const slashCommands: SlashCommand[] = [
  {
    id: 'emergency',
    command: '/emergency',
    description: 'Buscar atención de emergencia',
    content: 'Necesito atención de emergencia médica urgente'
  },
  {
    id: 'doctor',
    command: '/doctor',
    description: 'Buscar médico especialista',
    content: 'Busco un médico especialista en'
  },
  {
    id: 'medicine',
    command: '/medicine',
    description: 'Buscar información de medicamentos',
    content: 'Busco información sobre el medicamento'
  },
  {
    id: 'location',
    command: '/location',
    description: 'Buscar centros de salud cercanos',
    content: 'Busco centros de salud cerca de'
  }
]

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat()
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [filteredCommands, setFilteredCommands] = useState(slashCommands)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle slash commands
  useEffect(() => {
    const updateSlashCommands = () => {
      if (input.startsWith('/')) {
        const command = input.slice(1)
        const filtered = slashCommands.filter(cmd => 
          cmd.command.slice(1).toLowerCase().includes(command.toLowerCase())
        )
        setFilteredCommands(filtered)
        setShowSlashCommands(filtered.length > 0)
        setSelectedCommandIndex(0)
      } else {
        setShowSlashCommands(false)
      }
    }

    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(updateSlashCommands)
  }, [input])

  const handleTemplateClick = (template: Template) => {
    setInput(template.content)
    inputRef.current?.focus()
  }

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.content)
    inputRef.current?.focus()
  }

  const handleSlashCommandSelect = (command: SlashCommand) => {
    setInput(command.content)
    setShowSlashCommands(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSlashCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedCommandIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedCommandIndex(prev => prev > 0 ? prev - 1 : 0)
      } else if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault()
        handleSlashCommandSelect(filteredCommands[selectedCommandIndex])
      } else if (e.key === 'Escape') {
        setShowSlashCommands(false)
      }
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-red-50/10">
      {/* Left Sidebar - Navigation */}
      <div className="w-20 bg-white/80 backdrop-blur-sm border-r border-amber-200/50 flex flex-col items-center py-6 space-y-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-8">
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex flex-col space-y-3">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-amber-100">
            <LayoutDashboard className="w-5 h-5 text-amber-700" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-amber-100">
            <User className="w-5 h-5 text-amber-700" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-amber-100">
            <Settings className="w-5 h-5 text-amber-700" />
          </Button>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-amber-100">
            <Bot className="w-5 h-5 text-amber-700" />
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-amber-200/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Asistente Médico AI</h1>
              <p className="text-sm text-amber-700">Tu copiloto clínico personal</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                <Clock className="w-3 h-3 mr-1" />
                En línea
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-2xl rounded-3xl px-6 py-4 shadow-lg",
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-xl' 
                    : 'bg-white border border-amber-200/50 rounded-bl-xl'
                )}>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Feedback buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-600 hover:text-amber-700">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-600 hover:text-amber-700">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-600 hover:text-amber-700">
                        <RotateCcw className="w-3 h-3" />
                        <span className="ml-1 text-xs">Regenerar</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-2xl rounded-3xl rounded-bl-xl bg-white border border-amber-200/50 px-6 py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-8 py-4 bg-white/40 backdrop-blur-sm border-t border-amber-200/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "rounded-full border-2 font-medium transition-all hover:scale-105",
                    action.color
                  )}
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="relative">
              <form onSubmit={onSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje o usa / para comandos..."
                    className="w-full rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-amber-200/50 px-6 py-4 text-amber-900 placeholder-amber-600 focus:border-amber-400 focus:ring-amber-400"
                  />
                  
                  {/* Slash Commands Menu */}
                  <AnimatePresence>
                    {showSlashCommands && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden"
                      >
                        {filteredCommands.map((command, index) => (
                          <button
                            key={command.id}
                            onClick={() => handleSlashCommandSelect(command)}
                            className={cn(
                              "w-full px-4 py-3 text-left flex items-center gap-3 transition-colors",
                              index === selectedCommandIndex ? 'bg-amber-100' : 'hover:bg-amber-50'
                            )}
                          >
                            <span className="font-mono text-amber-600">{command.command}</span>
                            <span className="text-amber-700">{command.description}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Templates */}
      <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-amber-200/50 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-amber-900 mb-4">Plantillas de Ayuda</h3>
            <p className="text-sm text-amber-700">Haz clic para usar una plantilla</p>
          </div>

          {/* Group templates by category */}
          {Object.entries(
            templates.reduce((acc, template) => {
              if (!acc[template.category]) acc[template.category] = []
              acc[template.category].push(template)
              return acc
            }, {} as Record<string, Template[]>)
          ).map(([category, categoryTemplates]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">{category}</h4>
              <div className="space-y-2">
                {categoryTemplates.map((template) => (
                  <Card
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-amber-200/30 hover:border-amber-300/50 bg-white/80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        {template.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-amber-900 text-sm">{template.title}</h5>
                        <p className="text-xs text-amber-700 mt-1">{template.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Tips */}
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/30">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">💡 Consejos</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Usa / para comandos rápidos</li>
              <li>• Completa los campos [entre corchetes]</li>
              <li>• Sé específico con ubicaciones</li>
              <li>• Incluye síntomas detallados</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}