'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Send,
  Bot,
  Activity,
  Stethoscope,
  Pill,
  Search,
  Users,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateSidebar } from './ChatSidebars';
import { QuickActionChips } from './ChatComponents';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// Template data
const templates = [
  {
    id: '1',
    category: 'Triaje y Ubicación',
    title: 'Urgencia Menor (Cat I-4)',
    description: 'Buscar centro de salud con atención de parto/internamiento',
    content:
      'Busco un centro de salud con atención de parto/internamiento cerca de [Tu Distrito].',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: '2',
    category: 'Triaje y Ubicación',
    title: 'Consulta General',
    description: 'Encontrar posta médica para atención de síntomas',
    content:
      'Necesito una posta médica cerca de [Ubicación] para atención de [Síntoma].',
    icon: <Stethoscope className="w-4 h-4" />,
  },
  {
    id: '3',
    category: 'Farmacia',
    title: 'Buscar Stock',
    description: 'Encontrar medicamentos específicos en tu área',
    content:
      'Quiero saber dónde encontrar [Medicamento] de [Dosis] en [Distrito].',
    icon: <Pill className="w-4 h-4" />,
  },
  {
    id: '4',
    category: 'Farmacia',
    title: 'Genéricos',
    description: 'Encontrar equivalentes genéricos y precios',
    content: '¿Cuál es el equivalente genérico de [Marca] y precio?',
    icon: <Search className="w-4 h-4" />,
  },
  {
    id: '5',
    category: 'Doctores',
    title: 'Por Especialidad',
    description: 'Buscar especialistas por horario disponible',
    content: 'Busco un [Especialista] que atienda los [Día].',
    icon: <Users className="w-4 h-4" />,
  },
];

// Quick actions data
const quickActions = [
  {
    id: 'emergency',
    label: '🚑 Emergencia',
    icon: <Activity className="w-4 h-4" />,
    content: 'Necesito atención de emergencia médica cerca de [mi ubicación]',
    color: '',
  },
  {
    id: 'drug-search',
    label: '💊 Buscar Fármaco',
    icon: <Pill className="w-4 h-4" />,
    content: 'Busco [medicamento] en [ubicación]',
    color: '',
  },
  {
    id: 'doctor-search',
    label: '👨‍⚕️ Buscar Doctor',
    icon: <Stethoscope className="w-4 h-4" />,
    content: 'Busco un [especialista] en [ubicación]',
    color: '',
  },
  {
    id: 'centers',
    label: '🏥 Ver Centros',
    icon: <Search className="w-4 h-4" />,
    content: 'Mostrar centros de salud cerca de [ubicación]',
    color: '',
  },
];

// Slash commands data
const slashCommands = [
  {
    id: 'emergency',
    command: '/emergency',
    description: 'Buscar atención de emergencia',
    content: 'Necesito atención de emergencia médica urgente',
  },
  {
    id: 'doctor',
    command: '/doctor',
    description: 'Buscar médico especialista',
    content: 'Busco un médico especialista en',
  },
  {
    id: 'medicine',
    command: '/medicine',
    description: 'Buscar información de medicamentos',
    content: 'Busco información sobre el medicamento',
  },
  {
    id: 'location',
    command: '/location',
    description: 'Buscar centros de salud cercanos',
    content: 'Busco centros de salud cerca de',
  },
];

