'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChatHistory } from '@/hooks/useChat';
import useChatStore from '@/store/useChatStore';
import { Info, NotebookPen, Settings2, Sparkles, Trash2 } from 'lucide-react';

export default function ChatWindow() {
  const { isLoading } = useChatHistory();
  const messages = useChatStore((s) => s.messages);
  const typing = useChatStore((s) => s.typing);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const chatLogs = useMemo(
    () => [
      'UX Writing Guide para la app',
      'Ideas para push notifications',
      'Transcribir y limpiar audio',
      'Preparar resumen clínico',
      'Explicar tratamiento al paciente',
      'Crear recordatorio de medicación',
    ],
    []
  );

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 font-sans shadow-[inset_0_40px_80px_rgba(93,64,55,0.08)] lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border border-[#E7DACC] bg-white/80 px-6 py-4 shadow-[0_25px_60px_rgba(90,70,50,0.1)]">
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            Asistente de Salud AI
          </h1>
          <p className="text-sm text-[#8D6E63]">
            Conversa con nuestro copiloto clínico para resumir, buscar y
            explicar información médica.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-[#E7DACC] px-4 py-2 text-sm font-semibold text-[#5D4037] transition hover:bg-[#FFF5E0]">
            <Info className="size-4" /> Guías
          </button>
          <button className="inline-flex size-11 items-center justify-center rounded-full border border-[#E7DACC] text-[#5D4037] transition hover:bg-[#FFF5E0]">
            <Settings2 className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <section className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col rounded-[32px] border border-[#E7DACC] bg-white/90 p-6 shadow-[0_35px_80px_rgba(93,64,55,0.15)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FFE082] px-3 py-1 text-xs font-semibold text-[#5D4037]">
                GPT-4.1
              </span>
              <span className="rounded-full bg-[#D7CCC8] px-3 py-1 text-xs font-semibold text-[#5D4037]">
                Diagnóstico virtual
              </span>
              <div className="ml-auto flex items-center gap-2 text-sm text-[#8D6E63]">
                <Sparkles className="size-4" /> Conversación activa
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {isLoading && (
                  <div className="rounded-3xl bg-[#FFF8E1] px-4 py-3 text-sm font-medium text-[#8D6E63] shadow-sm">
                    Cargando historial…
                  </div>
                )}
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {typing && (
                  <div className="rounded-3xl bg-[#FFF8E1] px-4 py-3 text-sm font-medium text-[#8D6E63] shadow-sm">
                    El asistente está escribiendo…
                  </div>
                )}
              </div>
              <div ref={bottomRef} />
            </div>
          </div>

          <ChatInput />
        </section>

        <aside className="w-full rounded-[32px] border border-[#E7DACC] bg-white/70 p-5 shadow-[0_25px_60px_rgba(93,64,55,0.12)] lg:w-80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#B08968]">
                Chat logs
              </p>
              <p className="text-lg font-bold text-[#5D4037]">
                Sesiones guardadas
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8D6E63]">12/50</span>
          </div>

          <div className="mt-5 space-y-2">
            {chatLogs.map((log, index) => (
              <button
                key={log}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  index === 1
                    ? 'border-[#FFD54F] bg-[#FFF8E1] text-[#5D4037]'
                    : 'border-transparent bg-[#F9F4EA] text-[#8D6E63] hover:border-[#E7DACC]'
                }`}
              >
                {log}
              </button>
            ))}
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#FFB74D] bg-[#FFF3E0] px-4 py-3 text-sm font-semibold text-[#BF360C] transition hover:bg-[#FFE0B2]">
            <Trash2 className="size-4" /> Limpiar historial
          </button>

          <div className="mt-6 space-y-3 text-sm text-[#8D6E63]">
            <p className="font-semibold uppercase tracking-[0.3em] text-[#B08968]">
              Plantillas rápidas
            </p>
            <div className="space-y-2">
              {[
                'Informe clínico',
                'Seguimiento de síntomas',
                'Explicación sencilla',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-dashed border-[#E7DACC] px-4 py-3"
                >
                  <NotebookPen className="size-4 text-[#B08968]" />
                  <span className="font-medium text-[#5D4037]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
