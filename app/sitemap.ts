import type { MetadataRoute } from "next";
import { getAllRoomSlugs } from "@/lib/sanity";

const BASE_URL = "https://thanh-ha-apartment.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllRoomSlugs();

  const roomUrls = slugs.map(({ slug }) => ({
    url: `${BASE_URL}/rooms/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/rooms`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...roomUrls,
  ];
}
