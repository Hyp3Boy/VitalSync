import { UserLocationEntry } from '@/types/location';

export const mockUserLocations: UserLocationEntry[] = [
  {
    id: 'home',
    label: 'Casa',
    addressLine: 'Av. Siempre Viva 742',
    latitude: -12.046374,
    longitude: -77.042793,
    tag: 'home',
    isPrimary: true,
  },
  {
    id: 'office',
    label: 'Oficina',
    addressLine: 'Calle Falsa 123',
    latitude: -12.051234,
    longitude: -77.035612,
    tag: 'office',
  },
];
