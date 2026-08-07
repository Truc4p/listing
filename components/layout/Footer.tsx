import Link from "next/link";
import { Building2, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-[#378451]" />
              <span className="font-bold text-lg text-gray-900">Ha Apartments</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Quality rooms and apartments in Son Tra,
              Da Nang.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#378451] hover:text-[#378451] text-gray-400 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://wa.me/84389609627"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#378451] hover:text-[#378451] text-gray-400 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://zalo.me/0932117341"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#378451] hover:text-[#378451] text-gray-400 flex items-center justify-center transition-colors shadow-sm text-[10px] font-semibold"
                aria-label="Zalo 0932117341"
              >
                Zalo
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/rooms", label: "All rooms" },
                { href: "/rooms?type=room", label: "Rooms" },
                { href: "/rooms?type=apartment", label: "Apartments" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#378451] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-500">
                  75 Luong Huu Khanh, Son Tra, Da Nang
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#378451] shrink-0" />
                <a
                  href="tel:+84909000000"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  0389 609 627
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#378451] shrink-0" />
                <a
                  href="mailto:info@ha-apartment.com"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  info@ha-apartment.com
                </a>
              </li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs text-gray-600 font-medium">
                Open Mon – Sun · 8:00 – 21:00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>© {currentYear} Ha Apartments · All rights reserved</span>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-[#378451]">♥</span>
            <span>in Da Nang</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
