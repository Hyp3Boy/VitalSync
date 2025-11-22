import { MedicineResult } from '@/types/medicine';

export const mockMedicines: MedicineResult[] = [
  {
    id: 'paracetamol-500',
    name: 'Paracetamol 500mg',
    presentation: 'Caja con 20 tabletas',
    description: 'Analgesico y antipiretico de accion rapida.',
    category: 'generic',
    highlight: 'Analgésico y antipirético',
    pharmacies: [
      {
        pharmacyId: 'similares',
        name: 'Farmacias Similares',
        distanceKm: 2.5,
        price: 30,
        status: 'promo',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCx0pyBf07SzfnpVQuwVE0E0AeXoh4BYYLyWUVZai6g2ammzzRwtbscCBFishjq2xT0xcsz7VJok33PvUNyGuSZ0URonTsRdYMKGQ_PfEc5vKs4r-rOSKPzxLbGcbbYA_w1DXxuY1nJLoCmjX4IY0xtDJ-dR2Wmm8YWpAyqvEdICOYgUs-QMV-oO2oGJ-KuYPSFXFtyDfSFxqx7H-cdfVyoesDtLqNSzouzS-8KgWovfNieMANj6c1zbfljtkCjCyMXjOzeXjFmkcY',
      },
      {
        pharmacyId: 'ahorro',
        name: 'Farmacia del Ahorro',
        distanceKm: 1.2,
        price: 35,
        status: 'available',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBOl6fLiHAN28UiYWETJMAh5-MyctxEhQmVA2lHwkjj4ZXoaMjJpykUgIog60PTOpUoh64gqXrpMpv6RBPCoNasd1mALJDWg0OdwCZNWnCePOj2DdXpqfX1gDHWQIzy5AAy4_IU-_U38KhE7X0DQ_nzNCXsGCtTDvcfoY1vgq_F2S-lvDLWRMLNW9myktUXv7uCKvnjP1NH-_OJMkXAX-2d17PKiWxeN4BsRyaW1hmJlpcxFWDuho1sb7Lp1n5l1h6kjEj8dsvIGFQ',
      },
      {
        pharmacyId: 'san-pablo',
        name: 'Farmacia San Pablo',
        distanceKm: 4.1,
        status: 'out_of_stock',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCOrUZJF2uLtsAev9DbH0Teyy0MCNq4dvAAVa-d-_BuCppgM7vfxE0mAIORzi-xDsggnbIs_oRVf9PvWC5YYBDzkmw4jb9ZyQqRiZEn4Rw6Zh7dDn0fgQAnuROr9AzZ7QuSfp3aqEyX5Pe4ioBl8L2YW7pUNE1NhQU2urq7EMqSo-9y8-KxXcgQDSy2Ug92Va911TqnlfMRk37U1ZPHXSuDk0WgR_lVOsEyiL9R7YhNGiXbU_JVxfvaRULksnBMp72Cv1rhOxr8AHI',
      },
    ],
  },
  {
    id: 'tempra-forte-650',
    name: 'Tempra Forte 650mg',
    presentation: 'Caja con 24 tabletas',
    description: 'Principio activo: Paracetamol',
    category: 'brand',
    pharmacies: [
      {
        pharmacyId: 'ahorro',
        name: 'Farmacia del Ahorro',
        distanceKm: 1.2,
        price: 68.5,
        status: 'available',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBOl6fLiHAN28UiYWETJMAh5-MyctxEhQmVA2lHwkjj4ZXoaMjJpykUgIog60PTOpUoh64gqXrpMpv6RBPCoNasd1mALJDWg0OdwCZNWnCePOj2DdXpqfX1gDHWQIzy5AAy4_IU-_U38KhE7X0DQ_nzNCXsGCtTDvcfoY1vgq_F2S-lvDLWRMLNW9myktUXv7uCKvnjP1NH-_OJMkXAX-2d17PKiWxeN4BsRyaW1hmJlpcxFWDuho1sb7Lp1n5l1h6kjEj8dsvIGFQ',
      },
      {
        pharmacyId: 'san-pablo',
        name: 'Farmacia San Pablo',
        distanceKm: 4.1,
        price: 72,
        status: 'available',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCOrUZJF2uLtsAev9DbH0Teyy0MCNq4dvAAVa-d-_BuCppgM7vfxE0mAIORzi-xDsggnbIs_oRVf9PvWC5YYBDzkmw4jb9ZyQqRiZEn4Rw6Zh7dDn0fgQAnuROr9AzZ7QuSfp3aqEyX5Pe4ioBl8L2YW7pUNE1NhQU2urq7EMqSo-9y8-KxXcgQDSy2Ug92Va911TqnlfMRk37U1ZPHXSuDk0WgR_lVOsEyiL9R7YhNGiXbU_JVxfvaRULksnBMp72Cv1rhOxr8AHI',
      },
      {
        pharmacyId: 'similares',
        name: 'Farmacias Similares',
        distanceKm: 2.5,
        status: 'unavailable',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCx0pyBf07SzfnpVQuwVE0E0AeXoh4BYYLyWUVZai6g2ammzzRwtbscCBFishjq2xT0xcsz7VJok33PvUNyGuSZ0URonTsRdYMKGQ_PfEc5vKs4r-rOSKPzxLbGcbbYA_w1DXxuY1nJLoCmjX4IY0xtDJ-dR2Wmm8YWpAyqvEdICOYgUs-QMV-oO2oGJ-KuYPSFXFtyDfSFxqx7H-cdfVyoesDtLqNSzouzS-8KgWovfNieMANj6c1zbfljtkCjCyMXjOzeXjFmkcY',
      },
    ],
  },
];
