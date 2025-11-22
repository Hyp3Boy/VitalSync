export type LocationTag = 'home' | 'office' | 'other';

export interface UserLocationEntry {
  id: string;
  label: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  tag: LocationTag;
  isPrimary?: boolean;
}

export interface UserLocationResponse {
  items: UserLocationEntry[];
}
