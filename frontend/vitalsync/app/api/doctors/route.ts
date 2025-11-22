import api from '@/lib/api';
import { mockDoctors } from '@/lib/mocks/doctors';
import { Doctor, DoctorListResponse, DoctorQueryParams } from '@/types/doctor';
import { NextRequest, NextResponse } from 'next/server';

const normalizeParams = (searchParams: URLSearchParams): DoctorQueryParams => {
  const entries = Object.fromEntries(searchParams.entries());
  const params: DoctorQueryParams = {};

  if (entries.search) params.search = entries.search;
  if (entries.specialty && entries.specialty !== 'Todos') {
    params.specialty = entries.specialty;
  }
  if (entries.insurance && entries.insurance !== 'Todos') {
    params.insurance = entries.insurance as DoctorQueryParams['insurance'];
  }
  if (entries.location && entries.location !== 'Todos') {
    params.location = entries.location;
  }
  if (entries.minRating)
    params.minRating = Number.parseFloat(entries.minRating as string);
  if (entries.page) params.page = Number.parseInt(entries.page, 10);
  if (entries.perPage) params.perPage = Number.parseInt(entries.perPage, 10);

  return params;
};

const filterMockDoctors = (params: DoctorQueryParams): DoctorListResponse => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 9;

  let filtered: Doctor[] = [...mockDoctors];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(search) ||
        doctor.specialty.toLowerCase().includes(search)
    );
  }

  if (params.specialty) {
    filtered = filtered.filter(
      (doctor) => doctor.specialty === params.specialty
    );
  }

  if (params.location) {
    filtered = filtered.filter((doctor) => doctor.location === params.location);
  }

  if (params.insurance && params.insurance !== 'Todos') {
    filtered = filtered.filter((doctor) =>
      doctor.insurances.includes(params.insurance as Exclude<
        DoctorQueryParams['insurance'],
        'Todos'
      >)
    );
  }

  if (params.minRating) {
    filtered = filtered.filter((doctor) => doctor.rating >= params.minRating!);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return {
    items,
    total,
    page,
    perPage,
    totalPages,
  };
};

export async function GET(request: NextRequest) {
  const params = normalizeParams(request.nextUrl.searchParams);

  try {
    const response = await api.get<DoctorListResponse>('/doctors', {
      params,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock doctors data:', error);
    const fallback = filterMockDoctors(params);
    return NextResponse.json(fallback);
  }
}
