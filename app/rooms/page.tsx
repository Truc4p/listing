"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, BedDouble, Building2, SlidersHorizontal } from "lucide-react";
import RoomCard from "@/components/listings/RoomCard";
import type { Room } from "@/types";

type Filter = "all" | "room" | "apartment";

const categories: { value: Filter; label: string; Icon: React.ElementType }[] = [
  { value: "all", label: "Tất cả", Icon: LayoutGrid },
  { value: "room", label: "Phòng trọ", Icon: BedDouble },
  { value: "apartment", label: "Căn hộ", Icon: Building2 },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => setRooms(data))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter((r) => {
    if (filter !== "all" && r.type !== filter) return false;
    if (availableOnly && !r.available) return false;
    return true;
  });

  return (
    <>
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
          Phòng &amp; Căn hộ cho thuê
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Quận 1, TP. Hồ Chí Minh · {rooms.length} chỗ ở
        </p>
      </div>

      {/* Category filter bar — Airbnb-style */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {/* Category pills */}
            <div className="flex gap-2 shrink-0">
              {categories.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
                    filter === value
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

            {/* Available toggle */}
            <button
              onClick={() => setAvailableOnly((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
                availableOnly
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Còn trống
            </button>

            {/* Result count */}
            {!loading && (
              <p className="ml-auto shrink-0 text-sm text-gray-400 whitespace-nowrap">
                {filtered.length} kết quả
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Listing grid */}
      <section className="py-10 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-4/3 rounded-2xl bg-gray-100 animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-28">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1.5">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-400 text-sm">
                Thử thay đổi bộ lọc hoặc liên hệ với chúng tôi.
              </p>
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="mt-10 p-8 rounded-2xl border border-dashed border-gray-200 text-center">
              <Building2 className="w-7 h-7 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                Chưa có dữ liệu phòng
              </p>
              <p className="text-gray-400 text-sm">
                Kết nối Sanity CMS và thêm phòng qua{" "}
                <a href="/studio" className="text-[#378451] underline">
                  /studio
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
