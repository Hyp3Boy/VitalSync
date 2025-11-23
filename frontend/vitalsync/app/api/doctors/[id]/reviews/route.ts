import api from '@/lib/api';
import { mockDoctorDetails } from '@/lib/mocks/doctorDetails';
import { DoctorReview } from '@/types/doctor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = (await request.json()) as Omit<DoctorReview, 'id' | 'createdAt'>;

  try {
    const response = await api.post<DoctorReview>(`/doctors/${id}/reviews`, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.warn('Falling back to mock doctor review creation', error);
    const bucket = mockDoctorDetails[id];
    if (!bucket) {
      return NextResponse.json({ message: 'Doctor no encontrado' }, { status: 404 });
    }
    const newReview: DoctorReview = {
      id: `${id}-review-${Date.now()}`,
      doctorId: id,
      authorName: body.authorName,
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };
    bucket.reviews.unshift(newReview);
    return NextResponse.json(newReview, { status: 201 });
  }
}