export default function ChatInterfaceFixed() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '¡Hola! Soy tu asistente médico AI. Estoy aquí para ayudarte a encontrar centros de salud, médicos especialistas, información sobre medicamentos y más. ¿En qué puedo asistirte hoy?',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(slashCommands);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle slash commands
  useEffect(() => {
    const updateSlashCommands = () => {
      if (input.startsWith('/')) {
        const command = input.slice(1);
        const filtered = slashCommands.filter((cmd) =>
          cmd.command.slice(1).toLowerCase().includes(command.toLowerCase())
        );
        setFilteredCommands(filtered);
        setShowSlashCommands(filtered.length > 0);
        setSelectedCommandIndex(0);
      } else {
        setShowSlashCommands(false);
      }
    };

    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(updateSlashCommands);
  }, [input]);

  const handleTemplateClick = (content: string) => {
    setInput(content);
    inputRef.current?.focus();
  };

  const handleQuickAction = (content: string) => {
    setInput(content);
    inputRef.current?.focus();
  };

  const handleSlashCommandSelect = (command: (typeof slashCommands)[0]) => {
    setInput(command.content);
    setShowSlashCommands(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSlashCommands) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault();
        handleSlashCommandSelect(filteredCommands[selectedCommandIndex]);
      } else if (e.key === 'Escape') {
        setShowSlashCommands(false);
      }
    }
  };

  const simulateAIResponse = (userMessage: string) => {
    // Simulate different AI responses based on the message content
    let response = '';

    if (userMessage.toLowerCase().includes('emergencia')) {
      response = `🚑 **Centros de Emergencia Cercanos**:

**Hospital Nacional**: 2.3 km - 📞 01-328-0000
**Clínica San Borja**: 1.8 km - 📞 01-215-0000
**Hospital Loayza**: 3.1 km - 📞 01-330-0000

⚠️ **Importante**: Si es una emergencia vital, llame al 116 o acuda al centro más cercano inmediatamente.`;
    } else if (
      userMessage.toLowerCase().includes('medicamento') ||
      userMessage.toLowerCase().includes('fármaco')
    ) {
      response = `💊 **Información de Medicamentos**:

**Paracetamol 500mg**:
• Inkafarma Los Olivos: S/8.50 ✅ En stock
• Mifarma San Isidro: S/7.90 ✅ En stock
• Pharmax: S/9.20 ✅ En stock

**Genérico equivalente**: Paracetamol Genfar 500mg - S/6.80`;
    } else if (
      userMessage.toLowerCase().includes('doctor') ||
      userMessage.toLowerCase().includes('especialista')
    ) {
      response = `👨‍⚕️ **Médicos Especialistas Disponibles**:

**Dr. Carlos Rodríguez** - Cardiólogo
• 📅 Disponible: Lunes, Miércoles, Viernes
• 🏥 Centro: Clínica Angloamericana
• 💰 Consulta: S/150

**Dra. María López** - Dermatóloga
• 📅 Disponible: Martes, Jueves
• 🏥 Centro: Hospital Nacional
• 💰 Consulta: S/120`;
    } else if (
      userMessage.toLowerCase().includes('centro') ||
      userMessage.toLowerCase().includes('hospital')
    ) {
      response = `🏥 **Centros de Salud Cercanos**:

**Hospital Nacional Arzobispo Loayza**
• 📍 Dirección: Av. Alfonso Ugarte 848
• 📞 Teléfono: 01-328-0000
• ⏰ Horario: 24 horas
• 🚗 Estacionamiento: Sí

**Clínica San Borja**
• 📍 Dirección: Av. Guardia Civil 333
• 📞 Teléfono: 01-215-0000
• ⏰ Horario: 8:00 - 20:00
• 🚗 Estacionamiento: Sí`;
    } else {
      response = `Entiendo que necesitas ayuda médica. Para brindarte la mejor asistencia, ¿podrías especificar:

• ¿Qué tipo de atención necesitas? (emergencia, consulta general, especialista)
• ¿Cuál es tu ubicación aproximada?
• ¿Hay algún síntoma específico que te preocupe?

También puedes usar los botones rápidos arriba o las plantillas del lado derecho para obtener ayuda más rápida.`;
    }

    return response;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Clear input
      setInput('');
      setIsLoading(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = simulateAIResponse(input);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Header with Home Button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Asistente Médico AI
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Tu copiloto clínico personal
            </p>
          </div>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              <Home className="w-7xl h-7xl" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex pt-20">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-[var(--primary-foreground)]" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-2xl rounded-3xl px-6 py-4 shadow-lg transition-all',
                      message.role === 'user'
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-xl'
                        : 'bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-bl-xl hover:shadow-xl'
                    )}
                  >
                    <div className="prose prose-sm max-w-none prose-p:text-inherit prose-li:text-inherit prose-strong:text-inherit">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* Feedback buttons for assistant messages */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-full"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-full"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-full"
                        >
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
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-[var(--primary-foreground)]" />
                  </div>
                  <div className="max-w-2xl rounded-3xl rounded-bl-xl bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] px-6 py-4 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 bg-[var(--card)]/40 backdrop-blur-sm border-t border-[var(--border)]">
            <div className="max-w-4xl mx-auto space-y-4">
              <QuickActionChips
                actions={quickActions}
                onActionClick={handleQuickAction}
              />

              {/* Input Area */}
              <div className="relative">
                <form onSubmit={onSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje o usa / para comandos..."
                      className="w-full rounded-2xl bg-[var(--card)]/80 backdrop-blur-sm border-2 border-[var(--border)] px-6 py-4 text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-[var(--primary)] transition-all"
                    />

                    {/* Slash Commands Menu */}
                    <AnimatePresence>
                      {showSlashCommands && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
                        >
                          {filteredCommands.map((command, index) => (
                            <button
                              key={command.id}
                              onClick={() => handleSlashCommandSelect(command)}
                              className={cn(
                                'w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-[var(--secondary)]',
                                index === selectedCommandIndex
                                  ? 'bg-[var(--secondary)]'
                                  : 'hover:bg-[var(--secondary)]'
                              )}
                            >
                              <span className="font-mono text-[var(--primary)] font-semibold">
                                {command.command}
                              </span>
                              <span className="text-[var(--muted-foreground)]">
                                {command.description}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed px-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Templates */}
        <div className="w-80 bg-[var(--card)]/60 backdrop-blur-sm border-l border-[var(--border)] flex flex-col">
          {/* Scrollable Templates Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <TemplateSidebar
              templates={templates}
              onTemplateClick={handleTemplateClick}
              className="!w-full !bg-transparent !border-0 !p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
