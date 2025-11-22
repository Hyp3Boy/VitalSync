import { fetchEmergencyCenters } from '@/services/emergencyService';
import { EmergencyCenter } from '@/types/emergency';
import { create } from 'zustand';

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
      try {
        const centers = await fetchEmergencyCenters();
        set({ centers, status: 'ready' });
      } catch (error) {
        set({
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'No se pudo cargar la red de emergencias.',
        });
      }
    },
    setDistance: (distance) => set({ selectedDistance: distance }),
  },
}));
