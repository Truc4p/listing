"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { BlockedRange } from "@/types";

interface Props {
  blockedRanges: BlockedRange[];
  roomTitle: string;
  roomSlug: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ─── date helpers ──────────────────────────────────────────────── */

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayIso(): string {
  const t = new Date();
  return toIso(t.getFullYear(), t.getMonth(), t.getDate());
}

function isBlockedDay(iso: string, ranges: BlockedRange[]): boolean {
  return ranges.some((r) => iso >= r.from && iso <= r.to);
}

/** True if ANY day in [from, to] is blocked */
function rangeHasBlockedDay(from: string, to: string, ranges: BlockedRange[]): boolean {
  return ranges.some((r) => r.from <= to && r.to >= from);
}

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function diffDays(from: string, to: string): number {
  return Math.round(
    (new Date(to + "T00:00:00").getTime() - new Date(from + "T00:00:00").getTime()) /
      86_400_000
  );
}

function fmtLong(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtShort(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

/* ─── MonthGrid ─────────────────────────────────────────────────── */

interface MonthGridProps {
  year: number;
  month: number;
  blockedRanges: BlockedRange[];
  checkIn: string | null;
  checkOut: string | null;
  hovered: string | null;
  onDayClick: (iso: string) => void;
  onDayHover: (iso: string | null) => void;
}

function MonthGrid({
  year, month, blockedRanges,
  checkIn, checkOut, hovered,
  onDayClick, onDayHover,
}: MonthGridProps) {
  const cells = buildMonthGrid(year, month);
  const today = todayIso();

  // Effective end of highlighted range (hover or confirmed checkOut)
  const rangeEnd = checkIn && !checkOut && hovered && hovered > checkIn ? hovered : checkOut;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 text-center mb-4">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-y-0.5">
        {DAYS.map((d) => (
          <div key={d} className="text-[11px] font-semibold text-gray-400 text-center pb-2">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const iso = toIso(year, month, day);
          const isPast = iso < today;
          const isBlocked = isBlockedDay(iso, blockedRanges);
          const disabled = isPast || isBlocked;

          const isCheckIn = iso === checkIn;
          const isCheckOut = iso === checkOut;
          const isEndpoint = isCheckIn || isCheckOut;

          // In-range highlighting
          const inRange =
            checkIn && rangeEnd && iso > checkIn && iso < rangeEnd;

          // If we only have checkIn and user is hovering, show a preview range
          const isPreview =
            checkIn && !checkOut && hovered && hovered > checkIn &&
            iso > checkIn && iso <= hovered;

          return (
            <div
              key={iso}
              className={[
                "relative flex items-center justify-center h-10",
                // Range background band
                (inRange || isPreview) && !disabled
                  ? "bg-[#378451]/10"
                  : "",
                // Left cap for check-in
                isCheckIn && rangeEnd ? "rounded-l-full" : "",
                // Right cap for check-out / hover end
                (isCheckOut || (checkIn && !checkOut && hovered === iso)) ? "rounded-r-full" : "",
              ].filter(Boolean).join(" ")}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onDayClick(iso)}
                onMouseEnter={() => !disabled && onDayHover(iso)}
                onMouseLeave={() => onDayHover(null)}
                className={[
                  "w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors relative z-10",
                  disabled
                    ? "text-gray-300 line-through cursor-not-allowed"
                    : isEndpoint
                    ? "bg-[#378451] text-white font-semibold shadow"
                    : "font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer",
                ].join(" ")}
                aria-label={iso}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export default function AvailabilityCalendar({ blockedRanges, roomTitle }: Props) {
  const now = new Date();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Seed initial state from URL query params so browser back preserves selection
  const initialCheckIn = searchParams.get("checkIn") ?? null;
  const initialCheckOut = searchParams.get("checkOut") ?? null;

  // If the stored checkIn is in the future and valid, start the calendar there
  const initialMonth = (() => {
    if (initialCheckIn) {
      const d = new Date(initialCheckIn + "T00:00:00");
      if (!isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth() };
    }
    return { year: now.getFullYear(), month: now.getMonth() };
  })();

  const [leftYear, setLeftYear] = useState(initialMonth.year);
  const [leftMonth, setLeftMonth] = useState(initialMonth.month);
  const [checkIn, setCheckIn] = useState<string | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<string | null>(initialCheckOut);
  const [hovered, setHovered] = useState<string | null>(null);

  // Keep URL in sync with selected dates so browser back restores them
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (checkIn) {
      params.set("checkIn", checkIn);
    } else {
      params.delete("checkIn");
    }
    if (checkOut) {
      params.set("checkOut", checkOut);
    } else {
      params.delete("checkOut");
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

  const right = addMonths(leftYear, leftMonth, 1);

  const canGoPrev =
    leftYear > now.getFullYear() ||
    (leftYear === now.getFullYear() && leftMonth > now.getMonth());

  const handleDayClick = useCallback((iso: string) => {
    // If nothing selected, or both already selected → start fresh check-in
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    // checkIn set but no checkOut
    if (iso <= checkIn) {
      // Clicked same day or earlier → reset to new check-in
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    // Would the range cross a blocked day?
    if (rangeHasBlockedDay(checkIn, iso, blockedRanges)) {
      // Reset; start a new check-in at clicked day
      setCheckIn(iso);
      setCheckOut(null);
      return;
    }
    setCheckOut(iso);
  }, [checkIn, checkOut, blockedRanges]);

  function clearDates() {
    setCheckIn(null);
    setCheckOut(null);
    setHovered(null);
  }

  const nights = checkIn && checkOut ? diffDays(checkIn, checkOut) : null;

  const contactHref = `/contact?room=${encodeURIComponent(roomTitle)}${
    checkIn ? `&checkIn=${checkIn}` : ""
  }${checkOut ? `&checkOut=${checkOut}` : ""}`;

  return (
    <div className="pb-8 border-b border-gray-200">
      {/* Header */}
      {checkIn ? (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {nights
              ? `${nights} night${nights !== 1 ? "s" : ""}`
              : "Select check-out date"}
          </h2>
          <p className="text-sm text-gray-400">
            {checkIn && checkOut
              ? `${fmtLong(checkIn)} – ${fmtLong(checkOut)}`
              : `Check-in: ${fmtLong(checkIn)}`}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
          <p className="text-sm text-gray-400">
            Select a check-in date to see availability.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { const n = addMonths(leftYear, leftMonth, -1); setLeftYear(n.year); setLeftMonth(n.month); }}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => { const n = addMonths(leftYear, leftMonth, 1); setLeftYear(n.year); setLeftMonth(n.month); }}
          aria-label="Next month"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Dual month grids */}
      <div className="flex gap-6 overflow-x-auto">
        <MonthGrid
          year={leftYear} month={leftMonth}
          blockedRanges={blockedRanges}
          checkIn={checkIn} checkOut={checkOut} hovered={hovered}
          onDayClick={handleDayClick} onDayHover={setHovered}
        />
        <div className="hidden sm:block w-px bg-gray-100 shrink-0" />
        <MonthGrid
          year={right.year} month={right.month}
          blockedRanges={blockedRanges}
          checkIn={checkIn} checkOut={checkOut} hovered={hovered}
          onDayClick={handleDayClick} onDayHover={setHovered}
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        {/* Legend */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200">
              12
            </span>
            <span className="text-xs text-gray-500">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs text-gray-300 line-through bg-gray-50 border border-gray-100">
              12
            </span>
            <span className="text-xs text-gray-400">Not available</span>
          </div>
        </div>

        {/* Clear dates */}
        {(checkIn || checkOut) && (
          <button
            onClick={clearDates}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 underline transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear dates
          </button>
        )}
      </div>

      {/* Selected range CTA */}
      {checkIn && checkOut && (
        <div className="mt-5 p-4 rounded-2xl bg-[#378451]/5 border border-[#378451]/20">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {fmtShort(checkIn)} – {fmtShort(checkOut)}
              </span>
              <span className="text-gray-400 ml-2">
                ({nights} night{nights !== 1 ? "s" : ""})
              </span>
            </div>
            <Link
              href={contactHref}
              className="flex items-center gap-1.5 bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Request these dates
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
