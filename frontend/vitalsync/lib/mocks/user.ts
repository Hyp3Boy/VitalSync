import { UserProfile } from '@/types/user';

export const mockUsers: UserProfile[] = [
  {
    id: 'user-123',
    fullName: 'María Fernanda Rojas',
    email: 'maria.rojas@example.com',
    phone: '+51 987 654 321',
    password: 'vitalsync123',
    profilePicturePath:
      'https://lh3.googleusercontent.com/a-/ALV-UjUes0y0maria-avatar',
  },
  {
    id: 'user-456',
    fullName: 'Dr. Esteban Quiroz',
    email: 'e.quiroz@example.com',
    phone: '+51 999 111 222',
    password: 'vitalsync456',
    profilePicturePath:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
  },
  {
    id: 'user-789',
    fullName: 'Soledad Pinedo',
    email: 'soledad.pinedo@example.com',
    phone: '+51 988 777 666',
    password: 'vitalsync789',
    profilePicturePath:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
  },
];

export const mockCurrentUser = mockUsers[0];

export const getMockUserById = (userId?: string): UserProfile => {
  if (!userId) return mockCurrentUser;
  return mockUsers.find((user) => user.id === userId) ?? mockCurrentUser;
};

const simulateNetworkDelay = (ms = 450) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateUserProfileRequest = async (
  userId?: string
): Promise<UserProfile> => {
  await simulateNetworkDelay();
  return getMockUserById(userId);
};
