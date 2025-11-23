import { Card } from '@/components/ui/card';
import { MedicineResult } from '@/types/medicine';
import { cn } from '@/lib/utils';

interface MedicineResultCardProps {
  medicine: MedicineResult;
}

const chipStyles = (category: MedicineResult['category']) =>
  category === 'generic'
    ? 'bg-primary/10 text-primary'
    : 'bg-amber-100 text-amber-900';

const statusLabel = (
  status: MedicineResult['pharmacies'][number]['status']
): { label: string; className: string } => {
  switch (status) {
    case 'promo':
      return { label: 'Oferta', className: 'text-primary' };
    case 'available':
      return { label: 'Disponible', className: 'text-foreground' };
    case 'out_of_stock':
      return { label: 'Agotado', className: 'text-status-red' };
    default:
      return { label: 'No disponible', className: 'text-muted-foreground' };
  }
};

export const MedicineResultCard = ({ medicine }: MedicineResultCardProps) => {
  return (
    <Card className="space-y-4 border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-foreground">{medicine.name}</p>
          <p className="text-sm text-muted-foreground">{medicine.presentation}</p>
          {medicine.highlight && (
            <p className="text-sm text-muted-foreground">{medicine.highlight}</p>
          )}
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            chipStyles(medicine.category)
          )}
        >
          {medicine.category === 'generic' ? 'Genérico' : 'De Marca'}
        </div>
      </div>

      <div className="border-t border-dashed border-border pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Precios en farmacias cercanas
        </p>
        <div className="flex flex-col gap-3">
          {medicine.pharmacies.map((pharmacy) => {
            const status = statusLabel(pharmacy.status);
            const hasPrice = typeof pharmacy.price === 'number';
            return (
              <div
                key={pharmacy.pharmacyId}
                className={cn(
                  'flex flex-wrap items-center gap-4 rounded-xl border border-border px-4 py-3',
                  pharmacy.status === 'promo' && 'bg-primary/5'
                )}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div
                    className="size-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${pharmacy.logoUrl})` }}
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold">{pharmacy.name}</p>
                    <p className="text-xs text-muted-foreground">
                      A {pharmacy.distanceKm.toFixed(1)} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasPrice ? (
                    <p className="text-lg font-bold text-primary">
                      ${pharmacy.price?.toFixed(2)}
                    </p>
                  ) : (
                    <p
                      className={cn('text-sm font-medium', status.className)}
                    >
                      {status.label}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
