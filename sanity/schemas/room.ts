import { defineField, defineType } from "sanity";

export const room = defineType({
  name: "room",
  title: "Room / Apartment",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Room name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Room", value: "room" },
          { title: "Apartment", value: "apartment" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Rent (VND/month)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "area",
      title: "Floor area (m²)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "floor",
      title: "Floor",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Air conditioning", value: "ac" },
          { title: "Water heater", value: "water_heater" },
          { title: "Balcony", value: "balcony" },
          { title: "Mezzanine", value: "mezzanine" },
          { title: "Refrigerator", value: "fridge" },
          { title: "Washing machine", value: "washer" },
          { title: "Kitchen", value: "kitchen" },
          { title: "Free WiFi", value: "wifi" },
          { title: "Parking", value: "parking" },
          { title: "24/7 security", value: "security" },
          { title: "Ventilated windows", value: "window" },
          { title: "Fully furnished", value: "furnished" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Image description (alt text)",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      price: "price",
      type: "type",
      available: "available",
    },
    prepare({ title, media, price, type, available }) {
      return {
        title,
        media,
        subtitle: `${type === "apartment" ? "Apartment" : "Room"} · ${price?.toLocaleString("en-US")}₫/month · ${available ? "Available" : "Rented"}`,
      };
    },
  },
});
