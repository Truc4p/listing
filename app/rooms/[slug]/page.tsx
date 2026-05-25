import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import {
  Maximize2,
  Layers,
  MapPin,
  Phone,
  MessageCircle,
  ChevronLeft,
  CheckCircle2,
  Grid2x2,
} from "lucide-react";
import { getAllRoomSlugs, getRoomBySlug, urlFor } from "@/lib/sanity";
import { AMENITY_MAP } from "@/lib/amenities";
import { RoomJsonLd } from "@/components/seo/JsonLd";
import type { Room } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllRoomSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room: Room | null = await getRoomBySlug(slug);
  if (!room) return {};

  const imageUrl = room.images?.[0]
    ? urlFor(room.images[0]).width(1200).height(630).url()
    : undefined;

  return {
    title: room.title,
    description: `${room.type === "apartment" ? "Căn hộ" : "Phòng trọ"} ${room.area}m² tại Quận 1, TP.HCM. Giá ${room.price.toLocaleString("vi-VN")}đ/tháng.`,
    openGraph: {
      title: `${room.title} | Căn Hộ Thanh Hà`,
      description: `${room.type === "apartment" ? "Căn hộ" : "Phòng"} ${room.area}m² · ${room.price.toLocaleString("vi-VN")}đ/tháng`,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const room: Room | null = await getRoomBySlug(slug);
  if (!room) notFound();

  const images = room.images ?? [];
  const mainImg = images[0]
    ? urlFor(images[0]).width(1200).height(800).fit("crop").url()
    : null;
  const thumbUrls = images.slice(1, 5).map((img) =>
    urlFor(img).width(600).height(400).fit("crop").url()
  );

  const descriptionText = `${room.type === "apartment" ? "Căn hộ" : "Phòng trọ"} ${room.area}m², tầng ${room.floor ?? "?"}. Giá ${room.price.toLocaleString("vi-VN")}đ/tháng.`;

  return (
    <>
      {room.images?.[0] && (
        <RoomJsonLd
          title={room.title}
          description={descriptionText}
          price={room.price}
          area={room.area}
          type={room.type}
          slug={slug}
          imageUrl={mainImg ?? undefined}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link
            href="/rooms"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Phòng &amp; Căn hộ
          </Link>
        </nav>

        {/* Title (above photos, like Airbnb) */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-5">
          {room.title}
        </h1>

        {/* ── Photo grid ─────────────────────────────────────── */}
        {images.length === 0 ? (
          <div className="h-80 rounded-2xl bg-gray-100 flex items-center justify-center mb-8">
            <Layers className="w-12 h-12 text-gray-300" />
          </div>
        ) : (
          <div className="relative mb-8">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-[420px] rounded-2xl overflow-hidden">
              {/* Main image — spans 2 cols × 2 rows */}
              <div className="col-span-2 row-span-2 relative bg-gray-100">
                {mainImg && (
                  <Image
                    src={mainImg}
                    alt={room.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 50vw, 600px"
                  />
                )}
              </div>

              {/* Thumbnails — up to 4 */}
              {thumbUrls.map((url, i) => (
                <div key={i} className="relative bg-gray-100">
                  <Image
                    src={url}
                    alt={`${room.title} – ảnh ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 300px"
                  />
                </div>
              ))}

              {/* Fill empty thumb slots so grid stays intact */}
              {Array.from({ length: Math.max(0, 4 - thumbUrls.length) }).map(
                (_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-100" />
                )
              )}
            </div>

            {/* Show all photos button */}
            {images.length > 1 && (
              <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-900 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors">
                <Grid2x2 className="w-4 h-4" />
                Xem tất cả {images.length} ảnh
              </button>
            )}
          </div>
        )}

        {/* ── Body layout ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Meta row */}
            <div className="pb-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    room.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {room.available ? "Còn trống" : "Đã thuê"}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#378451]">
                  {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" />
                  {room.area} m²
                </span>
                {room.floor && (
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    Tầng {room.floor}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
            </div>

            {/* Description */}
            {room.description && room.description.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mô tả chi tiết
                </h2>
                <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed text-sm">
                  <PortableText value={room.description} />
                </div>
              </div>
            )}

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Tiện nghi
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((key) => {
                    const info = AMENITY_MAP[key];
                    if (!info) return null;
                    const { Icon, label } = info;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 py-3 border-b border-gray-100"
                      >
                        <Icon className="w-5 h-5 text-gray-700 shrink-0" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Vị trí
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                123 Đường Thanh Hà, Phường 1, Quận 1, TP. Hồ Chí Minh
              </p>
              <div className="rounded-2xl overflow-hidden border border-gray-100 h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197607!2d106.69585107480527!3d10.777620989376826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf7e042!2zUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí"
                />
              </div>
            </div>
          </div>

          {/* Right — sticky price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="border border-gray-200 rounded-2xl shadow-xl p-6">
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-semibold text-gray-900">
                    {room.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-gray-500 text-sm">/tháng</span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className={`w-2 h-2 rounded-full ${room.available ? "bg-emerald-500" : "bg-gray-400"}`}
                  />
                  <span className="text-sm text-gray-600">
                    {room.available ? "Còn trống, sẵn sàng cho thuê" : "Hiện đã có người thuê"}
                  </span>
                </div>

                {/* Key facts */}
                <ul className="space-y-2.5 mb-6 pb-6 border-b border-gray-100">
                  <li className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#378451] shrink-0" />
                    Diện tích {room.area} m²
                  </li>
                  {room.floor && (
                    <li className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#378451] shrink-0" />
                      Tầng {room.floor}
                    </li>
                  )}
                  <li className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#378451] shrink-0" />
                    {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"}
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#378451] shrink-0" />
                    Quận 1, TP. Hồ Chí Minh
                  </li>
                </ul>

                {/* CTAs */}
                <div className="space-y-3">
                  <Link
                    href={`/contact?room=${encodeURIComponent(room.title)}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#378451] hover:bg-[#2D6B42] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Liên hệ tư vấn
                  </Link>
                  <a
                    href="tel:+84909000000"
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-500 text-gray-700 font-semibold py-3.5 rounded-xl text-sm transition-colors hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4" />
                    Gọi ngay: 0909 000 000
                  </a>
                </div>

                <p className="mt-4 text-xs text-gray-400 text-center">
                  Liên hệ để xác nhận phòng còn trống trước khi đến xem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
