import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getAllRoomsForAdmin, createRoom } from "@/lib/rooms";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rooms = await getAllRoomsForAdmin();
  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const room = await createRoom(data);
  return NextResponse.json(room, { status: 201 });
}
