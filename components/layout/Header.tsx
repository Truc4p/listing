"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Building2, Phone, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/rooms", label: "Phòng & Căn hộ" },
  { href: "/contact", label: "Liên hệ" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/6 shadow-sm shadow-black/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c] flex items-center justify-center group-hover:bg-[#b8963e] transition-colors shadow-md shadow-[#c9a84c]/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-[15px] font-semibold text-[#1a1a1a] tracking-wide font-heading">
                Căn Hộ Thanh Hà
              </span>
              <span className="block text-[10px] text-[#9a8a7a] uppercase tracking-[3px]">
                Luxury Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full",
                  pathname === href
                    ? "text-[#c9a84c] bg-[#c9a84c]/8"
                    : "text-[#4a3f35] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+84909000000"
              className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              0909 000 000
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants(),
                "bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm border-0 px-5 rounded-md shadow-md shadow-[#c9a84c]/20"
              )}
            >
              Liên hệ ngay
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#4a3f35] hover:text-[#c9a84c] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/6 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
                pathname === href
                  ? "text-[#c9a84c] bg-[#c9a84c]/8"
                  : "text-[#4a3f35] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a
              href="tel:+84909000000"
              className="flex items-center gap-2 text-sm text-[#6b6b6b] px-4 py-2"
            >
              <Phone className="w-4 h-4 text-[#c9a84c]" />
              0909 000 000
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={cn(
                buttonVariants(),
                "w-full bg-[#c9a84c] hover:bg-[#b8963e] text-white border-0 rounded-md justify-center shadow-md shadow-[#c9a84c]/20"
              )}
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
