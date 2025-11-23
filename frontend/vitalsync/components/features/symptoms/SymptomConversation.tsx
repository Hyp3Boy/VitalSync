import { SymptomConversationAnswer, SymptomConversationBlock, SymptomConversationOption } from '@/types/symptom'
import { cn } from '@/lib/utils'

interface SymptomConversationProps {
  blocks: SymptomConversationBlock[]
  answers: SymptomConversationAnswer[]
  feedback: Record<string, string>
  isSending?: boolean
  onSelect: (blockId: string, option: SymptomConversationOption) => void
}

const ChatBubble = ({
  variant = 'assistant',
  children,
}: {
  variant?: 'assistant' | 'user' | 'feedback'
  children: React.ReactNode
}) => {
  const baseClasses =
    'rounded-2xl px-4 py-3 text-base leading-relaxed shadow-sm border border-border/60 max-w-xl'

  const styles: Record<typeof variant, string> = {
    assistant: 'bg-white text-foreground rounded-tl-none dark:bg-slate-900',
    user: 'bg-secondary text-secondary-foreground rounded-tr-none ml-auto',
    feedback: 'bg-background text-foreground border-dashed',
  }

  return <div className={cn(baseClasses, styles[variant])}>{children}</div>
}

export const SymptomConversation = ({
  blocks,
  answers,
  feedback,
  isSending = false,
  onSelect,
}: SymptomConversationProps) => {
  const answerMap = Object.fromEntries(answers.map((item) => [item.blockId, item.optionId]))
  const nextBlockIndex = blocks.findIndex((block) => block.options && !answerMap[block.id])

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const selectedOptionId = answerMap[block.id]
        const selectedOption = block.options?.find((option) => option.id === selectedOptionId)
        const isCurrent = nextBlockIndex !== -1 && index === nextBlockIndex

        return (
          <div key={block.id} className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-xl">
                  {block.icon ?? 'health_and_safety'}
                </span>
              </div>
              <ChatBubble>{block.content}</ChatBubble>
            </div>

            {block.options && (
              <div className="flex flex-wrap justify-end gap-3">
                {block.options.map((option) => {
                  const isSelected = selectedOptionId === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onSelect(block.id, option)}
                      disabled={(selectedOptionId && !isSelected) || (!isCurrent && !selectedOptionId)}
                      className={cn(
                        'flex min-w-[120px] items-center justify-center rounded-full px-5 py-3 text-base font-semibold transition',
                        'border border-border/70 bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-60 disabled:cursor-not-allowed',
                        isSelected && 'border-secondary bg-secondary text-secondary-foreground shadow'
                      )}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            )}

            {selectedOption && (
              <div className="flex justify-end">
                <ChatBubble variant="user">{selectedOption.label}</ChatBubble>
              </div>
            )}

            {feedback[block.id] && (
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined text-xl">sparkles</span>
                </div>
                <ChatBubble variant="feedback">{feedback[block.id]}</ChatBubble>
              </div>
            )}

            {isCurrent && isSending && (
              <div className="flex justify-end text-sm text-muted-foreground">Analizando...</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
