import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize2, Layers, ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const imageUrl = room.mainImage
    ? urlFor(room.mainImage).width(800).height(600).fit("crop").url()
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-4/3 bg-linear-to-br from-[#f5ede0] to-[#e8d5be] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={room.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="w-12 h-12 text-[#c9a84c] opacity-20" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium uppercase tracking-[2px] bg-white/90 backdrop-blur-sm text-[#c9a84c] px-2.5 py-1 rounded-full">
            {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"}
          </span>
        </div>

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-medium uppercase tracking-[2px] px-2.5 py-1 rounded-full backdrop-blur-sm ${
              room.available
                ? "bg-emerald-500/90 text-white"
                : "bg-black/50 text-white/70"
            }`}
          >
            {room.available ? "Còn trống" : "Đã thuê"}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-[#c9a84c] text-white px-3 py-1.5 rounded-lg shadow-lg">
            <span className="font-bold text-sm">{room.price.toLocaleString("vi-VN")}đ</span>
            <span className="text-white/75 text-xs ml-1">/tháng</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[#1a1a1a] text-base leading-snug mb-3 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
          {room.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-[#9a8a7a] mb-4">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-[#c9a84c]" />
            {room.area} m²
          </span>
          {room.floor && (
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#c9a84c]" />
              Tầng {room.floor}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#c9a84c]" />
            Quận 1
          </span>
        </div>

        <Link
          href={`/rooms/${room.slug.current}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#faf7f2] hover:bg-[#c9a84c] text-[#6b6b6b] hover:text-white text-xs font-medium uppercase tracking-widest transition-all duration-300 rounded-xl"
        >
          Xem chi tiết
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
