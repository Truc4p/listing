import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";

export interface SanityImage extends Image {
  alt?: string;
}

export interface Room {
  _id: string;
  title: string;
  slug: { current: string };
  type: "room" | "apartment";
  price: number;
  area: number;
  floor?: number;
  description?: PortableTextBlock[];
  amenities?: string[];
  images?: SanityImage[];
  mainImage?: SanityImage;
  available: boolean;
  featured: boolean;
}
