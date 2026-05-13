import Link from "next/link";
import { Building2, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#faf7f2] text-[#6b6b6b] border-t border-[#e8ddd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-sm bg-[#c9a84c] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-[15px] font-semibold text-[#1a1a1a] tracking-wide">
                  Căn Hộ Thanh Hà
                </span>
                <span className="block text-[9px] text-[#c9a84c] uppercase tracking-[3px]">
                  Luxury Rentals
                </span>
              </div>
            </div>
            <p className="text-sm text-[#9a8a7a] leading-relaxed mb-6 font-light">
              Không gian sống tinh tế, an toàn và đẳng cấp dành cho những ai
              trân trọng chất lượng cuộc sống tại trung tâm Sài Gòn.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#e8ddd0] hover:border-[#c9a84c] text-[#9a8a7a] hover:text-[#c9a84c] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://zalo.me/0909000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#e8ddd0] hover:border-[#c9a84c] text-[#9a8a7a] hover:text-[#c9a84c] flex items-center justify-center transition-colors"
                aria-label="Zalo"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px] mb-5">
              Điều hướng
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/rooms", label: "Danh sách phòng & căn hộ" },
                { href: "/rooms?type=room", label: "Phòng trọ" },
                { href: "/rooms?type=apartment", label: "Căn hộ" },
                { href: "/contact", label: "Liên hệ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#9a8a7a] hover:text-[#c9a84c] transition-colors flex items-center gap-2 font-light"
                  >
                    <span className="w-3 h-px bg-[#c9a84c] opacity-50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#c9a84c] text-[10px] font-medium uppercase tracking-[4px] mb-5">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                <span className="text-[#9a8a7a] font-light">
                  123 Đường Thanh Hà, Phường 1,
                  <br />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <a
                  href="tel:+84909000000"
                  className="text-[#9a8a7a] hover:text-[#c9a84c] transition-colors font-light"
                >
                  0909 000 000
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <a
                  href="mailto:info@canhothanhha.vn"
                  className="text-[#9a8a7a] hover:text-[#c9a84c] transition-colors font-light"
                >
                  info@canhothanhha.vn
                </a>
              </li>
            </ul>
            <div className="mt-5 p-4 border border-[#e8ddd0] bg-white">
              <p className="text-xs text-[#9a8a7a] font-light">
                <span className="text-[#c9a84c] font-medium block mb-1">
                  Giờ làm việc
                </span>
                Thứ 2 – Chủ nhật · 8:00 – 21:00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#e8ddd0] text-center text-xs text-[#b8a890]">
          © {currentYear} Căn Hộ Thanh Hà · All rights reserved
        </div>
      </div>
    </footer>
  );
}
