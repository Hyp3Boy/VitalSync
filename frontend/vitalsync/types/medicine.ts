export type MedicineSortOption = 'price' | 'distance' | 'availability';
export type MedicineAvailability = 'all' | 'in_stock' | 'out_of_stock';

export interface PharmacyPrice {
  pharmacyId: string;
  name: string;
  distanceKm: number;
  price?: number;
  status: 'available' | 'promo' | 'out_of_stock' | 'unavailable';
  logoUrl: string;
}

export interface MedicineResult {
  id: string;
  name: string;
  presentation: string;
  description: string;
  category: 'generic' | 'brand';
  highlight?: string;
  pharmacies: PharmacyPrice[];
}

export interface MedicineQueryParams {
  search?: string;
  sort?: MedicineSortOption;
  availability?: MedicineAvailability;
  page?: number;
  perPage?: number;
}

export interface MedicineListResponse {
  items: MedicineResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
