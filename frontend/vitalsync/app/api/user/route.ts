import api from '@/lib/api';
import { simulateUserProfileRequest } from '@/lib/mocks/user';
import { UserProfile } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await api.get<UserProfile>('/users/me');
    return NextResponse.json(response.data);
  } catch (error) {
    console.warn('Falling back to mock current user', error);
    const fallbackUserId =
      request.headers.get('x-user-id') ??
      request.nextUrl.searchParams.get('userId') ??
      undefined;
    const mockUser = await simulateUserProfileRequest(fallbackUserId ?? undefined);
    return NextResponse.json(mockUser);
  }
}
