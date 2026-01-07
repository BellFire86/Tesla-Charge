
export interface ChargingStation {
  title: string;
  uri: string;
  address?: string;
  snippets?: string[];
}

export interface SearchResult {
  text: string;
  stations: ChargingStation[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
