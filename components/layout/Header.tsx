"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Building2, Phone, Menu, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Apartments" },
  { href: "/contact", label: "Contact" },
];

const typeOptions = [
  { value: "any", label: "Any type" },
  { value: "room", label: "Room" },
  { value: "apartment", label: "Apartment" },
];

const priceOptions = [
  { value: "any", label: "Any budget" },
  { value: "3000000", label: "Under 3,000,000đ" },
  { value: "5000000", label: "Under 5,000,000đ" },
  { value: "8000000", label: "Under 8,000,000đ" },
  { value: "10000000", label: "Under 10,000,000đ" },
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_HEADERS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function MonthGrid({
  year,
  month,
  selected,
  onSelect,
  today,
}: {
  year: number;
  month: number;
  selected: Date | null;
  onSelect: (d: Date) => void;
  today: Date;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-67 select-none">
      <p className="text-sm font-semibold text-gray-800 text-center mb-4">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isPast = date < todayStart;
          const isSelected = selected && isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                isPast && "text-gray-300 cursor-not-allowed",
                !isPast && !isSelected && "hover:bg-gray-100 text-gray-700",
                isSelected && "bg-[#378451] text-white font-semibold",
                isToday && !isSelected && "font-semibold text-[#378451]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarPicker({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year1 = view.getFullYear();
  const month1 = view.getMonth();
  const next = new Date(year1, month1 + 1, 1);
  const year2 = next.getFullYear();
  const month2 = next.getMonth();

  const prevMonth = () => setView(new Date(year1, month1 - 1, 1));
  const nextMonth = () => setView(new Date(year1, month1 + 1, 1));

  return (
    <div className="select-none">
      {/* Two-month layout with nav arrows on the sides */}
      <div className="relative flex gap-8">
        {/* Prev arrow */}
        <button
          onClick={prevMonth}
          className="absolute -left-2 top-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <MonthGrid year={year1} month={month1} selected={selected} onSelect={onSelect} today={today} />

        <div className="w-px bg-gray-100 self-stretch" />

        <MonthGrid year={year2} month={month2} selected={selected} onSelect={onSelect} today={today} />

        {/* Next arrow */}
        <button
          onClick={nextMonth}
          className="absolute -right-2 top-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {selected && (
        <button
          onClick={() => onSelect(null as unknown as Date)}
          className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
        >
          Clear date
        </button>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<null | "when" | "type" | "price">(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState("any");
  const [selectedPrice, setSelectedPrice] = useState("any");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setActiveSection(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDate) params.set("date", selectedDate.toISOString().split("T")[0]);
    if (selectedType !== "any") params.set("type", selectedType);
    if (selectedPrice !== "any") params.set("maxPrice", selectedPrice);
    const qs = params.toString();
    router.push(`/rooms${qs ? "?" + qs : ""}`);
    setActiveSection(null);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "border-b border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Building2 className="w-7 h-7 text-[#378451]" />
            <span className="font-bold text-xl text-[#378451] hidden sm:block tracking-tight">
              Thanh Ha
            </span>
          </Link>

          {/* Search Pill — desktop */}
          <div ref={searchRef} className="relative hidden md:block">
            <div
              className={cn(
                "flex items-center border rounded-full shadow-sm transition-shadow px-2 py-1.5 bg-white",
                activeSection
                  ? "shadow-md border-gray-300"
                  : "border-gray-200 hover:shadow-md"
              )}
            >
              {/* When */}
              <button
                onClick={() =>
                  setActiveSection(activeSection === "when" ? null : "when")
                }
                className={cn(
                  "flex flex-col items-start px-5 py-1 rounded-full transition-colors cursor-pointer",
                  activeSection === "when" ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <span className="text-xs font-semibold text-gray-800">When</span>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {selectedDate ? formatDate(selectedDate) : "Add dates"}
                </span>
              </button>

              <span className="w-px h-8 bg-gray-200 shrink-0" />

              {/* Room type */}
              <button
                onClick={() =>
                  setActiveSection(activeSection === "type" ? null : "type")
                }
                className={cn(
                  "flex flex-col items-start px-5 py-1 rounded-full transition-colors cursor-pointer",
                  activeSection === "type" ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <span className="text-xs font-semibold text-gray-800">Room type</span>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {typeOptions.find((o) => o.value === selectedType)?.label ?? "Any type"}
                </span>
              </button>

              <span className="w-px h-8 bg-gray-200 shrink-0" />

              {/* Price */}
              <button
                onClick={() =>
                  setActiveSection(activeSection === "price" ? null : "price")
                }
                className={cn(
                  "flex flex-col items-start px-5 py-1 rounded-full transition-colors cursor-pointer",
                  activeSection === "price" ? "bg-gray-100" : "hover:bg-gray-50"
                )}
              >
                <span className="text-xs font-semibold text-gray-800">Price</span>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {priceOptions.find((o) => o.value === selectedPrice)?.label ?? "Any budget"}
                </span>
              </button>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="ml-2 bg-[#378451] hover:bg-[#2D6B42] rounded-full p-3 transition-colors shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* When dropdown — calendar */}
            {activeSection === "when" && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-10 w-max">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Move-in date
                </p>
                <CalendarPicker
                  selected={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setActiveSection(null);
                  }}
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
                  >
                    Clear date
                  </button>
                )}
              </div>
            )}

            {/* Room type dropdown */}
            {activeSection === "type" && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-52 z-10">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Room type
                </p>
                <div className="space-y-1">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedType(opt.value);
                        setActiveSection(null);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors",
                        selectedType === opt.value
                          ? "bg-[#378451] text-white font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price dropdown */}
            {activeSection === "price" && (
              <div className="absolute top-full mt-2 right-14 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-56 z-10">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Max price / month
                </p>
                <div className="space-y-1">
                  {priceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedPrice(opt.value);
                        setActiveSection(null);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors",
                        selectedPrice === opt.value
                          ? "bg-[#378451] text-white font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right actions — desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href="tel:+84909000000"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:bg-gray-100 px-4 py-2.5 rounded-full font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              0909 000 000
            </a>
            <Link
              href="/contact"
              className="bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              Contact us
            </Link>
          </div>

          {/* Mobile: compact search + burger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => router.push("/rooms")}
              className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 shadow-sm bg-white"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-800">Search rooms</span>
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2.5 rounded-full border border-gray-200 hover:shadow-md transition-shadow bg-white"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-gray-700" />
              ) : (
                <Menu className="w-4 h-4 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-2">
          <nav className="space-y-1 mb-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  pathname === href
                    ? "text-[#378451] bg-emerald-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <a
              href="tel:+84909000000"
              className="flex items-center gap-2.5 text-sm text-gray-600 px-4 py-2"
            >
              <Phone className="w-4 h-4 text-[#378451]" />
              0909 000 000
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full bg-[#378451] hover:bg-[#2D6B42] text-white text-sm font-semibold px-4 py-3 rounded-full text-center transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
