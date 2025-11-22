import {
  DoctorDetailResponse,
  DoctorListResponse,
  DoctorQueryParams,
  DoctorReview,
} from '@/types/doctor';

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

  return (await response.json()) as DoctorListResponse;
};

export const fetchDoctorDetail = async (
  doctorId: string
): Promise<DoctorDetailResponse> => {
  const response = await fetch(`/api/doctors/${doctorId}`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la información del profesional');
  }

  return (await response.json()) as DoctorDetailResponse;
};

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  authorName: string;
}

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

  return (await response.json()) as DoctorReview;
};
