import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function getFeaturedRooms() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return client.fetch(
    `*[_type == "room" && featured == true] | order(_createdAt desc) [0...6] {
      _id, title, slug, type, price, area, floor, available,
      "mainImage": images[0]
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getAllRooms() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return client.fetch(
    `*[_type == "room"] | order(_createdAt desc) {
      _id, title, slug, type, price, area, floor, available,
      "mainImage": images[0]
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}

export async function getRoomBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  return client.fetch(
    `*[_type == "room" && slug.current == $slug][0] {
      _id, title, slug, type, price, area, floor, available, featured,
      description, images, amenities
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getAllRoomSlugs(): Promise<{ slug: string }[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  return client.fetch(
    `*[_type == "room"] { "slug": slug.current }`,
    {},
    { next: { revalidate: 3600 } }
  );
}
