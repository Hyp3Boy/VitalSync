'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DoctorReview } from '@/types/doctor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, UserRound } from 'lucide-react';
import { useMemo } from 'react';

const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Selecciona una calificación' })
    .min(1, 'Selecciona una calificación')
    .max(5),
  comment: z
    .string()
    .min(10, 'Comparte al menos 10 caracteres para ayudar a otros pacientes.'),
});

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
    className="text-primary"
  >
    <Star
      className={selected ? 'fill-current text-primary size-6' : 'size-6'}
    />
  </button>
);

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

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const handleSubmit = (values: ReviewFormValues) => {
    if (!isAuthenticated) {
      form.setError('comment', {
        message: 'Inicia sesión para compartir tu experiencia.',
      });
      return;
    }

    onSubmit({ ...values, authorName: user?.fullName ?? 'Paciente' });
    form.reset({ rating: 5, comment: '' });
  };

  return (
    <section className="space-y-6">
      <Card className="border border-border/80 bg-card p-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xl font-bold text-foreground">Opiniones</p>
            <p className="text-sm text-muted-foreground">
              Promedio {averageRating} / 5 ({reviews.length} opiniones)
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">
              Comparte tu experiencia
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                return (
                  <StarButton
                    key={value}
                    value={value}
                    selected={form.watch('rating') >= value}
                    onSelect={(val) => form.setValue('rating', val)}
                  />
                );
              })}
            </div>
            <Textarea
              placeholder="¿Qué te gustó de la consulta?"
              rows={4}
              {...form.register('comment')}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-destructive">
                {form.formState.errors.comment.message}
              </p>
            )}
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={form.handleSubmit(handleSubmit)}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar opinión'}
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground">
                Debes iniciar sesión para publicar tu opinión.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-border/60 bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {review.authorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < review.rating
                          ? 'size-4 fill-primary text-primary'
                          : 'size-4 text-primary/20'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {review.comment}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};
