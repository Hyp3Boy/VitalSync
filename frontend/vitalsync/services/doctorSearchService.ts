export interface DoctorSearchPayload {
  body: {
    specialty?: string
    name?: string
    top_k: number
  }
}

export interface DoctorSearchResultItem {
  id: string
  cmp: string
  status: string
  name: string
  specialties: string[]
  n_comments: number
  sc_acum: number
}

export interface DoctorSearchResponse {
  results: DoctorSearchResultItem[]
}

export const searchDoctors = async (payload: DoctorSearchPayload): Promise<DoctorSearchResponse> => {
  const res = await fetch('/api/doctor/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('No se pudo buscar doctores')
  return (await res.json()) as DoctorSearchResponse
}