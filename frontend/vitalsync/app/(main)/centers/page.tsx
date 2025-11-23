'use client'

import MapboxMap, { MapboxMapHandle } from '@/components/features/location/MapboxMap'
import ClinicCard, { type Clinic } from '@/components/ui/ClinicCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useLocationStore } from '@/store/useLocationStore'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function CentersPage() {
  const userLocation = useLocationStore((s) => s.location)
  const [km, setKm] = useState(5)
  const [name, setName] = useState('')
  const [centers, setCenters] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<MapboxMapHandle | null>(null)

  const topK = Math.max(10, Math.min(100, km * 5))
  const DISTANCE_OPTIONS = [1, 3, 5, 10, 15]
  const [page, setPage] = useState(1)
  const perPage = 6

  const totalPages = Math.max(1, Math.ceil(centers.length / perPage))
  const start = (page - 1) * perPage
  const pagedCenters = centers.slice(start, start + perPage)
  const markers = useMemo(
    () =>
      pagedCenters.map((c) => ({ id: c.id, latitude: c.latitude!, longitude: c.longitude!, label: c.name.split(' - ')[0] })),
    [pagedCenters]
  )

  const fetchCenters = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/centers/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: {
            name: name || undefined,
            location: userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : undefined,
            top_k: topK,
          },
        }),
      })
      const json = await res.json()
      const items = (json?.data ?? []).map((row: any, idx: number) => {
        const datos = row?.p_crCURSOR_DATOS?.[0] ?? {}
        const latitude = Number(datos?.ESTABLECIMIENTO_LATITUD ?? userLocation?.latitude ?? -12.046374)
        const longitude = Number(datos?.ESTABLECIMIENTO_LONGITUD ?? userLocation?.longitude ?? -77.042793)
        const specialties = Array.isArray(row?.p_crCURSOR_ESPECIALIDES)
          ? row.p_crCURSOR_ESPECIALIDES.map((e: any) => String(e?.NOMBRE)).filter(Boolean)
          : []
        const services = Array.isArray(row?.P_CURSORCARTERA)
          ? row.P_CURSORCARTERA.map((e: any) => String(e?.NOMBRE)).filter(Boolean)
          : []
        return {
          id: String(row?.p_vCO_IPRESS ?? idx),
          name: String(datos?.ESTABLECIMIENTO_NOMBRE ?? 'Centro de Salud'),
          address: String(datos?.ESTABLECIMIENTO_DIRECCION ?? ''),
          distance: `${km} km`,
          type: 'Hospital' as const,
          latitude,
          longitude,
          phone: String(datos?.ESTABLECIMIENTO_TELEFONO ?? ''),
          hours: String(datos?.ADICIONAL_HORATENCION ?? ''),
          specialties,
          services,
        } as Clinic
      }) as Clinic[]
      setCenters(items)
      setPage(1)
      if (items[0]?.latitude && items[0]?.longitude) {
        mapRef.current?.flyTo({ latitude: items[0].latitude, longitude: items[0].longitude, zoom: 13 })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCenters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [km, name, userLocation?.latitude, userLocation?.longitude])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-3">
            <Input placeholder="Nombre del centro" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-muted-foreground">Radio de búsqueda</p>
              <ToggleGroup
                type="single"
                value={String(km)}
                onValueChange={(value) => {
                  if (!value) return;
                  setKm(Number(value));
                }}
                className="rounded-full border border-border/70 bg-card px-1 py-1"
              >
                {DISTANCE_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={String(option)}
                    className="rounded-full px-3 py-1 text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-white"
                  >
                    {option} km
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Button onClick={fetchCenters} disabled={isLoading}>Buscar</Button>
            </div>
          </div>
          <div className="space-y-3">
            {pagedCenters.map((c) => (
              <ClinicCard
                key={c.id}
                clinic={c}
                onSelect={(clinic) => clinic.latitude && clinic.longitude && mapRef.current?.flyTo({ latitude: clinic.latitude, longitude: clinic.longitude, zoom: 14 })}
              />
            ))}
            {centers.length > perPage && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className={cn('border-border', page === 1 && 'pointer-events-none opacity-50')}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage((p) => Math.max(1, p - 1))
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === page}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(pageNumber)
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className={cn('border-border', page === totalPages && 'pointer-events-none opacity-50')}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage((p) => Math.min(totalPages, p + 1))
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <MapboxMap
            ref={mapRef}
            initialViewState={{
              latitude: userLocation?.latitude ?? -12.046374,
              longitude: userLocation?.longitude ?? -77.042793,
              zoom: 12,
            }}
            markers={markers}
            userLocation={userLocation ? { latitude: userLocation.latitude!, longitude: userLocation.longitude! } : undefined}
            className="h-[560px] rounded-2xl"
          />
        </div>
      </div>
    </div>
  )
}