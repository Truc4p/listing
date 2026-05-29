"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Building2, Phone, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Apartments" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <button
            onClick={() => router.push("/rooms")}
            className="hidden md:flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow px-2 py-1.5 gap-0 bg-white cursor-pointer"
          >
            <div className="flex flex-col items-start px-5 py-1">
              <span className="text-xs font-semibold text-gray-800">Where</span>
              <span className="text-sm text-gray-400">Search rooms</span>
            </div>
            <span className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-start px-5 py-1">
              <span className="text-xs font-semibold text-gray-800">Room type</span>
              <span className="text-sm text-gray-400">Any type</span>
            </div>
            <span className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-start px-5 py-1">
              <span className="text-xs font-semibold text-gray-800">Price</span>
              <span className="text-sm text-gray-400">Any budget</span>
            </div>
            <div className="ml-2 bg-[#378451] rounded-full p-3">
              <Search className="w-4 h-4 text-white" />
            </div>
          </button>

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
