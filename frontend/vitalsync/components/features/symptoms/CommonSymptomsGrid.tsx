interface CommonSymptomsGridProps {
  symptoms: { id: string; label: string; icon: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export const CommonSymptomsGrid = ({ symptoms, selectedIds, onToggle }: CommonSymptomsGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {symptoms.map((symptom) => {
        const isSelected = selectedIds.includes(symptom.id)
        return (
          <button
            key={symptom.id}
            type="button"
            onClick={() => onToggle(symptom.id)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {symptom.icon}
            </span>
            <span>{symptom.label}</span>
          </button>
        )
      })}
    </div>
  )
}
