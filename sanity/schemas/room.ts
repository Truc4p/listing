import { defineField, defineType } from "sanity";

export const room = defineType({
  name: "room",
  title: "Phòng / Căn hộ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tên phòng",
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
      title: "Loại",
      type: "string",
      options: {
        list: [
          { title: "Phòng trọ", value: "room" },
          { title: "Căn hộ", value: "apartment" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Giá thuê (VNĐ/tháng)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "area",
      title: "Diện tích (m²)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "floor",
      title: "Tầng",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Mô tả chi tiết",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "amenities",
      title: "Tiện nghi",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Điều hòa", value: "ac" },
          { title: "Máy nước nóng", value: "water_heater" },
          { title: "Ban công", value: "balcony" },
          { title: "Gác lửng", value: "mezzanine" },
          { title: "Tủ lạnh", value: "fridge" },
          { title: "Máy giặt", value: "washer" },
          { title: "Bếp", value: "kitchen" },
          { title: "WiFi miễn phí", value: "wifi" },
          { title: "Chỗ để xe", value: "parking" },
          { title: "An ninh 24/7", value: "security" },
          { title: "Cửa sổ thoáng", value: "window" },
          { title: "Nội thất đầy đủ", value: "furnished" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Hình ảnh",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Mô tả ảnh (alt text)",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "available",
      title: "Còn trống",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Phòng nổi bật",
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
        subtitle: `${type === "apartment" ? "Căn hộ" : "Phòng"} · ${price?.toLocaleString("vi-VN")}đ/tháng · ${available ? "Còn trống" : "Đã thuê"}`,
      };
    },
  },
});
