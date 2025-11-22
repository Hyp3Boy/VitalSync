import { mockSymptomGuide } from '@/lib/mocks/symptoms'
import { SymptomSubmissionPayload } from '@/types/symptom'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(mockSymptomGuide)
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SymptomSubmissionPayload
  console.log('Received symptom submission', body)
  return NextResponse.json(mockSymptomGuide)
}
