import { UserProfile } from '@/types/user';

export const fetchCurrentUser = async (): Promise<UserProfile> => {
  const response = await fetch('/api/user', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  return (await response.json()) as UserProfile;
};
