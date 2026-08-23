import { Suspense } from "react";
import { getAllRooms } from "@/lib/rooms";
import RoomsFilter from "./RoomsFilter";

// Always fetch fresh from DB so blocked-date / availability changes
// made in the admin are reflected immediately on Vercel without a redeploy.
export const dynamic = "force-dynamic";

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

      {/*
        RoomsFilter uses useSearchParams() which requires a Suspense boundary
        so Next.js can correctly read URL params on the server during SSR.
        Without this, Vercel receives empty params and filters do nothing.
      */}
      <Suspense fallback={
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: rooms.length }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      }>
        <RoomsFilter initialRooms={rooms} />
      </Suspense>
    </>
  );
}
