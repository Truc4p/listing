import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getRoomById, updateRoomAvailability } from "@/lib/rooms";
import type { AvailabilityRange } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

/** GET /api/admin/rooms/:id/calendar — return existing availability ranges */
export async function GET(_req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ availabilityRanges: room.availabilityRanges ?? [] });
}

/** PUT /api/admin/rooms/:id/calendar — replace availability ranges */
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  // Validate shape
  if (!Array.isArray(body.availabilityRanges)) {
    return NextResponse.json({ error: "availabilityRanges must be an array" }, { status: 400 });
  }

  for (const range of body.availabilityRanges as AvailabilityRange[]) {
    if (typeof range.from !== "string" || typeof range.to !== "string") {
      return NextResponse.json({ error: "Each range must have from and to strings" }, { status: 400 });
    }
    if (range.from > range.to) {
      return NextResponse.json({ error: `Range from (${range.from}) must be before to (${range.to})` }, { status: 400 });
    }
  }

  const ok = await updateRoomAvailability(id, body.availabilityRanges);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
