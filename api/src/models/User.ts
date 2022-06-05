export interface UserDB {
  id: string;
  phone_number: string;
  last_update_at: string;
  last_area?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  lastUpdateAt: string;
  lastArea?: string;
  latitude?: number;
  longitude?: number;
}
