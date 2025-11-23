import { Card } from '@/components/ui/card'
import { BodyArea } from '@/types/symptom'
import { cn } from '@/lib/utils'

interface BodyAreaSelectorProps {
  areas: BodyArea[]
  selectedId?: string
  onSelect: (id: string) => void
}

export const BodyAreaSelector = ({ areas, selectedId, onSelect }: BodyAreaSelectorProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {areas.map((area) => (
        <Card
          key={area.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(area.id)}
          className={cn(
            'cursor-pointer border border-border/80 bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md',
            selectedId === area.id && 'border-primary/60 bg-primary/5'
          )}
        >
          <p className="text-base font-semibold text-foreground">{area.label}</p>
          <p className="text-sm text-muted-foreground">{area.description}</p>
        </Card>
      ))}
    </div>
  )
}
