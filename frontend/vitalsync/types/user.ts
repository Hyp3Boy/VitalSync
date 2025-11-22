export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  profilePicturePath?: string | null;
}
