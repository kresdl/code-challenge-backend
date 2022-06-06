export interface UserDB {
  id: string;
  phone_number: string;
  last_update_at: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  lastUpdateAt: string;
  latitude?: number;
  longitude?: number;
}
