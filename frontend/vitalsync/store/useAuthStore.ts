import { STORAGE_KEYS } from '@/lib/constants/storage';
import { logoutUser } from '@/services/authService';
import { AuthStatus, UserProfile } from '@/types/user';
import { create } from 'zustand';

const persistCurrentUser = (user: UserProfile | null) => {
  if (typeof window === 'undefined') return;
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEYS.currentUser);
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEYS.currentUser,
    JSON.stringify(user)
  );
};

const readStoredUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const rawValue = window.localStorage.getItem(STORAGE_KEYS.currentUser);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue) as UserProfile;
  } catch (error) {
    console.warn('No se pudo interpretar el usuario almacenado', error);
    window.localStorage.removeItem(STORAGE_KEYS.currentUser);
    return null;
  }
};

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

const initialUser = readStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  status: initialUser ? 'authenticated' : 'idle',
  error: undefined,
  actions: {
    setUser: (user) => {
      persistCurrentUser(user);
      set({
        user,
        status: user ? 'authenticated' : 'idle',
        error: undefined,
      });
    },
    setStatus: (status) => set({ status }),
    setError: (message) => set({ error: message }),
    logout: async () => {
      set({ status: 'loading' });
      try {
        await logoutUser();
      } catch (error) {
        console.warn(
          'No se pudo contactar al backend para cerrar sesión, limpiando datos locales igualmente.',
          error
        );
      } finally {
        persistCurrentUser(null);
        set({ user: null, status: 'idle', error: undefined });
      }
    },
  },
}));
