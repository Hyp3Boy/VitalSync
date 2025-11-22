import api from '@/lib/api';
import { mockMedicines } from '@/lib/mocks/medicines';
import { MedicineListResponse, MedicineQueryParams } from '@/types/medicine';
import { NextRequest, NextResponse } from 'next/server';

const normalizeParams = (searchParams: URLSearchParams): MedicineQueryParams => {
  const params: MedicineQueryParams = {};
  const entries = Object.fromEntries(searchParams.entries());

  if (entries.search) params.search = entries.search;
  if (entries.sort) params.sort = entries.sort as MedicineQueryParams['sort'];
  if (entries.availability)
    params.availability = entries.availability as MedicineQueryParams['availability'];
  if (entries.page) params.page = Number.parseInt(entries.page, 10);
  if (entries.perPage) params.perPage = Number.parseInt(entries.perPage, 10);

  return params;
};

const filterMockMedicines = (params: MedicineQueryParams): MedicineListResponse => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 10;

  let items = [...mockMedicines];

  if (params.search) {
    const search = params.search.toLowerCase();
    items = items.filter((item) =>
      [item.name, item.presentation, item.description]
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }

  if (params.availability && params.availability !== 'all') {
    items = items.filter((item) =>
      item.pharmacies.some((pharmacy) =>
        params.availability === 'in_stock'
          ? pharmacy.status === 'available' || pharmacy.status === 'promo'
          : pharmacy.status === 'out_of_stock' || pharmacy.status === 'unavailable'
      )
    );
  }

  if (params.sort === 'price') {
    items = items.sort((a, b) => {
      const minA = Math.min(
        ...a.pharmacies
          .filter((p) => p.price)
          .map((p) => p.price ?? Number.POSITIVE_INFINITY)
      );
      const minB = Math.min(
        ...b.pharmacies
          .filter((p) => p.price)
          .map((p) => p.price ?? Number.POSITIVE_INFINITY)
      );
      return minA - minB;
    });
  }

  if (params.sort === 'distance') {
    items = items.sort((a, b) => {
      const distA = Math.min(...a.pharmacies.map((p) => p.distanceKm));
      const distB = Math.min(...b.pharmacies.map((p) => p.distanceKm));
      return distA - distB;
    });
  }

  if (params.sort === 'availability') {
    items = items.sort((a, b) => {
      const aAvailable = a.pharmacies.some(
        (p) => p.status === 'available' || p.status === 'promo'
      );
      const bAvailable = b.pharmacies.some(
        (p) => p.status === 'available' || p.status === 'promo'
      );
      return Number(bAvailable) - Number(aAvailable);
    });
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return {
    items: paginated,
    total,
    page,
    perPage,
    totalPages,
  };
};

export async function GET(request: NextRequest) {
  const params = normalizeParams(request.nextUrl.searchParams);

  try {
    const response = await api.get<MedicineListResponse>('/medicines', {
      params,
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock medicines data', error);
    return NextResponse.json(filterMockMedicines(params));
  }
}
