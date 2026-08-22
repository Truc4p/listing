"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  Save,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getBlobImageSrc } from "@/lib/blob-url";
import type { Room, BlockedRange } from "@/types";

interface Props {
  initialRooms: Room[];
}

// ─── date helpers ───────────────────────────────────────────────────────────

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayIso(): string {
  const t = new Date();
  return toIso(t.getFullYear(), t.getMonth(), t.getDate());
}

function parseIso(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const { y, m, d } = parseIso(iso);
  return new Date(y, m, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Is an ISO date inside any blocked range? */
function isBlocked(iso: string, ranges: BlockedRange[]): boolean {
  return ranges.some((r) => iso >= r.from && iso <= r.to);
}

/**
 * Toggle a single day: if it is inside a blocked range → unblock it (split or shrink that range).
 * If it is free → add a 1-day blocked range.
 */
function toggleDay(iso: string, ranges: BlockedRange[]): BlockedRange[] {
  if (isBlocked(iso, ranges)) {
    // Remove / trim ranges that contain this day
    const result: BlockedRange[] = [];
    for (const r of ranges) {
      if (iso < r.from || iso > r.to) {
        result.push(r); // untouched
      } else if (r.from === iso && r.to === iso) {
        // exact match → remove
      } else if (r.from === iso) {
        // shrink from start
        const next = nextDay(iso);
        result.push({ ...r, from: next });
      } else if (r.to === iso) {
        // shrink from end
        const prev = prevDay(iso);
        result.push({ ...r, to: prev });
      } else {
        // split
        result.push({ ...r, to: prevDay(iso) });
        result.push({ ...r, from: nextDay(iso) });
      }
    }
    return result;
  } else {
    // Add 1-day range, then merge adjacent/overlapping
    return mergeRanges([...ranges, { from: iso, to: iso }]);
  }
}

/** Block an inclusive range of dates, merge with existing */
function blockRange(from: string, to: string, ranges: BlockedRange[]): BlockedRange[] {
  const [f, t] = from <= to ? [from, to] : [to, from];
  return mergeRanges([...ranges, { from: f, to: t }]);
}

/** Unblock every day in [from, to] */
function unblockRange(from: string, to: string, ranges: BlockedRange[]): BlockedRange[] {
  const [f, t] = from <= to ? [from, to] : [to, from];
  const result: BlockedRange[] = [];
  for (const r of ranges) {
    if (r.to < f || r.from > t) {
      result.push(r);
    } else {
      if (r.from < f) result.push({ ...r, to: prevDay(f) });
      if (r.to > t) result.push({ ...r, from: nextDay(t) });
    }
  }
  return result;
}

function nextDay(iso: string): string {
  const { y, m, d } = parseIso(iso);
  const dt = new Date(y, m, d + 1);
  return toIso(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function prevDay(iso: string): string {
  const { y, m, d } = parseIso(iso);
  const dt = new Date(y, m, d - 1);
  return toIso(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

/** Sort and merge overlapping/adjacent blocked ranges */
function mergeRanges(ranges: BlockedRange[]): BlockedRange[] {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => (a.from < b.from ? -1 : 1));
  const merged: BlockedRange[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const cur = sorted[i];
    // adjacent or overlapping
    if (cur.from <= nextDay(last.to)) {
      merged[merged.length - 1] = {
        from: last.from,
        to: cur.to > last.to ? cur.to : last.to,
        note: last.note,
      };
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

// ─── month calendar sub-component ───────────────────────────────────────────

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface MonthGridProps {
  year: number;
  month: number;
  ranges: BlockedRange[];
  dragStart: string | null;
  dragCurrent: string | null;
  isDraggingBlock: boolean;
  onDayMouseDown: (iso: string) => void;
  onDayMouseEnter: (iso: string) => void;
}

function inDragPreview(iso: string, dragStart: string | null, dragCurrent: string | null): boolean {
  if (!dragStart || !dragCurrent) return false;
  const [a, b] = dragStart <= dragCurrent ? [dragStart, dragCurrent] : [dragCurrent, dragStart];
  return iso >= a && iso <= b;
}

function MonthGrid({
  year, month, ranges,
  dragStart, dragCurrent, isDraggingBlock,
  onDayMouseDown, onDayMouseEnter,
}: MonthGridProps) {
  const firstDay = firstDayOfWeek(year, month);
  const days = daysInMonth(year, month);
  const today = todayIso();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <div className="flex-1 min-w-0 select-none">
      <p className="text-sm font-semibold text-gray-800 text-center mb-3">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-[11px] font-semibold text-gray-400 text-center py-1.5">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const iso = toIso(year, month, day);
          const past = iso < today;
          const blocked = isBlocked(iso, ranges);
          const inDrag = inDragPreview(iso, dragStart, dragCurrent);
          const willBlock = isDraggingBlock;

          // Visual state
          let cellClass =
            "relative flex items-center justify-center h-9 text-sm cursor-pointer rounded-lg transition-colors ";

          if (past) {
            cellClass += "text-gray-300 cursor-default";
          } else if (inDrag) {
            cellClass += willBlock
              ? "bg-red-100 text-red-700 font-semibold"
              : "bg-emerald-100 text-emerald-700 font-semibold";
          } else if (blocked) {
            cellClass += "bg-red-50 text-red-400 line-through";
          } else {
            cellClass += "text-gray-800 font-medium hover:bg-gray-100";
          }

          return (
            <div
              key={iso}
              className={cellClass}
              onMouseDown={past ? undefined : () => onDayMouseDown(iso)}
              onMouseEnter={past ? undefined : () => onDayMouseEnter(iso)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── per-room inline calendar editor ────────────────────────────────────────

interface RoomCalendarEditorProps {
  roomId: string;
  ranges: BlockedRange[];
  onChange: (ranges: BlockedRange[]) => void;
}

function RoomCalendarEditor({ roomId: _roomId, ranges, onChange }: RoomCalendarEditorProps) {
  const today = new Date();
  const [leftYear, setLeftYear] = useState(today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const right = addMonths(leftYear, leftMonth, 1);

  // Drag state
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<string | null>(null);
  // true = dragging to block, false = dragging to unblock
  const isDraggingBlock = useRef<boolean>(true);

  const canGoPrev =
    leftYear > today.getFullYear() ||
    (leftYear === today.getFullYear() && leftMonth > today.getMonth());

  function prev() {
    if (!canGoPrev) return;
    const n = addMonths(leftYear, leftMonth, -1);
    setLeftYear(n.year);
    setLeftMonth(n.month);
  }
  function next() {
    const n = addMonths(leftYear, leftMonth, 1);
    setLeftYear(n.year);
    setLeftMonth(n.month);
  }

  function handleMouseDown(iso: string) {
    const wasBlocked = isBlocked(iso, ranges);
    isDraggingBlock.current = !wasBlocked; // drag intent: block if currently free, unblock if blocked
    setDragStart(iso);
    setDragCurrent(iso);
  }

  function handleMouseEnter(iso: string) {
    if (dragStart) setDragCurrent(iso);
  }

  function handleMouseUp() {
    if (!dragStart || !dragCurrent) return;
    const [a, b] = dragStart <= dragCurrent ? [dragStart, dragCurrent] : [dragCurrent, dragStart];
    let newRanges: BlockedRange[];
    if (a === b) {
      newRanges = toggleDay(a, ranges);
    } else {
      newRanges = isDraggingBlock.current
        ? blockRange(a, b, ranges)
        : unblockRange(a, b, ranges);
    }
    onChange(newRanges);
    setDragStart(null);
    setDragCurrent(null);
  }

  return (
    <div
      className="mt-1"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prev}
          disabled={!canGoPrev}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          type="button"
          onClick={next}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Dual month grid */}
      <div className="flex gap-6">
        <MonthGrid
          year={leftYear} month={leftMonth} ranges={ranges}
          dragStart={dragStart} dragCurrent={dragCurrent}
          isDraggingBlock={isDraggingBlock.current}
          onDayMouseDown={handleMouseDown}
          onDayMouseEnter={handleMouseEnter}
        />
        <div className="w-px bg-gray-100 shrink-0" />
        <MonthGrid
          year={right.year} month={right.month} ranges={ranges}
          dragStart={dragStart} dragCurrent={dragCurrent}
          isDraggingBlock={isDraggingBlock.current}
          onDayMouseDown={handleMouseDown}
          onDayMouseEnter={handleMouseEnter}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-red-50 border border-red-200 inline-block" />
          <span className="text-xs text-gray-500">Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-white border border-gray-200 inline-block" />
          <span className="text-xs text-gray-500">Available</span>
        </div>
        <span className="text-xs text-gray-400 ml-auto">Click or drag to block / unblock</span>
      </div>
    </div>
  );
}

// ─── main CalendarManager ────────────────────────────────────────────────────

interface RoomCalendarState {
  ranges: BlockedRange[];
  saving: boolean;
  saved: boolean;
  error: string | null;
  expanded: boolean;
}

export default function CalendarManager({ initialRooms }: Props) {
  const [calStates, setCalStates] = useState<Record<string, RoomCalendarState>>(
    () => {
      const map: Record<string, RoomCalendarState> = {};
      for (const room of initialRooms) {
        map[room._id] = {
          ranges: room.blockedRanges ?? [],
          saving: false,
          saved: false,
          error: null,
          expanded: false,
        };
      }
      return map;
    }
  );

  function setState(id: string, patch: Partial<RoomCalendarState>) {
    setCalStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  const saveRanges = useCallback(async (id: string) => {
    const { ranges } = calStates[id];
    setState(id, { saving: true, error: null });
    try {
      const res = await fetch(`/api/admin/rooms/${id}/calendar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedRanges: ranges }),
      });
      if (!res.ok) {
        const body = await res.json();
        setState(id, { saving: false, error: body.error ?? "Save failed." });
      } else {
        setState(id, { saving: false, saved: true, error: null });
        setTimeout(() => setState(id, { saved: false }), 3000);
      }
    } catch {
      setState(id, { saving: false, error: "Network error. Please try again." });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calStates]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to rooms
          </Link>
          <span className="text-gray-300">/</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <CalendarRange className="w-4 h-4 text-[#378451]" />
            Calendar &amp; Availability
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View site
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Blocked Dates</h1>
          <p className="text-sm text-gray-500">
            Click or drag on the calendar to mark dates as <strong>unavailable</strong>.
            Click again to unblock. All other dates are available to guests.
          </p>
        </div>

        <div className="space-y-3">
          {initialRooms.map((room) => {
            const cs = calStates[room._id];
            const thumb = room.images?.[0]?.url
              ? getBlobImageSrc(room.images[0].url) ?? room.images[0].url
              : null;

            const blockedCount = cs.ranges.length;
            const firstRange = blockedCount > 0 ? cs.ranges[0] : null;
            const lastRange = blockedCount > 0 ? cs.ranges[blockedCount - 1] : null;

            return (
              <div key={room._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Room header row */}
                <button
                  type="button"
                  onClick={() => setState(room._id, { expanded: !cs.expanded })}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={room.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{room.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {blockedCount === 0
                        ? "No blocked dates"
                        : `${blockedCount} blocked period${blockedCount > 1 ? "s" : ""} · ${formatDate(firstRange!.from)} – ${formatDate(lastRange!.to)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      room.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {room.available ? "Available" : "Rented"}
                    </span>
                    {cs.expanded
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded calendar editor */}
                {cs.expanded && (
                  <div className="border-t border-gray-100 px-6 pb-5 pt-4">
                    <RoomCalendarEditor
                      roomId={room._id}
                      ranges={cs.ranges}
                      onChange={(newRanges) => setState(room._id, { ranges: newRanges, saved: false, error: null })}
                    />

                    {/* Error / success */}
                    {cs.error && (
                      <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-4">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {cs.error}
                      </div>
                    )}
                    {cs.saved && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 mt-4">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Blocked dates saved successfully.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => saveRanges(room._id)}
                        disabled={cs.saving}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-[#378451] hover:bg-[#2D6B42] text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {cs.saving ? "Saving…" : "Save changes"}
                      </button>
                      <a
                        href={`/rooms/${room.slug}`}
                        target="_blank"
                        className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View listing
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
