export interface RoomImage {
  url: string;
  alt?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
