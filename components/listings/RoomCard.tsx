import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize2, Layers, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const imageUrl = room.mainImage
    ? urlFor(room.mainImage).width(800).height(500).fit("crop").url()
    : null;

  return (
    <div className="group bg-white border border-[#e8ddd0] hover:border-[#c9a84c] transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a84c]/8">
      {/* Image */}
      <div className="relative h-56 bg-[#f5ede0] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={room.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#f5ede0] flex items-center justify-center">
            <Layers className="w-10 h-10 text-[#c9a84c] opacity-30" />
          </div>
        )}

        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium uppercase tracking-[3px] bg-white/90 text-[#c9a84c] px-2.5 py-1">
            {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"}
          </span>
        </div>

        {/* Availability dot */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-medium uppercase tracking-[2px] px-2.5 py-1 ${
              room.available
                ? "bg-emerald-500 text-white"
                : "bg-[#1a1a1a]/70 text-white/70"
            }`}
          >
            {room.available ? "Còn trống" : "Đã thuê"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-[#1a1a1a] text-[15px] leading-snug mb-3 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
          {room.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-[#9a8a7a] mb-5 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            {room.area} m²
          </span>
          {room.floor && (
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Tầng {room.floor}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Quận 1
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f0e9e0]">
          <div>
            <span className="text-lg font-bold text-[#c9a84c]">
              {room.price.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-xs text-[#9a8a7a] ml-1">/tháng</span>
          </div>
          <Link
            href={`/rooms/${room.slug.current}`}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#1a1a1a] hover:text-[#c9a84c] transition-colors"
          >
            Xem chi tiết
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
