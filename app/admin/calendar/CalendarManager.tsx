"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CalendarRange,
  Plus,
  Trash2,
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

interface RoomCalendarState {
  ranges: BlockedRange[];
  saving: boolean;
  saved: boolean;
  error: string | null;
  expanded: boolean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function rangesOverlap(a: BlockedRange, b: BlockedRange): boolean {
  return a.from <= b.to && b.from <= a.to;
}

function validateRanges(ranges: BlockedRange[]): string | null {
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (!r.from || !r.to) return `Range ${i + 1}: both start and end dates are required.`;
    if (r.from > r.to) return `Range ${i + 1}: start date must be on or before end date.`;
  }
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (rangesOverlap(ranges[i], ranges[j])) {
        return `Ranges ${i + 1} and ${j + 1} overlap. Please adjust the dates.`;
      }
    }
  }
  return null;
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

  function addRange(id: string) {
    const existing = calStates[id].ranges;
    setState(id, {
      ranges: [...existing, { from: today(), to: today(), note: "" }],
      saved: false,
      error: null,
    });
  }

  function removeRange(id: string, index: number) {
    const ranges = calStates[id].ranges.filter((_, i) => i !== index);
    setState(id, { ranges, saved: false, error: null });
  }

  function updateRange(
    id: string,
    index: number,
    field: keyof BlockedRange,
    value: string
  ) {
    const ranges = calStates[id].ranges.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    setState(id, { ranges, saved: false, error: null });
  }

  const saveRanges = useCallback(async (id: string) => {
    const { ranges } = calStates[id];
    const validationError = validateRanges(ranges);
    if (validationError) {
      setState(id, { error: validationError });
      return;
    }
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

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Blocked Dates
          </h1>
          <p className="text-sm text-gray-500">
            Mark date ranges when a listing is <strong>not available</strong> — e.g. already rented, under maintenance, or reserved.
            All other dates are shown as available to guests.
          </p>
        </div>

        <div className="space-y-3">
          {initialRooms.map((room) => {
            const cs = calStates[room._id];
            const thumb = room.images?.[0]?.url
              ? getBlobImageSrc(room.images[0].url) ?? room.images[0].url
              : null;

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Room header row */}
                <button
                  type="button"
                  onClick={() => setState(room._id, { expanded: !cs.expanded })}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={room.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{room.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cs.ranges.length === 0
                        ? "No blocked dates"
                        : `${cs.ranges.length} blocked period${cs.ranges.length > 1 ? "s" : ""} · ${formatDate(cs.ranges[0].from)} – ${formatDate(cs.ranges[cs.ranges.length - 1].to)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        room.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {room.available ? "Available" : "Rented"}
                    </span>
                    {cs.expanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded editor */}
                {cs.expanded && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    {/* Ranges list */}
                    {cs.ranges.length === 0 ? (
                      <p className="text-sm text-gray-400 mb-4">
                        No blocked periods yet. Add one below to mark dates as unavailable.
                      </p>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {cs.ranges.map((range, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                          >
                            <div className="flex items-center gap-2 flex-1 flex-wrap">
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                  From
                                </label>
                                <input
                                  type="date"
                                  value={range.from}
                                  onChange={(e) =>
                                    updateRange(room._id, i, "from", e.target.value)
                                  }
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                                />
                              </div>
                              <span className="text-gray-400 mt-5">→</span>
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                  To
                                </label>
                                <input
                                  type="date"
                                  value={range.to}
                                  min={range.from}
                                  onChange={(e) =>
                                    updateRange(room._id, i, "to", e.target.value)
                                  }
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                                />
                              </div>
                              <div className="flex flex-col gap-0.5 flex-1 min-w-[140px]">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                  Note (optional)
                                </label>
                                <input
                                  type="text"
                                  value={range.note ?? ""}
                                  onChange={(e) =>
                                    updateRange(room._id, i, "note", e.target.value)
                                  }
                                  placeholder="e.g. Occupied, maintenance…"
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#378451]"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRange(room._id, i)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-1 sm:mt-0"
                              aria-label="Remove blocked period"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Error / success */}
                    {cs.error && (
                      <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {cs.error}
                      </div>
                    )}
                    {cs.saved && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 mb-4">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Blocked dates saved successfully.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => addRange(room._id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#378451] border border-[#378451] px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Block dates
                      </button>
                      <button
                        type="button"
                        onClick={() => saveRanges(room._id)}
                        disabled={cs.saving}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-[#378451] hover:bg-[#2D6B42] text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {cs.saving ? "Saving…" : "Save"}
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
