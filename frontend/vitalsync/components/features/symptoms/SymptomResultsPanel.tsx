import { SymptomGuideResult } from '@/types/symptom'
import { cn } from '@/lib/utils'

interface SymptomResultsPanelProps {
  result: SymptomGuideResult
}

const emphasisStyles: Record<string, { container: string; badge: string; button: string }> = {
  high: {
    container: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20',
    badge: 'text-orange-700 dark:text-orange-300',
    button: 'bg-orange-500 text-white hover:bg-orange-600',
  },
  medium: {
    container: 'border-secondary/60 bg-secondary/10',
    badge: 'text-green-700 dark:text-green-300',
    button: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  },
  low: {
    container: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
    badge: 'text-muted-foreground',
    button: 'bg-muted text-muted-foreground hover:bg-muted/80',
  },
}

export const SymptomResultsPanel = ({ result }: SymptomResultsPanelProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-3xl font-black tracking-tight text-primary">{result.title}</p>
        <p className="text-lg text-muted-foreground">{result.subtitle}</p>
      </div>

      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-primary">warning</span>
        <p className="mt-3 text-xl font-semibold text-foreground">{result.disclaimer}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Posibles causas</h3>
        <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
          {result.possibleCauses.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Recomendación de acción</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.actions.map((action) => {
            const styles = emphasisStyles[action.emphasis] ?? emphasisStyles.low
            return (
              <div
                key={action.id}
                className={cn('flex h-full flex-col gap-3 rounded-xl border p-6 text-left', styles.container)}
              >
                <span className={cn('text-sm font-semibold uppercase tracking-wide', styles.badge)}>
                  {action.level}
                </span>
                <p className="font-semibold text-foreground">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <a
                  href={action.ctaHref ?? '#'}
                  className={cn(
                    'mt-auto flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors',
                    styles.button
                  )}
                >
                  {action.ctaLabel}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
