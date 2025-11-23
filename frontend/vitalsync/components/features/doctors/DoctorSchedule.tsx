'use client';

import { Card } from '@/components/ui/card';
import { type DoctorScheduleDay } from '@/types/doctor';

interface DoctorScheduleProps {
  schedule?: DoctorScheduleDay[] | null;
}

export const DoctorSchedule = ({ schedule }: DoctorScheduleProps) => {
  const normalizedSchedule =
    schedule?.filter((day): day is DoctorScheduleDay => !!day) ?? [];

  const showEmptyState =
    normalizedSchedule.length === 0 ||
    normalizedSchedule.every(
      (day) => !day.slots || (Array.isArray(day.slots) && day.slots.length === 0)
    );

  return (
    <Card className="border border-border/80 bg-card p-6 space-y-2">
      <p className="mb-2 text-lg font-semibold text-foreground">
        Horarios Disponibles
      </p>
      {showEmptyState ? (
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
          No es posible obtener más horarios en este momento. Por favor, inténtalo más tarde.
        </div>
      ) : (
        <div className="space-y-3">
          {normalizedSchedule.map((day) => {
            const slots = Array.isArray(day.slots) ? day.slots : [];
            const hasSlots = slots.length > 0;
            const noSlotsLabel =
              day.slots === null
                ? 'Sin atención este día'
                : 'No hay horarios';

            return (
              <div key={day.day} className="flex flex-col gap-1 rounded-lg border border-border/60 px-3 py-2 md:flex-row md:items-center md:justify-between">
                <span className="text-sm font-medium text-foreground">{day.day}</span>
                <div className="flex flex-wrap gap-2">
                  {hasSlots ? (
                    slots.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/30"
                      >
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">{noSlotsLabel}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
