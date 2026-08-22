import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getRoomById, updateRoomAvailability } from "@/lib/rooms";
import type { BlockedRange } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

/** GET /api/admin/rooms/:id/calendar — return existing blocked ranges */
export async function GET(_req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ blockedRanges: room.blockedRanges ?? [] });
}

/** PUT /api/admin/rooms/:id/calendar — replace blocked ranges */
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  // Validate shape
  if (!Array.isArray(body.blockedRanges)) {
    return NextResponse.json({ error: "blockedRanges must be an array" }, { status: 400 });
  }

  for (const range of body.blockedRanges as BlockedRange[]) {
    if (typeof range.from !== "string" || typeof range.to !== "string") {
      return NextResponse.json({ error: "Each range must have from and to strings" }, { status: 400 });
    }
    if (range.from > range.to) {
      return NextResponse.json({ error: `Range from (${range.from}) must be before to (${range.to})` }, { status: 400 });
    }
  }

  const ok = await updateRoomAvailability(id, body.blockedRanges);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
