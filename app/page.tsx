import Link from "next/link";
import {
  ArrowRight,
  Shield,
  MapPin,
  Zap,
  HeadphonesIcon,
  Phone,
  MessageCircle,
  Search,
} from "lucide-react";
import RoomCard from "@/components/listings/RoomCard";
import { getAvailableRooms } from "@/lib/rooms";
import type { Room } from "@/types";

const highlights = [
  {
    Icon: Shield,
    title: "Safety & Security",
    desc: "24/7 cameras, premium smart locks, professional security team",
  },
  {
    Icon: MapPin,
    title: "Prime Location",
    desc: "Son Tra, close to markets, schools, hospitals, easy to get around",
  },
  {
    Icon: Zap,
    title: "Full Amenities",
    desc: "Air conditioning, water heater, high-speed WiFi, modern furnishings",
  },
  {
    Icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "Dedicated management team, fast incident response, attentive service",
  },
];

const stats = [
  { value: "50+", label: "Rooms & apartments" },
  { value: "5+", label: "Years of experience" },
  { value: "200+", label: "Satisfied guests" },
  { value: "100%", label: "Safety" },
];

export default async function HomePage() {
  const availableRooms: Room[] = await getAvailableRooms();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-emerald-50 to-white py-24 md:py-36">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 leading-[1.08] tracking-tight mb-6">
            Find your ideal
            <br />
            <span className="text-[#378451] italic font-medium">
              living space
            </span>
          </h1>

          <p className="text-gray-500 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Rooms and apartments for rent in Son Tra, Da Nang. Safe,
            comfortable, and affordable.
          </p>

          {/* Search pill */}
          <Link
            href="/rooms"
            className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow pl-6 pr-2 py-2 gap-4 max-w-md w-full mx-auto"
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800 text-sm leading-none mb-0.5">
                Search now
              </p>
              <p className="text-gray-400 text-xs">Son Tra · Rooms & Apartments</p>
            </div>
            <span className="bg-[#378451] text-white text-sm font-semibold px-5 py-2.5 rounded-full shrink-0 hover:bg-[#2D6B42] transition-colors">
              Search
            </span>
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-14">
            {stats.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Rooms ───────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Available Rooms
            </h2>
            <Link
              href="/rooms"
              className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-[#378451] transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {availableRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-400 mb-4 text-sm">
                No available rooms yet. Please check back later.
              </p>
              <Link
                href="/rooms"
                className="bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors inline-block"
              >
                Browse all rooms
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[#378451] text-sm font-semibold mb-2">
              Our Promise
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              Why choose Thanh Ha?
            </h2>
            <p className="text-gray-500 mt-3 max-w-md">
              We don&apos;t just rent rooms — we create a real home for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#378451]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#378451]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[#378451] text-sm font-semibold mb-2">Location</p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Find us here
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              75 Luong Huu Khanh, Son Tra, Da Nang
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video max-h-112.5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7859.803493117402!2d108.25824876604854!3d16.108646450291435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314217dfaec2242f%3A0x9567dc61d1470e4c!2zNzUgTMawxqFuZyBI4buvdSBLaMOhbmgsIFPGoW4gVHLDoCwgxJDDoCBO4bq1bmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1779701364657!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Thanh Ha Apartments Location"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#378451] text-sm font-semibold mb-3">Contact</p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
            Ready to find your{" "}
            <span className="text-[#378451] italic font-medium">
              ideal room?
            </span>
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Contact us today for a free consultation and to view rooms in person.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="bg-[#378451] hover:bg-[#2D6B42] text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-sm flex items-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Send a message
            </Link>
            <a
              href="tel:+84909000000"
              className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-full text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 0389 609 627
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
