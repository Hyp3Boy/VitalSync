import { logoutUser } from '@/services/authService';
import { AuthStatus, UserProfile } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  error?: string;
  actions: {
    setUser: (user: UserProfile | null) => void;
    setStatus: (status: AuthStatus) => void;
    setError: (message?: string) => void;
    logout: () => Promise<void>;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: undefined,
  actions: {
    setUser: (user) =>
      set({
        user,
        status: user ? 'authenticated' : 'idle',
        error: undefined,
      }),
    setStatus: (status) => set({ status }),
    setError: (message) => set({ error: message }),
    logout: async () => {
      set({ status: 'loading' });
      try {
        await logoutUser();
        set({ user: null, status: 'idle', error: undefined });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cerrar sesión. Intenta nuevamente.';
        set({ error: message, status: 'error' });
      }
    },
  },
}));
