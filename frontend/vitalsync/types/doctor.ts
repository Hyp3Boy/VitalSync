export type InsuranceProvider = 'SIS' | 'EsSalud' | 'Privado';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialties?: string[];
  cmp: string;
  rating: number; // promedio 0-5
  ratingCount: number;
  location: string;
  insurances: InsuranceProvider[];
  imageUrl: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DoctorScheduleDay {
  day: string;
  slots: string[] | null;
  note?: string;
}

export interface DoctorCoordinates {
  latitude: number;
  longitude: number;
}

export interface DoctorDetail extends Doctor {
  specialties: string[];
  bio: string;
  yearsExperience: number;
  languages: string[];
  education: string;
  clinicAddress: string;
  schedule?: DoctorScheduleDay[] | null;
  coordinates?: DoctorCoordinates;
}

export interface DoctorQueryParams {
  search?: string;
  specialty?: string;
  insurance?: InsuranceProvider | 'Todos';
  location?: string;
  minRating?: number;
  page?: number;
  perPage?: number;
}

export interface DoctorListResponse {
  items: Doctor[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DoctorDetailResponse {
  doctor: DoctorDetail;
  reviews: DoctorReview[];
}
