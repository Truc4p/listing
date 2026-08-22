"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityRange } from "@/types";

interface Props {
  availabilityRanges: AvailabilityRange[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse ISO date string to a plain { y, m, d } without timezone shift */
function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d }; // m is 0-indexed
}

/** Is the given day (y, m, d) within any of the availability ranges? */
function isAvailable(y: number, m: number, d: number, ranges: AvailabilityRange[]): boolean {
  const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return ranges.some((r) => iso >= r.from && iso <= r.to);
}

/** Is the given day before today? */
function isPast(y: number, m: number, d: number): boolean {
  const today = new Date();
  const t = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return iso < t;
}

/** Is the given day today? */
function isToday(y: number, m: number, d: number): boolean {
  const today = new Date();
  return (
    y === today.getFullYear() &&
    m === today.getMonth() &&
    d === today.getDate()
  );
}

/** Build an array of day cells for a given month (null = empty cell before day 1) */
function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/** Earliest future date in any range, used to seed the start month */
function seedStartMonth(ranges: AvailabilityRange[]): { year: number; month: number } {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Find the earliest range that hasn't fully ended
  const future = ranges
    .filter((r) => r.to >= todayIso)
    .sort((a, b) => (a.from < b.from ? -1 : 1));

  if (future.length > 0) {
    const { y, m } = parseIso(future[0].from);
    // If the range starts in a past month, use today's month
    const tYear = today.getFullYear();
    const tMonth = today.getMonth();
    if (y < tYear || (y === tYear && m < tMonth)) {
      return { year: tYear, month: tMonth };
    }
    return { year: y, month: m };
  }
  return { year: today.getFullYear(), month: today.getMonth() };
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function MonthGrid({
  year,
  month,
  ranges,
}: {
  year: number;
  month: number;
  ranges: AvailabilityRange[];
}) {
  const cells = buildMonthGrid(year, month);
  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 text-center mb-4">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-y-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-[11px] font-semibold text-gray-400 text-center pb-2"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }
          const avail = isAvailable(year, month, day, ranges);
          const past = isPast(year, month, day);
          const today = isToday(year, month, day);
          const unavail = past || !avail;

          return (
            <div key={day} className="flex items-center justify-center aspect-square">
              <span
                className={[
                  "w-9 h-9 flex items-center justify-center rounded-full text-sm select-none",
                  today && avail
                    ? "ring-2 ring-[#378451] font-bold text-[#378451]"
                    : "",
                  unavail
                    ? "text-gray-300 line-through cursor-default"
                    : "font-semibold text-gray-900 cursor-default",
                ]
                  .filter(Boolean)
                  .join(" ")}
                title={avail && !past ? "Available" : "Not available"}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AvailabilityCalendar({ availabilityRanges }: Props) {
  const seed = seedStartMonth(availabilityRanges);
  const [leftYear, setLeftYear] = useState(seed.year);
  const [leftMonth, setLeftMonth] = useState(seed.month);

  const right = addMonths(leftYear, leftMonth, 1);

  function prev() {
    const n = addMonths(leftYear, leftMonth, -1);
    setLeftYear(n.year);
    setLeftMonth(n.month);
  }

  function next() {
    const n = addMonths(leftYear, leftMonth, 1);
    setLeftYear(n.year);
    setLeftMonth(n.month);
  }

  // Don't navigate before current month
  const todayObj = new Date();
  const canGoPrev =
    leftYear > todayObj.getFullYear() ||
    (leftYear === todayObj.getFullYear() && leftMonth > todayObj.getMonth());

  return (
    <div className="pb-8 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Availability
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Bold dates are available to rent. Greyed-out dates are unavailable.
      </p>

      {availabilityRanges.length === 0 ? (
        <p className="text-sm text-gray-400">
          No availability windows set yet. Contact us to check dates.
        </p>
      ) : (
        <div className="select-none">
          {/* Navigation row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prev}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              aria-label="Next month"
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Dual month grid */}
          <div className="flex gap-8">
            <MonthGrid year={leftYear} month={leftMonth} ranges={availabilityRanges} />
            <div className="hidden sm:block w-px bg-gray-100 shrink-0" />
            <MonthGrid year={right.year} month={right.month} ranges={availabilityRanges} />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200">
                12
              </span>
              <span className="text-xs text-gray-500">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 flex items-center justify-center rounded-full text-xs text-gray-300 line-through bg-gray-50 border border-gray-100">
                12
              </span>
              <span className="text-xs text-gray-400">Not available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
