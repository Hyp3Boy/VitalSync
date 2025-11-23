import {
  DoctorDetailResponse,
  DoctorListResponse,
  DoctorQueryParams,
  DoctorReview,
} from '@/types/doctor';
import { doctorDetailResponseSchema, doctorListResponseSchema, doctorReviewSchema } from '@/lib/validations/apiSchemas';
import { notifyError } from '@/lib/utils/toast';

const buildQueryString = (params: DoctorQueryParams) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    sp.set(key, String(value));
  });
  return sp.toString();
};

export const fetchDoctors = async (
  params: DoctorQueryParams
): Promise<DoctorListResponse> => {
  const query = buildQueryString(params);
  const endpoint = query ? `/api/doctors?${query}` : '/api/doctors';
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de doctores');
  }

  const data = (await response.json()) as unknown;
  const parsed = doctorListResponseSchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida de listado de doctores'), 'Respuesta inválida de listado de doctores');
  }
  return parsed.success ? parsed.data : (data as DoctorListResponse);
};

export const fetchDoctorDetail = async (
  doctorId: string
): Promise<DoctorDetailResponse> => {
  const response = await fetch(`/api/doctors/${doctorId}`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la información del profesional');
  }

  const data = (await response.json()) as unknown;
  const parsed = doctorDetailResponseSchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida de detalle de doctor'), 'Respuesta inválida de detalle de doctor');
  }
  return parsed.success ? parsed.data : (data as DoctorDetailResponse);
};

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  authorName: string;
}

// BACKEND CONTRACTS:
// GET /api/doctors/:id -> returns DoctorDetailResponse { doctor: DoctorDetail, reviews: DoctorReview[] }
// POST /api/doctors/:id/reviews -> accepts CreateReviewPayload and returns DoctorReview
// When connecting real backend, ensure these shapes match server responses.

export const submitDoctorReview = async (
  doctorId: string,
  payload: CreateReviewPayload
): Promise<DoctorReview> => {
  const response = await fetch(`/api/doctors/${doctorId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo enviar tu opinión.');
  }

  const data = (await response.json()) as unknown;
  const parsed = doctorReviewSchema.safeParse(data);
  if (!parsed.success) {
    notifyError(new Error('Respuesta inválida al crear opinión'), 'Respuesta inválida al crear opinión');
  }
  return parsed.success ? parsed.data : (data as DoctorReview);
};
