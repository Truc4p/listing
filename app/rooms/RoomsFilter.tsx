"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, BedDouble, Building2, SlidersHorizontal, X } from "lucide-react";
import RoomCard from "@/components/listings/RoomCard";
import type { Room } from "@/types";

type Filter = "all" | "room" | "apartment";

const categories: { value: Filter; label: string; Icon: React.ElementType }[] = [
  { value: "all", label: "All", Icon: LayoutGrid },
  { value: "room", label: "Room", Icon: BedDouble },
  { value: "apartment", label: "Apartment", Icon: Building2 },
];

interface RoomsFilterProps {
  initialRooms: Room[];
}

/** Returns true if the [checkIn, checkOut] window overlaps any blocked range */
function isBlockedDuring(room: Room, checkIn: string, checkOut: string): boolean {
  if (!room.blockedRanges || room.blockedRanges.length === 0) return false;
  return room.blockedRanges.some((r) => r.from <= checkOut && r.to >= checkIn);
}

/** Returns true if today falls inside any blocked range */
function isBlockedToday(room: Room): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return isBlockedDuring(room, today, today);
}

function formatSearchDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RoomsFilter({ initialRooms }: RoomsFilterProps) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;

  // Sync room type filter from URL (set by header search)
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "room" || typeParam === "apartment") {
      setFilter(typeParam);
    } else {
      setFilter("all");
    }
  }, [searchParams]);

  const filtered = initialRooms.filter((r) => {
    // Type filter
    if (filter !== "all" && r.type !== filter) return false;

    // Available-only toggle: must have available=true AND not blocked today
    if (availableOnly && (!r.available || isBlockedToday(r))) return false;

    // Budget filter
    if (maxPrice && r.price > maxPrice) return false;

    // Date range: hide rooms that have a blocked period overlapping the search window
    if (checkIn && checkOut && isBlockedDuring(r, checkIn, checkOut)) return false;

    return true;
  });

  const hasDateFilter = Boolean(checkIn && checkOut);
  const dateLabel = hasDateFilter
    ? `${formatSearchDate(checkIn)} – ${formatSearchDate(checkOut)}`
    : null;

  return (
    <>
      {/* Category filter bar */}
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

            <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

            {/* Available toggle */}
            <button
              onClick={() => setAvailableOnly((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
                availableOnly
                  ? "bg-[#378451] text-white border-[#378451] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Available now
            </button>

            {/* Active filter badges from header search */}
            {(dateLabel || maxPrice) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
                {dateLabel && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#378451]/10 text-[#378451] text-xs font-medium rounded-full whitespace-nowrap">
                    <X className="w-3 h-3 cursor-pointer" onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.delete("checkIn");
                      url.searchParams.delete("checkOut");
                      window.history.pushState({}, "", url.toString());
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }} />
                    {dateLabel}
                  </span>
                )}
                {maxPrice && (
                  <span className="px-3 py-1.5 bg-[#378451]/10 text-[#378451] text-xs font-medium rounded-full whitespace-nowrap">
                    Under {(maxPrice / 1_000_000).toFixed(0)}M đ
                  </span>
                )}
              </>
            )}

            {/* Result count */}
            <p className="ml-auto shrink-0 text-sm text-gray-400 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Listing grid */}
      <section className="py-10 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
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
              <h3 className="text-gray-900 font-semibold mb-1.5">No results found</h3>
              <p className="text-gray-400 text-sm">
                {hasDateFilter
                  ? "No listings are available for those dates. Try different dates or remove the date filter."
                  : "Try adjusting your filters or contact us."}
              </p>
            </div>
          )}

          {initialRooms.length === 0 && (
            <div className="mt-10 p-8 rounded-2xl border border-dashed border-gray-200 text-center">
              <Building2 className="w-7 h-7 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">No rooms yet</p>
              <p className="text-gray-400 text-sm">
                Add rooms via the{" "}
                <a href="/admin" className="text-[#378451] underline">
                  admin panel
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
