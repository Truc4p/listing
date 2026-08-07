import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Rooms & Apartments for Rent",
  description:
    "Browse rooms and apartments for rent at AN Apartment, Son Tra, Da Nang. Fully equipped, affordable pricing.",
  alternates: {
    canonical: "https://ha-apartment.com/rooms",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
