export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profilePicturePath?: string | null;
}
