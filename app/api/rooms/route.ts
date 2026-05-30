import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/rooms";

export async function GET() {
  try {
    const rooms = await getAllRooms();
    return NextResponse.json(rooms);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
