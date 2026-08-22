import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getAllRoomsForAdmin } from "@/lib/rooms";
import CalendarManager from "./CalendarManager";

export const metadata = { title: "Admin — Calendar" };

export default async function CalendarPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const rooms = await getAllRoomsForAdmin();
  return <CalendarManager initialRooms={rooms} />;
}
