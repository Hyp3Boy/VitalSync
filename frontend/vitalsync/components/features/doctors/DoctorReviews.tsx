'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DoctorReview } from '@/types/doctor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { notifyError, notifySuccess } from '@/lib/utils/toast';
import { z } from 'zod';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Selecciona una calificación' })
    .min(1, 'Selecciona una calificación')
    .max(5),
  comment: z
    .string()
    .min(10, 'Comparte al menos 10 caracteres para ayudar a otros pacientes.'),
});

// BACKEND CONTRACT: CreateReviewPayload { rating: number; comment: string; authorName: string }
// SERVER RETURNS: DoctorReview { id, doctorId, authorName, rating, comment, createdAt }

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface DoctorReviewsProps {
  reviews: DoctorReview[];
  onSubmit: (values: ReviewFormValues & { authorName: string }) => void;
  isSubmitting: boolean;
}

const StarButton = ({
  value,
  selected,
  onSelect,
}: {
  value: number;
  selected: boolean;
  onSelect: (value: number) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    aria-label={`Calificar con ${value} ${
      value === 1 ? 'estrella' : 'estrellas'
    }`}
    title={`${value} ${value === 1 ? 'estrella' : 'estrellas'}`}
    className="text-primary transition hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
  >
    <Star
      className={
        selected ? 'size-6 fill-current text-primary' : 'size-6 text-primary/30'
      }
    />
  </button>
);

const ReadOnlyStars = ({
  value,
  size = 'size-4',
}: {
  value: number;
  size?: string;
}) => (
  <div className="flex gap-1 text-primary">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < Math.round(value)
            ? 'fill-primary text-primary'
            : 'text-primary/20'
        }`}
      />
    ))}
  </div>
);

const formatReviewDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'long',
    }).format(new Date(value));
  } catch {
    return new Date(value).toLocaleDateString();
  }
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const DoctorReviews = ({
  reviews,
  onSubmit,
  isSubmitting,
}: DoctorReviewsProps) => {
  const { user, status } = useCurrentUser();
  const isAuthenticated = !!user && status === 'authenticated';

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });
  const [ratingValue, setRatingValue] = useState(() =>
    form.getValues('rating')
  );

  const lastCommentErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const message = form.formState.errors.comment?.message;
    if (message && lastCommentErrorRef.current !== message) {
      notifyError(new Error(message), message);
      lastCommentErrorRef.current = message;
    }
    if (!message) {
      lastCommentErrorRef.current = null;
    }
  }, [form.formState.errors.comment?.message]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const averageRatingLabel = averageRating.toFixed(1);

  const [page, setPage] = useState(1);
  const perPage = 5;
  const pageCount = Math.max(1, Math.ceil(reviews.length / perPage));
  const start = (page - 1) * perPage;
  const currentReviews = reviews.slice(start, start + perPage);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  const handleSubmit = (values: ReviewFormValues) => {
    if (!isAuthenticated) {
      notifyError(new Error('Inicia sesión para compartir tu experiencia.'), 'Inicia sesión para compartir tu experiencia.');
      return;
    }

    onSubmit({ ...values, authorName: user?.fullName ?? 'Paciente' });
    notifySuccess('¡Gracias por tu opinión!');
    form.reset({ rating: 5, comment: '' });
    setRatingValue(5);
  };

  return (
    <section className="space-y-6">
      <Card className="border border-border/80 bg-card p-6">
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-foreground">
            Opiniones de Pacientes
          </p>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Aún no hay opiniones para este profesional. ¡Sé la primera
                persona en compartir tu experiencia!
              </div>
            ) : (
              currentReviews.map((review) => {
                const initials = getInitials(review.authorName);
                return (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <Avatar className="size-11 bg-primary/10 text-primary">
                          <AvatarFallback className="text-sm font-semibold uppercase text-primary">
                            {initials || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {review.authorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatReviewDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <ReadOnlyStars value={review.rating} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                );
              })
            )}
            {reviews.length > perPage && (
              <Pagination className="mt-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(pageCount, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </Card>

      <Card className="border border-border/80 bg-card p-6">
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-foreground">
              Deja tu opinión
            </p>
            <p className="text-sm text-muted-foreground">
              Tu retroalimentación ayuda a otros pacientes a tomar mejores
              decisiones.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Tu calificación
              </p>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <StarButton
                      key={value}
                      value={value}
                      selected={ratingValue >= value}
                      onSelect={(val) => {
                        setRatingValue(val);
                        form.setValue('rating', val);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="¿Qué te gustó de la consulta?"
                rows={4}
                aria-invalid={!!form.formState.errors.comment}
                {...form.register('comment')}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar opinión'}
            </Button>
            {!isAuthenticated && (
              <div className="sr-only">
                Debes iniciar sesión para publicar tu opinión.
              </div>
            )}
          </form>
        </div>
      </Card>
    </section>
  );
};
