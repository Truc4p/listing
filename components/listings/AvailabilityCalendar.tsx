"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlockedRange } from "@/types";

interface Props {
  blockedRanges: BlockedRange[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Is the given day inside any blocked range? */
function isBlocked(y: number, m: number, d: number, ranges: BlockedRange[]): boolean {
  const iso = toIso(y, m, d);
  return ranges.some((r) => iso >= r.from && iso <= r.to);
}

/** Is the given day before today? */
function isPast(y: number, m: number, d: number): boolean {
  const today = new Date();
  return toIso(y, m, d) < toIso(today.getFullYear(), today.getMonth(), today.getDate());
}

/** Is the given day today? */
function isToday(y: number, m: number, d: number): boolean {
  const today = new Date();
  return y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
}

/** Build cell array for a month grid (null = padding before day 1) */
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

function MonthGrid({
  year,
  month,
  blockedRanges,
}: {
  year: number;
  month: number;
  blockedRanges: BlockedRange[];
}) {
  const cells = buildMonthGrid(year, month);
  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 text-center mb-4">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-y-1">
        {DAYS.map((d) => (
          <div key={d} className="text-[11px] font-semibold text-gray-400 text-center pb-2">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const blocked = isBlocked(year, month, day, blockedRanges);
          const past = isPast(year, month, day);
          const today = isToday(year, month, day);

          // A day is "unavailable" if it's in the past OR explicitly blocked
          const unavailable = past || blocked;

          return (
            <div key={day} className="flex items-center justify-center aspect-square">
              <span
                className={[
                  "w-9 h-9 flex items-center justify-center rounded-full text-sm select-none cursor-default",
                  today && !unavailable
                    ? "ring-2 ring-[#378451] font-bold text-[#378451]"
                    : "",
                  unavailable
                    ? "text-gray-300 line-through"
                    : "font-semibold text-gray-900",
                ]
                  .filter(Boolean)
                  .join(" ")}
                title={unavailable ? (blocked ? "Not available (blocked)" : "Past date") : "Available"}
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

export default function AvailabilityCalendar({ blockedRanges }: Props) {
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth());

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

  const canGoPrev =
    leftYear > today.getFullYear() ||
    (leftYear === today.getFullYear() && leftMonth > today.getMonth());

  return (
    <div className="pb-8 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Availability</h2>
      <p className="text-sm text-gray-400 mb-6">
        Bold dates are available. Greyed-out dates are unavailable or blocked.
      </p>

      <div className="select-none">
        {/* Navigation */}
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
          <MonthGrid year={leftYear} month={leftMonth} blockedRanges={blockedRanges} />
          <div className="hidden sm:block w-px bg-gray-100 shrink-0" />
          <MonthGrid year={right.year} month={right.month} blockedRanges={blockedRanges} />
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
    </div>
  );
}
