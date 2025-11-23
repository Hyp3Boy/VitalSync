import { EmergencyCenter } from '@/types/emergency';
import { create } from 'zustand';

// --- MOCK DATA ---
const mockEmergencyCenters: EmergencyCenter[] = [
  {
    id: 'em-1',
    name: 'Hospital de Emergencias Casimiro Ulloa',
    address: 'Av. República de Panamá 6355, Miraflores',
    district: 'Miraflores',
    latitude: -12.1264,
    longitude: -77.0213,
    phone: '(01) 219-0300',
    availableBeds: 12,
    waitTimeMinutes: 25,
  },
  {
    id: 'em-2',
    name: 'Hospital Nacional Arzobispo Loayza',
    address: 'Av. Alfonso Ugarte 848, Cercado de Lima',
    district: 'Cercado de Lima',
    latitude: -12.051,
    longitude: -77.044,
    phone: '(01) 330-3030',
    availableBeds: 5,
    waitTimeMinutes: 45,
  },
  {
    id: 'em-3',
    name: 'Hospital Nacional Edgardo Rebagliati Martins',
    address: 'Av. Rebagliati 490, Jesús María',
    district: 'Jesús María',
    latitude: -12.08551,
    longitude: -77.0331,
    phone: '(01) 265-4901',
    availableBeds: 20,
    waitTimeMinutes: 15,
  },
  {
    id: 'em-4',
    name: 'Clínica Anglo Americana',
    address: 'Calle Alfredo Salazar 350, San Isidro',
    district: 'San Isidro',
    latitude: -12.1005,
    longitude: -77.0452,
    phone: '(01) 616-8900',
    availableBeds: 8,
    waitTimeMinutes: 10,
  },
];

export type EmergencyStatus = 'idle' | 'loading' | 'ready' | 'error';

interface EmergencyState {
  centers: EmergencyCenter[];
  status: EmergencyStatus;
  error?: string;
  selectedDistance: number;
  actions: {
    loadCenters: () => Promise<void>;
    setDistance: (distance: number) => void;
  };
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  centers: [],
  status: 'idle',
  error: undefined,
  selectedDistance: 10,
  actions: {
    loadCenters: async () => {
      if (get().status === 'loading') return;
      set({ status: 'loading', error: undefined });
      // Simula una llamada a la API con un retraso
      setTimeout(() => {
        set({ centers: mockEmergencyCenters, status: 'ready' });
      }, 1200);
    },
    setDistance: (distance) => set({ selectedDistance: distance }),
  },
}));
