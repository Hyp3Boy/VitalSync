import { Progress } from '@/components/ui/progress';
import { SymptomGuideStep } from '@/types/symptom';

interface SymptomGuideShellProps {
  step: SymptomGuideStep;
  stepIndex: number;
  totalSteps: number;
  children: React.ReactNode;
}

export const SymptomGuideShell = ({
  step,
  stepIndex,
  totalSteps,
  children,
}: SymptomGuideShellProps) => {
  const progressLabel = `Paso ${stepIndex + 1} de ${totalSteps}`;

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Guía Interactiva de Síntomas
          </h1>
          <p className="text-base max-w-3xl mx-auto text-muted-foreground">
            Indica tus síntomas y recibe orientación personalizada sobre
            posibles condiciones de salud y próximos pasos a seguir.
          </p>
        </div>
        <div className="space-y-3 max-w-4xl w-full mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">{progressLabel}</p>
            </div>
            <span className="text-md font-black text-muted-foreground">
              {step.progress}%
            </span>
          </div>
          <Progress value={step.progress} className="h-2 rounded-full" />
        </div>

        {children}
      </div>
    </>
  );
};
