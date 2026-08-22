export interface RoomImage {
  url: string;
  alt?: string;
}

/** A date-range window during which the listing is blocked / unavailable */
export interface BlockedRange {
  from: string; // ISO date string, e.g. "2024-06-01"
  to: string;   // ISO date string, e.g. "2024-08-31"
  note?: string; // optional admin note, e.g. "Tenant moving out"
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
  /** Blocked / unavailable windows set by admin — all other dates are available */
  blockedRanges?: BlockedRange[];
  createdAt?: Date;
  updatedAt?: Date;
}
