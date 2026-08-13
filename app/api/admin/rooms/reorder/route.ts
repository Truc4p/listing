import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { updateRoomOrder } from "@/lib/rooms";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { roomIds } = await req.json();
  
  if (!Array.isArray(roomIds)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await updateRoomOrder(roomIds);
  return NextResponse.json({ ok: true });
}
