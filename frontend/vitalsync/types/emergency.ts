export interface EmergencyCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  phone: string;
  availableBeds: number;
  waitTimeMinutes: number;
  tags?: string[];
}
