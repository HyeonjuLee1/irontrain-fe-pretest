export interface Address {
  id: number;
  street: string;
  streetName: string;
  buildingNumber: string;
  city: string;
  zipcode: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
};

export interface PersonInfo {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender?: string;
  address?: Address;
  uniqueId: string;
}

export interface SortConfig {
  key: keyof PersonInfo; 
  direction: "asc" | "desc";
};