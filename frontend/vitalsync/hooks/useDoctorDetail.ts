'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateReviewPayload,
  fetchDoctorDetail,
  submitDoctorReview,
} from '@/services/doctorService';
import { toast } from 'sonner';

export const useDoctorDetail = (doctorId: string) => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ['doctor-detail', doctorId],
    queryFn: () => fetchDoctorDetail(doctorId),
    staleTime: 1000 * 60 * 5,
    onError: () => {
      toast.error('No pudimos cargar la información de este doctor.')
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      submitDoctorReview(doctorId, payload),
    onSuccess: async () => {
      toast.success('Tu opinión fue enviada. ¡Gracias!');
      await client.invalidateQueries({ queryKey: ['doctor-detail', doctorId] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar tu opinión.'
      );
    },
  });

  return { query, mutation };
};
