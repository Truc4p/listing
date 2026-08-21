import { getAllRooms } from "@/lib/rooms";
import RoomsFilter from "./RoomsFilter";

export default async function RoomsPage() {
  const rooms = await getAllRooms();

  return (
    <>
      {/* Page header — rendered server-side, fully crawlable */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
          Rooms &amp; Apartments for Rent
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Son Tra, Da Nang · {rooms.length} listings
        </p>
      </div>

      {/* Interactive filter bar + listing grid (client component) */}
      <RoomsFilter initialRooms={rooms} />
    </>
  );
}
