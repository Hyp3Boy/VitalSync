// src/components/ui/StateInfo.tsx
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

// Componente para el estado de carga (Skeleton)
export const LoadingSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
    ))}
  </div>
);

// Componente para el estado de error
interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
  title?: string;
}
export const ErrorState = ({
  onRetry,
  title = 'No se pudieron cargar los resultados',
  message = 'Hubo un problema de conexión. Por favor, inténtalo de nuevo.',
}: ErrorStateProps) => (
  <div className="text-center py-10 bg-muted/50 rounded-lg">
    <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
    <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    <div className="mt-6">
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  </div>
);

// Componente para cuando no se encuentran resultados
interface EmptyStateProps {
  message?: string;
  title?: string;
}
export const EmptyState = ({
  title = 'No se encontraron resultados',
  message = 'Intenta con otra ubicación o amplía tu radio de búsqueda.',
}: EmptyStateProps) => (
  <div className="text-center py-10 bg-muted/50 rounded-lg">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
  </div>
);