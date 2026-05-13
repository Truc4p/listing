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
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { getAllRoomSlugs, getRoomBySlug, urlFor } from "@/lib/sanity";
import { AMENITY_MAP } from "@/lib/amenities";
import { RoomJsonLd } from "@/components/seo/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const mainImageUrl = images[0]
    ? urlFor(images[0]).width(1200).height(700).fit("crop").url()
    : null;

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
          imageUrl={mainImageUrl ?? undefined}
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-[#faf7f2] border-b border-[#e8ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#9a8a7a] uppercase tracking-wide">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/rooms"
              className="hover:text-[#c9a84c] transition-colors"
            >
              Phòng & Căn hộ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1a1a1a] font-medium truncate max-w-xs">
              {room.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main image */}
            <div className="relative overflow-hidden bg-[#f5ede0] aspect-video">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={room.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Layers className="w-16 h-16 text-[#c9a84c] opacity-20" />
                </div>
              )}
              {/* Gold corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a84c]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a84c]" />
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-16 overflow-hidden shrink-0 border border-[#e8ddd0] hover:border-[#c9a84c] transition-colors"
                  >
                    <Image
                      src={urlFor(img).width(192).height(128).fit("crop").url()}
                      alt={img.alt || `Ảnh ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title + meta */}
            <div className="border-l-2 border-[#c9a84c] pl-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-medium uppercase tracking-[3px] border border-[#c9a84c] text-[#c9a84c] px-2.5 py-1">
                  {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"}
                </span>
                <span
                  className={`text-[10px] font-medium uppercase tracking-[3px] px-2.5 py-1 ${
                    room.available
                      ? "bg-emerald-500 text-white"
                      : "bg-[#9a8a7a] text-white"
                  }`}
                >
                  {room.available ? "Còn trống" : "Đã thuê"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-[#1a1a1a] tracking-tight mb-4">
                {room.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-xs text-[#9a8a7a] uppercase tracking-wide">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#c9a84c]" />
                  {room.area} m²
                </span>
                {room.floor && (
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#c9a84c]" />
                    Tầng {room.floor}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c9a84c]" />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
            </div>

            {/* Description */}
            {room.description && room.description.length > 0 && (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[4px] text-[#c9a84c] mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#c9a84c]" />
                  Mô tả chi tiết
                </h2>
                <div className="prose prose-slate max-w-none text-[#6b6b6b] leading-relaxed font-light">
                  <PortableText value={room.description} />
                </div>
              </div>
            )}

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[4px] text-[#c9a84c] mb-5 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#c9a84c]" />
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
                        className="flex items-center gap-3 p-3 border border-[#e8ddd0] hover:border-[#c9a84c] transition-colors"
                      >
                        <Icon className="w-4 h-4 text-[#c9a84c] shrink-0" />
                        <span className="text-sm text-[#4a3f35] font-light">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky contact card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="border border-[#e8ddd0] bg-white p-7">
                {/* Gold top accent */}
                <div className="h-0.5 bg-[#c9a84c] -mx-7 -mt-7 mb-7" />

                <p className="text-[10px] font-medium uppercase tracking-[4px] text-[#9a8a7a] mb-2">
                  Giá thuê
                </p>
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#f0e9e0]">
                  <span className="text-3xl font-semibold text-[#c9a84c]">
                    {room.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-[#9a8a7a] text-sm font-light">
                    /tháng
                  </span>
                </div>

                <ul className="space-y-2.5 mb-7 text-sm">
                  <li className="flex items-center gap-2.5 text-[#6b6b6b]">
                    <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                    Diện tích {room.area} m²
                  </li>
                  {room.floor && (
                    <li className="flex items-center gap-2.5 text-[#6b6b6b]">
                      <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                      Tầng {room.floor}
                    </li>
                  )}
                  <li className="flex items-center gap-2.5 text-[#6b6b6b]">
                    <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                    Quận 1, TP. Hồ Chí Minh
                  </li>
                </ul>

                <div className="space-y-3">
                  <Link
                    href={`/contact?room=${encodeURIComponent(room.title)}`}
                    className={cn(
                      buttonVariants(),
                      "w-full bg-[#c9a84c] hover:bg-[#b8963e] text-white border-0 rounded-sm font-medium tracking-wide justify-center"
                    )}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Liên hệ tư vấn
                  </Link>
                  <a
                    href="tel:+84909000000"
                    className="flex items-center justify-center gap-2 w-full h-9 border border-[#1a1a1a] text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Gọi ngay: 0909 000 000
                  </a>
                </div>
              </div>

              <div className="p-4 border border-[#e8ddd0] bg-[#faf7f2] text-xs text-[#9a8a7a] font-light leading-relaxed">
                <span className="text-[#c9a84c] font-medium">Lưu ý: </span>
                Vui lòng liên hệ để xác nhận phòng còn trống trước khi đến
                xem trực tiếp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
