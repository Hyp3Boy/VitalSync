interface MapboxFeatureContext {
  id: string;
  text: string;
  properties?: {
    short_code?: string;
  };
}

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  context?: MapboxFeatureContext[];
  properties?: {
    address?: string;
    category?: string;
  };
}

interface MapboxGeocodingResponse {
  features: MapboxFeature[];
}

export interface MapboxGeocodeResult {
  id: string;
  label: string;
  addressLine: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const MAPBOX_GEOCODING_URL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places';

const getContextValue = (
  context: MapboxFeatureContext[] | undefined,
  prefix: string
) => {
  if (!context) return undefined;
  const match = context.find((item) => item.id.startsWith(prefix));
  return match?.text;
};

const transformFeature = (feature: MapboxFeature): MapboxGeocodeResult => {
  const [longitude, latitude] = feature.center;
  const city =
    getContextValue(feature.context, 'place') ??
    getContextValue(feature.context, 'district');
  const region = getContextValue(feature.context, 'region');
  const country = getContextValue(feature.context, 'country');
  const postalCode = getContextValue(feature.context, 'postcode');

  return {
    id: feature.id,
    label: feature.text,
    addressLine: feature.place_name,
    city,
    region,
    country,
    postalCode,
    coordinates: {
      latitude,
      longitude,
    },
  };
};

export const searchLocations = async (
  query: string,
  options?: { limit?: number; signal?: AbortSignal }
): Promise<MapboxGeocodeResult[]> => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      'Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN para habilitar la búsqueda.'
    );
  }

  const params = new URLSearchParams({
    access_token: accessToken,
    language: 'es',
    limit: String(options?.limit ?? 5),
    autocomplete: 'true',
    types: 'address,place,region,postcode',
  });

  const response = await fetch(
    `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?${params.toString()}`,
    {
      signal: options?.signal,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener resultados de Mapbox.');
  }

  const data = (await response.json()) as MapboxGeocodingResponse;
  return data.features.map(transformFeature);
};

export const reverseGeocode = async (
  coordinates: { latitude: number; longitude: number },
  options?: { signal?: AbortSignal }
): Promise<MapboxGeocodeResult | null> => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      'Configura NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN para habilitar la búsqueda.'
    );
  }

  const params = new URLSearchParams({
    access_token: accessToken,
    language: 'es',
    limit: '1',
  });

  const response = await fetch(
    `${MAPBOX_GEOCODING_URL}/${coordinates.longitude},${coordinates.latitude}.json?${params.toString()}`,
    {
      signal: options?.signal,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener la dirección del punto seleccionado.');
  }

  const data = (await response.json()) as MapboxGeocodingResponse;
  if (!data.features.length) return null;
  return transformFeature(data.features[0]);
};
