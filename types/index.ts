export interface RoomImage {
  url: string;
  alt?: string;
}

/** A single date-range window during which the listing is available */
export interface AvailabilityRange {
  from: string; // ISO date string, e.g. "2024-06-01"
  to: string;   // ISO date string, e.g. "2024-08-31"
  note?: string; // optional admin note, e.g. "summer season"
}

export interface Room {
  _id: string;
  title: string;
  slug: string;
  type: "room" | "apartment";
  price: number;
  area: number;
  floor?: number;
  description?: string;
  amenities?: string[];
  images?: RoomImage[];
  available: boolean;
  featured: boolean;
  order?: number;
  /** Explicit availability windows set by admin (Airbnb-style) */
  availabilityRanges?: AvailabilityRange[];
  createdAt?: Date;
  updatedAt?: Date;
}
