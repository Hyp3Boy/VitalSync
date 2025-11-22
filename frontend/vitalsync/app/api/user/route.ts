import api from '@/lib/api';
import { mockCurrentUser } from '@/lib/mocks/user';
import { UserProfile } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await api.get<UserProfile>('/users/me');
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock current user', error);
    return NextResponse.json(mockCurrentUser);
  }
}
