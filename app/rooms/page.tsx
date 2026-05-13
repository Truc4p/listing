"use client";

import { useEffect, useState } from "react";
import { Search, Building2 } from "lucide-react";
import RoomCard from "@/components/listings/RoomCard";
import type { Room } from "@/types";

type Filter = "all" | "room" | "apartment";

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

  const filterBtns: { value: Filter; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "room", label: "Phòng trọ" },
    { value: "apartment", label: "Căn hộ" },
  ];

  return (
    <>
      {/* Page hero */}
      <section className="bg-[#faf7f2] py-16 border-b border-[#e8ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px]">
              Danh sách
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light text-[#1a1a1a] tracking-tight">
            Phòng & Căn Hộ{" "}
            <span className="font-heading font-semibold italic">Cho Thuê</span>
          </h1>
          <p className="text-[#9a8a7a] font-light mt-2 max-w-xl">
            Khám phá các lựa chọn phòng trọ và căn hộ được chọn lọc kỹ lưỡng
            tại Căn Hộ Thanh Hà.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-30 bg-white border-b border-[#e8ddd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 py-3">
            <div className="flex gap-1">
              {filterBtns.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-5 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                    filter === value
                      ? "bg-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/25"
                      : "text-[#9a8a7a] bg-[#f5ede0] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-[#9a8a7a] cursor-pointer select-none uppercase tracking-wide">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded accent-[#c9a84c]"
                />
                Chỉ còn trống
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#faf7f2] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-[#f0e8dc] animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <p className="text-xs text-[#9a8a7a] uppercase tracking-widest mb-8">
                {filtered.length} kết quả
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-28">
              <div className="w-14 h-14 border border-[#e8ddd0] flex items-center justify-center mx-auto mb-5">
                <Search className="w-6 h-6 text-[#c9a84c] opacity-50" />
              </div>
              <h3 className="text-[#1a1a1a] font-medium mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-[#9a8a7a] text-sm font-light">
                Thử thay đổi bộ lọc hoặc liên hệ với chúng tôi.
              </p>
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="mt-10 p-8 border border-[#e8ddd0] bg-white text-center">
              <Building2 className="w-7 h-7 text-[#c9a84c] mx-auto mb-3 opacity-60" />
              <p className="text-[#1a1a1a] font-medium mb-1">
                Chưa có dữ liệu phòng
              </p>
              <p className="text-[#9a8a7a] text-sm font-light">
                Kết nối Sanity CMS và thêm phòng qua{" "}
                <a href="/studio" className="text-[#c9a84c] underline">
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
