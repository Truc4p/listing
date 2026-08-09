"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Layers, Phone } from "lucide-react";
import { getBlobImageSrc } from "@/lib/blob-url";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const imageUrl = getBlobImageSrc(room.images?.[0]?.url);
  const isProxiedBlob = imageUrl?.startsWith("/api/blob?");

  return (
    <Link href={`/rooms/${room.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-3">
        {imageUrl ? (
          isProxiedBlob ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={room.images?.[0]?.alt ?? room.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={room.images?.[0]?.alt ?? room.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
            <Layers className="w-10 h-10 text-[#378451] opacity-30" />
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
            {room.available ? "Available" : "Rented"}
          </span>
        </div>

        {/* Heart — appears on hover */}
        <button
          className="absolute top-3 right-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.preventDefault()}
          aria-label="Save room"
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
        <p className="text-gray-500 text-sm">Son Tra, Da Nang</p>
        <p className="text-gray-500 text-sm">
          {room.type === "apartment" ? "Apartment" : "Room"} · {room.area} m²
          {room.floor ? ` · Floor ${room.floor}` : ""}
        </p>
        <div className="pt-2 space-y-1">
          <p className="text-sm font-semibold text-[#378451]">
            Contact for latest price
          </p>
          <a
            href="tel:+84389609627"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Phone className="w-3 h-3" />
            Call / Whatsapp / Telegram: 0389 609 627
          </a>
        </div>
      </div>
    </Link>
  );
}
