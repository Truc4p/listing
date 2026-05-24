import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Layers } from "lucide-react";
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
    <Link href={`/rooms/${room.slug.current}`} className="group block">
      {/* Image */}
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={room.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-rose-50">
            <Layers className="w-10 h-10 text-[#FF385C] opacity-30" />
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              room.available
                ? "bg-white/95 text-gray-800 shadow-sm"
                : "bg-gray-900/70 backdrop-blur-sm text-white/80"
            }`}
          >
            {room.available ? "Còn trống" : "Đã thuê"}
          </span>
        </div>

        {/* Heart — appears on hover */}
        <button
          className="absolute top-3 right-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.preventDefault()}
          aria-label="Lưu phòng"
        >
          <Heart
            className="w-5 h-5 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-0.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-1 flex-1">
            {room.title}
          </p>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">4.9</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">Quận 1, TP. Hồ Chí Minh</p>
        <p className="text-gray-500 text-sm">
          {room.type === "apartment" ? "Căn hộ" : "Phòng trọ"} · {room.area} m²
          {room.floor ? ` · Tầng ${room.floor}` : ""}
        </p>
        <p className="pt-1.5 text-gray-900 text-sm">
          <span className="font-semibold">
            {room.price.toLocaleString("vi-VN")}đ
          </span>{" "}
          <span className="text-gray-500 font-normal">/tháng</span>
        </p>
      </div>
    </Link>
  );
}
